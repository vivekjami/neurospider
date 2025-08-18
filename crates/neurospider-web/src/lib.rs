//! NeuroSpider Web - Dashboard and Web Interface
//!
//! This crate provides the web-based management interface
//! for monitoring and controlling crawling operations.

use thiserror::Error;

#[derive(Error, Debug)]
pub enum WebError {
    #[error("Server error: {0}")]
    ServerError(String),
    #[error("Route not found: {0}")]
    NotFound(String),
}

pub type WebResult<T> = Result<T, WebError>;

/// Web server version information
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_version() {
        assert!(!VERSION.is_empty());
    }
}
