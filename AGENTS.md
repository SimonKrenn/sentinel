# Agent Guidelines for Sentinel

## Commands
- `bun run test` - Run all tests (use `bun test path/to/test.test.ts` for single test)
- `bun run lint` - Lint with oxlint (type-aware)
- `bun run lint:fix` - Auto-fix lint issues
- `bun run format` - Format with oxfmt
- `bun run build:prod` - Build CLI binary to dist/

## Code Style
- **Imports**: Use ES modules, group external imports first, then internal
- **Formatting**: oxfmt handles formatting, oxlint enforces style
- **Types**: Strict TypeScript enabled, prefer explicit types over inference
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Error handling**: Use try/catch, prefer async/await over .then()
- **Testing**: Bun test framework, use describe/test/expect pattern
- **Linting**: All rules set to "warn" in oxlint, type-aware linting enabled

## Project Structure
- Monorepo with packages/sentinel as main CLI
- Core modules in src/core/, providers in src/providers/
- Tests in tests/ directory matching src structure