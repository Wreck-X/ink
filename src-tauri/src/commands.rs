use tauri::{command, State};
use epub::doc::EpubDoc;
use crate::state::AppState;
//Global state to hold the currently opened document.

#[command]
pub fn open_epub(path: String, state: State<AppState>) -> Result<String, String> {
    let doc = EpubDoc::new(&path).map_err(|e| format!("Failed to parse EPUB: {}", e))?;
    
    let title = doc.mdata("title")
        .unwrap_or_else(|| "Unknown Title".to_string());

    *state.current_doc.lock().unwrap() = Some(doc);
    *state.current_path.lock().unwrap() = Some(path);

    Ok(title)
}

#[command]
pub fn list_chapters(state: State<AppState>) -> Result<Vec<String>, String> {
    let mut doc_guard = state.current_doc.lock().unwrap();
    let doc = doc_guard.as_mut().ok_or("No EPUB currently open")?;
    
    let mut chapters = Vec::new();
    let num_pages = doc.get_num_pages();
    
    for i in 0..num_pages {
        if doc.set_current_page(i) {
            // Try to get the page ID (like "chapter1.xhtml")
            if let Some(page_id) = doc.get_current_id() {
                // Clean up the ID to make a nice chapter name
                let chapter_name = page_id
                    .replace(".xhtml", "")
                    .replace(".html", "")
                    .replace("-", " ")
                    .replace("_", " ");
                
                chapters.push(if chapter_name.is_empty() {
                    format!("Chapter {}", i + 1)
                } else {
                    chapter_name
                });
            } else {
                chapters.push(format!("Chapter {}", i + 1));
            }
        } else {
            chapters.push(format!("Chapter {}", i + 1));
        }
    }
    
    Ok(chapters)
}