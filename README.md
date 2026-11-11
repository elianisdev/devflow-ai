# DevFlow AI

> 🚧 **In progress.** This repository is being built in public. The roadmap below shows what is done and what comes next.

A task board for development teams where every task is linked to its GitHub pull request, and AI agents review the code, suggest tests and draft documentation for each change.

## Why

Code review, test coverage and documentation are usually the first things to slip when a team is under pressure. DevFlow AI puts them next to the task itself: when a PR is linked, three specialized agents leave suggestions that the developer can accept or reject.

## Planned features

- **Task ↔ PR linking:** each card on the board is connected to a GitHub pull request.
- **AI agents per PR:**
  - **Code reviewer:** comments on bugs, readability and conventions in the diff.
  - **Test generator:** proposes unit and E2E test cases for the changed code.
  - **Doc writer:** drafts documentation for the change.
- **Accessible kanban board:** drag and drop with mouse, touch and keyboard, with screen reader announcements.
- **Metrics dashboard:** linked PRs, suggestions accepted vs rejected.
- **MCP server:** exposes DevFlow tasks and reviews as tools (`get_task`, `get_pr_diff`, `post_review`), so any MCP client can work with them.
- **Demo mode:** visitors explore pre-generated reviews; live analysis is limited to the owner account.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS |
| Data | Prisma + PostgreSQL (Neon) |
| Auth | GitHub OAuth |
| AI | Gemini API |
| Testing | Jest, React Testing Library, Playwright |
| CI/CD | GitHub Actions |
| Hosting | Google Cloud Run (Docker) |

## Architecture

The project follows **Clean Architecture**:

```
Presentation (components, pages)
        ↓
Use cases (business rules)
        ↓
Domain (entities, ports: CodeReviewer, TestGenerator, DocWriter)
        ↑
Infrastructure (Prisma repositories, GitHub API, Gemini adapter)
```

Each AI agent is a **port** defined in the domain. The AI provider is an adapter in the infrastructure layer, so it can be replaced without touching the business rules, and use cases can be tested with in-memory fakes instead of real API calls.

The UI is built with **Atomic Design** (atoms → molecules → organisms → templates → pages).

## Roadmap

### v0.1 · Foundation
- [ ] Next.js project setup with TypeScript and Tailwind CSS
- [ ] CI with GitHub Actions: lint, typecheck, tests and build on every pull request
- [ ] Sign in with GitHub
- [ ] Connect a repository and list its pull requests
- [ ] Kanban board with keyboard-accessible drag and drop
- [ ] Link tasks to pull requests
- [ ] Continuous deployment to Cloud Run

### v0.2 · Code reviewer agent
- [ ] Analyze the PR diff and generate review suggestions
- [ ] Review panel to accept or reject each suggestion

### v0.3 · More agents and metrics
- [ ] Test generator agent
- [ ] Doc writer agent
- [ ] Metrics dashboard

### v0.4 · MCP server
- [ ] Expose tasks and reviews as MCP tools

## Workflow

Development follows **GitHub Flow**: every change starts as an issue, is built on a `feat/...` branch and reaches `main` through a reviewed pull request.

## Author

**Eliana Suancha Guzmán** · Frontend Developer
[LinkedIn](https://www.linkedin.com/in/elianaguz) · [Portfolio](https://github.com/elianisdev/eliana-suancha-portfolio)
