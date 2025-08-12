//! NeuroSpider Core - High-performance web crawling engine
//! 
//! This crate contains the core crawling logic, HTTP client management,
//! and distributed coordination systems.

pub mod crawler;
pub mod http_client;
pub mod coordinator;
pub mod rate_limiter;

pub use crawler::*;
