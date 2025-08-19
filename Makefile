.PHONY: build test bench lint audit dev clean docker

# Development commands
dev:
	cargo watch -x "check --workspace" -x "test --workspace"

build:
	cargo build --workspace --release

test:
	cargo test --workspace --verbose

bench:
	cargo bench --workspace

lint:
	cargo clippy --workspace -- -D warnings
	cargo fmt --all -- --check

audit:
	cargo audit

clean:
	cargo clean

# Docker commands  
docker-build:
	docker build -t neurospider:latest .

docker-run:
	docker run --rm -p 8080:8080 neurospider:latest

# Database setup
db-setup:
	# Commands to setup FoundationDB and Pulsar locally
	docker-compose up -d fdb pulsar

db-migrate:
	# Run database migrations
	cargo run --bin neurospider-cli migrate

# Production commands
release:
	cargo build --workspace --release --target x86_64-unknown-linux-musl

# Documentation
docs:
	cargo doc --workspace --no-deps --open