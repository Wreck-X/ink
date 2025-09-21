use epub::doc::EpubDoc;
use std::sync::Mutex;

pub struct AppState {
    pub current_doc: Mutex<Option<EpubDoc<std::io::BufReader<std::fs::File>>>>,
    pub current_path: Mutex<Option<String>>,
}

impl AppState {
    pub fn new() -> Self {
        AppState {
            current_doc: Mutex::new(None),
            current_path: Mutex::new(None),
        }
    }
}