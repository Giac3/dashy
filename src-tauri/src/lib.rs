use tauri::{
    async_runtime::{spawn, Mutex},
    Manager,
};
use tokio_postgres::{Client, NoTls};

struct AppState {
    client: Option<Client>,
}

#[tauri::command]
async fn execute_query(
    state: tauri::State<'_, Mutex<AppState>>,
    query: &str,
) -> Result<String, String> {
    let state = state.lock().await;

    let client = match state.client {
        Some(ref client) => client,
        None => {
            return Err("No client".to_string());
        }
    };

    let formatted_query = format!(
        "SELECT
            json_agg(row_to_json(sub))::text
        FROM
        ({}) AS sub;",
        query
    );
    println!("Executing query: {}", formatted_query);

    let row = client
        .query(&formatted_query, &[])
        .await
        .map_err(|e| e.to_string())?;

    return Ok(row[0].get::<_, String>(0).to_string());
}

#[tauri::command]
async fn connect(state: tauri::State<'_, Mutex<AppState>>, url: &str) -> Result<String, String> {
    let mut state = state.lock().await;

    let (client, connection) = tokio_postgres::connect(url, NoTls)
        .await
        .map_err(|e| e.to_string())?;

    spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    state.client.replace(client);

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
                app.manage(Mutex::new(AppState { client: None }));
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
