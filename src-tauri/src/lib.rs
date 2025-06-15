use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use base64::{prelude::BASE64_STANDARD, Engine};
use rand::Rng;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use tauri::{async_runtime::Mutex, Manager};
type Db = Pool<Postgres>;

struct AppState {
    db: Option<Db>,
}

#[tauri::command]
async fn execute_query(
    state: tauri::State<'_, Mutex<AppState>>,
    query: &str,
) -> Result<String, String> {
    let state = state.lock().await;
    let pool = match state.db {
        Some(ref db) => db,
        None => {
            return Err("No database pool".to_string());
        }
    };

    if pool.is_closed() {
        return Err("Connection closed".to_string());
    }

    let formatted_query = format!(
        "SELECT
            json_agg(row_to_json(sub))::text
        FROM
        ({}) AS sub;",
        query
    );
    println!("Executing query: {}", formatted_query);

    let row: (String,) = sqlx::query_as(&formatted_query)
        .fetch_one(pool)
        .await
        .unwrap();

    return Ok(row.0);
}

#[tauri::command]
async fn connect(state: tauri::State<'_, Mutex<AppState>>, url: &str) -> Result<String, String> {
    let mut state = state.lock().await;

    if let Some(db) = &state.db {
        if !db.is_closed() {
            db.close().await;
        }
    }

    let db = PgPoolOptions::new()
        .max_connections(1)
        .connect(url)
        .await
        .unwrap();

    state.db.replace(db.clone());

    return Ok("Connected to database".to_string());
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![execute_query, connect])
        .setup(|app| {
            let salt_path = app
                .path()
                .app_local_data_dir()
                .expect("could not resolve app local data path")
                .join("salt.txt");

            app.handle()
                .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;
            tauri::async_runtime::block_on(async move {
                app.manage(Mutex::new(AppState { db: None }));
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
