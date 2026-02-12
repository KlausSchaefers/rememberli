// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use serde_json::{Value, from_str, to_string_pretty, json};
use tauri::command;
use std::process::Command;

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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, load_json_file, save_json_file, open_shell, run_shell_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}