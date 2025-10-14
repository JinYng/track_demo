.PHONY: help install build dev clean lint test docker-up docker-down setup

# Default target
help: ## Show this help message
	@echo "AI Genomics Assistant - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: ## Setup development environment
	@./scripts/setup-dev.sh

install: ## Install dependencies
	npm install

build: ## Build all packages
	npm run build

dev: ## Start development servers
	npm run dev

dev-frontend: ## Start only frontend development server
	npm run dev:frontend

dev-backend: ## Start only backend development server
	npm run dev:backend

clean: ## Clean build artifacts and dependencies
	npm run clean

lint: ## Run linting
	npm run lint

lint-fix: ## Run linting with auto-fix
	npm run lint:fix

test: ## Run tests
	npm run test

# Docker commands
docker-build: ## Build Docker images
	npm run docker:build

docker-up: ## Start Docker environment
	npm run docker:up

docker-down: ## Stop Docker environment
	npm run docker:down

docker-logs: ## Show Docker logs
	npm run docker:logs

# Database commands
db-up: ## Start development databases
	npm run dev:db

db-down: ## Stop development databases
	npm run dev:db:down

# Utility commands
check-deps: ## Check for outdated dependencies
	npm outdated

audit: ## Run security audit
	npm audit

audit-fix: ## Fix security vulnerabilities
	npm audit fix