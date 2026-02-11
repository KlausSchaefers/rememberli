// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use serde_json::{Value, from_str, to_string_pretty, json};
use tauri::command;

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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, load_json_file, save_json_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}