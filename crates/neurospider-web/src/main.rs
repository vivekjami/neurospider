//! NeuroSpider Web Server Entry Point

use neurospider_web::{WebResult, VERSION};
use tracing::{info, Level};

#[tokio::main]
async fn main() -> WebResult<()> {
    // Initialize tracing
    tracing_subscriber::fmt().with_max_level(Level::INFO).init();

    info!("Starting NeuroSpider Web Dashboard v{}", VERSION);
    info!("Basic setup complete - Day 1 foundation ready");

    Ok(())
}
