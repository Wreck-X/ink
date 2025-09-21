#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod epub;
mod plugins;
mod state;

use state::AppState;

fn main() {
    tauri::Builder::default()
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            commands::open_epub,
            commands::list_chapters,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Tauri app");
}