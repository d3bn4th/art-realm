# Contributing to Art Realm

Thank you for your interest in contributing to Art Realm! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## How to Contribute

### Reporting Bugs

If you find a bug in the application, please create an issue on GitHub with the following information:

1. A clear, descriptive title
2. Steps to reproduce the bug
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details (browser, OS, device)

### Suggesting Features

We welcome feature suggestions! Please create an issue on GitHub with:

1. A clear, descriptive title
2. Detailed description of the proposed feature
3. Any relevant drawings, mockups, or examples
4. Why this feature would be beneficial to the project

### Pull Requests

We actively welcome pull requests:

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Ensure the code follows our style guidelines
5. Run tests and make sure they pass
6. Commit your changes with clear, descriptive commit messages
7. Push your branch to your fork
8. Submit a pull request to the `main` branch

### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update documentation if needed
3. The pull request will be reviewed by maintainers
4. Once approved, your pull request will be merged

## Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/art-realm.git
   cd art-realm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Coding Guidelines

### Code Style

We use ESLint and Prettier to enforce code style. Before submitting a pull request, please make sure your code follows our style guidelines:

```bash
npm run lint
```

### TypeScript

- Use TypeScript for all new code
- Define types for all variables, function parameters, and return values
- Avoid using `any` type when possible

### Component Structure

- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract complex logic into custom hooks

### CSS/Styling

- Use Tailwind CSS for styling
- Follow utility-first approach
- Group related classes together

### Testing

- Write tests for new features
- Ensure existing tests pass before submitting a PR
- Aim for good test coverage

## Git Workflow

### Branches

- `main`: Production-ready code
- `dev`: Development branch
- `feature/*`: For new features
- `bugfix/*`: For bug fixes
- `hotfix/*`: For critical fixes to production

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(artwork): add pagination to artwork listing
```

## Documentation

- Update documentation when necessary
- Document new features, APIs, and significant changes
- Use clear and concise language

## Review Process

All submissions require review before being merged. Reviewers will check:

1. Code quality and style
2. Test coverage
3. Documentation
4. Performance implications
5. Security considerations

## Community

Join our community channels to get help or discuss ideas:

- GitHub Discussions
- Discord (coming soon)

---

Thank you for contributing to Art Realm! Your efforts help make this project better for everyone. 