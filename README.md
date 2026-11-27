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
| Data | Prisma + PostgreSQL (Docker locally, Neon in production) |
| Auth | GitHub OAuth with Better Auth |
| AI | Gemini API |
| Testing | Jest, React Testing Library, Playwright |
| CI/CD | GitHub Actions |
| Hosting | Vercel (Cloud Run under evaluation) |

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

The full scope of v0.1, with user stories and acceptance criteria, is in the [requirements document](docs/requirements.md).

### v0.1 · Foundation
- [x] Next.js project setup with TypeScript and Tailwind CSS
- [x] Bilingual interface (English and Spanish)
- [x] Database schema with Prisma and local PostgreSQL in Docker
- [x] CI with GitHub Actions: lint, typecheck, tests and build on every pull request
- [x] Sign in with GitHub
- [x] Kanban board with fixed columns and task CRUD
- [x] Keyboard-accessible drag and drop
- [ ] Link tasks to pull requests by URL
- [x] Continuous deployment

### v0.2 · Code reviewer agent
- [ ] Analyze the PR diff and generate review suggestions
- [ ] Review panel to accept or reject each suggestion

### v0.3 · More agents and metrics
- [ ] Test generator agent
- [ ] Doc writer agent
- [ ] Metrics dashboard

### v0.4 · MCP server
- [ ] Expose tasks and reviews as MCP tools

## Getting started

Requirements: Node.js 24 and Docker.

```bash
npm install
cp .env.example .env
npm run db:up
npm run db:migrate
npm run dev
```

Sign-in needs a [GitHub OAuth App](https://github.com/settings/applications/new) with `http://localhost:3000/api/auth/callback/github` as the callback URL. Copy its client ID and secret into `.env`, and generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`.

| Script | What it does |
|---|---|
| `npm run db:up` | Starts PostgreSQL in Docker and waits until it is ready |
| `npm run db:down` | Stops the container; data stays in the volume |
| `npm run db:migrate` | Applies migrations and generates the Prisma client |
| `npm run db:studio` | Opens Prisma Studio to browse the data |
| `npm test` | Runs the unit tests with Jest |

## Workflow

Development follows **GitHub Flow**: every change starts as an issue, is built on a `feat/...` branch and reaches `main` through a reviewed pull request.

## Author

**Eliana Suancha Guzmán** · Frontend Developer
[LinkedIn](https://www.linkedin.com/in/elianaguz) · [Portfolio](https://github.com/elianisdev/eliana-suancha-portfolio)
