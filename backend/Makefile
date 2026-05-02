# Invenzo SCM Backend — Makefile

.PHONY: run build tidy

# Start development server
run:
	go run ./cmd/api/main.go

# Build production binary
build:
	go build -o bin/invenzo-api ./cmd/api/main.go

# Download & tidy all dependencies
tidy:
	go mod tidy

# Run with live reload (requires: go install github.com/air-verse/air@latest)
dev:
	air

# Format all Go files
fmt:
	go fmt ./...
