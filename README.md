# NeuroSpider

Next-generation AI-powered web crawling platform built in Rust.

## Project Structure

```
neurospider/
├── Cargo.toml              # Workspace configuration
├── crates/
│   ├── neurospider-core/   # Core crawling engine
│   ├── neurospider-ai/     # AI/ML integration
│   ├── neurospider-security/ # Security & crypto
│   ├── neurospider-storage/  # Database abstractions
│   ├── neurospider-api/    # REST API server
│   ├── neurospider-cli/    # Command line interface
│   └── neurospider-web/    # Web dashboard
├── docker/                 # Container configurations
├── k8s/                   # Kubernetes manifests
├── docs/                  # Documentation
├── benchmarks/            # Performance tests
├── security/              # Security audits & configs
└── examples/              # Usage examples
```

## Quick Start

```bash
# Build all crates
make build

# Run tests
make test

# Start development mode
make dev

# Run linting
make lint
```

## Development

This project uses a Cargo workspace with multiple crates for modular development.

## License

MIT OR Apache-2.0