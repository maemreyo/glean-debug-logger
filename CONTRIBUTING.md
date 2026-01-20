# Contributing to @zaob/glean-debug-logger

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to zaob.ogn@gmail.com.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Environment details (browser, OS, React version)
- Screenshots or code samples if applicable

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear description of the enhancement
- Use cases for the enhancement
- Examples of how the feature would be used

### Pull Requests

1. **Fork the repository** and create your branch from `main`.
2. **Clone your fork** and navigate to the project directory.
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Make your changes** following the coding standards below.
5. **Test your changes**:
   ```bash
   npm test
   ```
6. **Build the project**:
   ```bash
   npm run build
   ```
7. **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add new feature"
   ```
8. **Push to your fork** and create a pull request.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/maemreyo/glean-debug-logger.git

# Navigate to the project
cd glean-debug-logger

# Install dependencies
npm install

# Run tests in watch mode
npm test -- --watch

# Build the project
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid using `any` type
- Define proper interfaces and types
- Add JSDoc comments for public APIs

### React

- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use descriptive prop and state names

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add option to filter logs by level
```

## Testing

- Write tests for new features and bug fixes
- Aim for high test coverage
- Test edge cases and error conditions
- Use descriptive test names

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for API changes
- Update CHANGELOG.md (handled by semantic-release)

## Getting Help

If you need help contributing:

- Open a discussion on GitHub
- Email zaob.ogn@gmail.com
- Check existing issues and discussions

Thank you for your contributions!
