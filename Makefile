.PHONY: build test bench lint audit coverage dev clean docs validate install-tools update

# Install development tools
install-tools:
	cargo install cargo-watch
	cargo install cargo-audit
	cargo install cargo-tarpaulin
	cargo install cargo-machete
	cargo install sqlx-cli

# Development commands
dev:
	cargo watch -x "check --workspace" -x "test --workspace"

build:
	cargo build --workspace

test:
	cargo test --workspace --verbose

bench:
	cargo bench --workspace

lint:
	cargo clippy --workspace -- -D warnings
	cargo fmt --all -- --check

audit:
	cargo audit

coverage:
	cargo tarpaulin --workspace --out Html --output-dir target/coverage

unused-deps:
	cargo machete

clean:
	cargo clean

# Documentation
docs:
	cargo doc --workspace --no-deps --open

# Update dependencies
update:
	cargo update --verbose
	@echo "🔄 Dependencies updated!"

# Validation
validate: test lint audit
	@echo "✅ Day 1 setup validation complete!"
