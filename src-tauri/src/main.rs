// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use serde_json::{Value, from_str, to_string_pretty, json};
use tauri::command;
use std::process::Command;
use gliner::model::{GLiNER, input::text::TextInput, params::Parameters};
use gliner::model::pipeline::token::TokenMode;
use orp::params::RuntimeParameters;
use futures_util::StreamExt;

const TOKENIZER_URL: &str = "https://huggingface.co/onnx-community/gliner_small-v2.1/resolve/main/tokenizer.json";
const MODEL_URL: &str = "https://huggingface.co/onnx-community/gliner_small-v2.1/resolve/main/onnx/model_quantized.onnx";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[command]
fn load_json_file(file_path: String) -> Result<Value, String> {
    match fs::read_to_string(&file_path) {
        Ok(content) => {
            match from_str::<Value>(&content) {
                Ok(json_content) => Ok(json!({
                    "url": file_path,
                    "content": json_content
                })),
                Err(e) => Err(format!("Failed to parse JSON: {}", e))
            }
        }
        Err(e) => Err(format!("Failed to read file: {}", e))
    }
}

#[command]
fn save_json_file(file_path: String, data: Value) -> Result<(), String> {
    match to_string_pretty(&data) {
        Ok(json_string) => {
            match fs::write(&file_path, json_string) {
                Ok(_) => Ok(()),
                Err(e) => Err(format!("Failed to write file: {}", e))
            }
        }
        Err(e) => Err(format!("Failed to serialize JSON: {}", e))
    }
}

#[command]
fn open_shell() -> Result<String, String> {
    #[cfg(target_os = "macos")]
    {
        match Command::new("open")
            .arg("-a")
            .arg("Terminal")
            .spawn() {
                Ok(_) => Ok("Terminal opened successfully".to_string()),
                Err(e) => Err(format!("Failed to open terminal: {}", e))
            }
    }

    #[cfg(target_os = "linux")]
    {
        // Try common Linux terminals in order
        let terminals = vec!["gnome-terminal", "konsole", "xfce4-terminal", "xterm"];
        
        for terminal in terminals {
            if let Ok(_) = Command::new(terminal).spawn() {
                return Ok(format!("{} opened successfully", terminal));
            }
        }
        Err("No supported terminal found".to_string())
    }

    #[cfg(target_os = "windows")]
    {
        match Command::new("cmd")
            .arg("/c")
            .arg("start")
            .arg("cmd")
            .spawn() {
                Ok(_) => Ok("Command Prompt opened successfully".to_string()),
                Err(e) => Err(format!("Failed to open command prompt: {}", e))
            }
    }

    #[cfg(not(any(target_os = "macos", target_os = "linux", target_os = "windows")))]
    {
        Err("Unsupported operating system".to_string())
    }
}

#[command]
fn run_shell_command(command: String) -> Result<String, String> {
    #[cfg(target_os = "macos")]
    {
        // Use AppleScript to open Terminal, paste command, and execute it
        let script = format!(
            r#"tell application "Terminal"
                activate
                do script "{}"
            end tell"#,
            command.replace("\"", "\\\"").replace("\n", "\\n")
        );
        
        match Command::new("osascript")
            .arg("-e")
            .arg(&script)
            .spawn() {
                Ok(_) => Ok("Command executed in new Terminal window".to_string()),
                Err(e) => Err(format!("Failed to open terminal with command: {}", e))
            }
    }

    #[cfg(target_os = "linux")]
    {
        // Try common Linux terminals with command execution
        let gnome_cmd = format!("{}; exec bash", command);
        let konsole_cmd = format!("{}; exec bash", command);
        let xfce_cmd = format!("bash -c '{}; exec bash'", command);
        let xterm_cmd = format!("{}; exec bash", command);
        
        let terminals = vec![
            ("gnome-terminal", vec!["--", "bash", "-c", &gnome_cmd]),
            ("konsole", vec!["-e", "bash", "-c", &konsole_cmd]),
            ("xfce4-terminal", vec!["-e", &xfce_cmd]),
            ("xterm", vec!["-e", "bash", "-c", &xterm_cmd]),
        ];
        
        for (terminal, args) in terminals {
            if let Ok(_) = Command::new(terminal).args(&args).spawn() {
                return Ok(format!("Command executed in {}", terminal));
            }
        }
        Err("No supported terminal found".to_string())
    }

    #[cfg(target_os = "windows")]
    {
        // Open Command Prompt and execute the command (window stays open with /k)
        match Command::new("cmd")
            .args(&["/k", &command])
            .spawn() {
                Ok(_) => Ok("Command executed in Command Prompt".to_string()),
                Err(e) => Err(format!("Failed to open command prompt with command: {}", e))
            }
    }

    #[cfg(not(any(target_os = "macos", target_os = "linux", target_os = "windows")))]
    {
        Err("Unsupported operating system".to_string())
    }
}

#[derive(serde::Serialize, Clone)]
struct ModelPaths {
    tokenizer_path: String,
    model_path: String,
}

async fn download_file(url: &str, dest: &std::path::Path) -> Result<(), String> {
    use tokio::io::AsyncWriteExt;

    let response = reqwest::get(url).await.map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!("HTTP {} downloading {}", response.status(), url));
    }

    let mut file = tokio::fs::File::create(dest).await.map_err(|e| e.to_string())?;
    let mut stream = response.bytes_stream();

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| e.to_string())?;
        file.write_all(&chunk).await.map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[command]
async fn download_models() -> Result<ModelPaths, String> {
    let data_dir = dirs::data_dir().ok_or("Could not determine data directory")?;
    let model_dir = data_dir.join("rememberli");

    tokio::fs::create_dir_all(&model_dir).await.map_err(|e| e.to_string())?;

    let tokenizer_path = model_dir.join("tokenizer.json");
    let model_path = model_dir.join("model.onnx");

    if !tokenizer_path.exists() {
        download_file(TOKENIZER_URL, &tokenizer_path).await?;
    }

    if !model_path.exists() {
        download_file(MODEL_URL, &model_path).await?;
    }

    Ok(ModelPaths {
        tokenizer_path: tokenizer_path.to_string_lossy().into_owned(),
        model_path: model_path.to_string_lossy().into_owned(),
    })
}

#[derive(serde::Serialize)]
struct GlinerSpan {
    sequence: usize,
    text: String,
    class: String,
    probability: f32,
}

#[command]
fn run_gliner(
    texts: Vec<String>,
    labels: Vec<String>,
    tokenizer_path: String,
    model_path: String,
) -> Result<Vec<GlinerSpan>, String> {
    let model = GLiNER::<TokenMode>::new(
        Parameters::default(),
        RuntimeParameters::default(),
        &tokenizer_path,
        &model_path,
    )
    .map_err(|e| e.to_string())?;

    let texts_refs: Vec<&str> = texts.iter().map(|s| s.as_str()).collect();
    let labels_refs: Vec<&str> = labels.iter().map(|s| s.as_str()).collect();

    let input = TextInput::from_str(&texts_refs, &labels_refs)
        .map_err(|e| e.to_string())?;

    let output = model.inference(input)
        .map_err(|e| e.to_string())?;

    let mut results = Vec::new();
    for spans in output.spans {
        for span in spans {
            results.push(GlinerSpan {
                sequence: span.sequence(),
                text: span.text().to_string(),
                class: span.class().to_string(),
                probability: span.probability(),
            });
        }
    }

    Ok(results)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, load_json_file, save_json_file, open_shell, run_shell_command, run_gliner, download_models])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}