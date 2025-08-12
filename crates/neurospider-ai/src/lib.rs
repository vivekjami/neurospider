//! NeuroSpider AI - Intelligence layer for content analysis
//! 
//! This crate provides LLM integration, content quality scoring,
//! and vector database functionality.

pub mod llm_client;
pub mod quality_scorer;
pub mod vector_db;
pub mod content_classifier;

pub use quality_scorer::*;
