//! NeuroSpider Core - High-Performance Web Crawling Engine
//!
//! This crate provides the core functionality for NeuroSpider's distributed
//! web crawling platform, built with Rust for maximum performance and safety.

use thiserror::Error;

#[derive(Error, Debug)]
pub enum CoreError {
    #[error("HTTP request failed: {0}")]
    HttpError(String),
    #[error("Parsing error: {0}")]
    ParseError(String),
    #[error("Configuration error: {0}")]
    ConfigError(String),
}

pub type CoreResult<T> = Result<T, CoreError>;

/// Core version information
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_version() {
        assert!(!VERSION.is_empty());
    }
}
