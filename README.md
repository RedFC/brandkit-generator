# BrandKit Generator

BrandKit Generator is a monorepo project for Theme 1 (AI Brand Architect). It combines three capabilities in a single product:

1. Brand Starter Kit generation.
2. Logo Direction Pack generation.
3. Campaign Pack generation.

The stack is intentionally split as:

1. Backend API: Node.js + Express + TypeScript + MongoDB + Redis.
2. Frontend UI: Angular standalone app.
3. Shared contracts: central schemas and types used by both apps.

## Monorepo Structure

```txt
.
├── apps
│   ├── api
│   └── web
├── packages
│   ├── contracts
│   ├── prompt-kits
│   └── shared-utils
├── infra
│   └── env
├── docker-compose.yml
├── DEVELOPMENT.md
├── PROJECT_SETUP.md
└── README.md
```

## Implemented Modules

1. `feat/api-module` merged into `develop`.
2. `feat/web-module` merged into `develop`.
3. `feat/infra-module` merged into `develop`.
4. `feat/gemini-module` merged into `develop` (Gemini API Integration).
5. `feat/ui-overhaul-module` merged into `develop` (Premium Dark Theme & Structured Outputs).

## Core Features
1. **Gemini AI Integration (`gemini-2.5-flash`)**: High-speed, context-aware brand intelligence generating names, taglines, visual concepts, and ad campaigns.
2. **Human-in-the-Loop (HITL) Feedback**: "Reject & Re-generate" functionality allowing users to explicitly prompt changes on generated concepts.
3. **Smart History & Archiving**: Regenerated assets neatly stack with "Archived Version" badges to preserve concept history.
4. **Confidence Scoring**: Dynamic "Brand Voice Match" meters displaying the AI's confidence against the user's initial brand brief.
5. **Premium Structured UI**: Angular interface utilizing a dark theme, glassmorphism, and structured visual cards instead of raw JSON.
6. **Authentication & Bypass**: JWT auth, OTP flows, with a developer `OTP_BYPASS` flag for fast local testing.

## Available Scripts

At root:

1. `npm run dev` runs both apps in parallel.
2. `npm run dev:api` runs API only.
3. `npm run dev:web` runs Angular only.
4. `npm run build` builds all packages/apps.
5. `npm run typecheck` type checks all workspaces.
6. `npm run compose:up` starts dependent services.
7. `npm run compose:down` stops dependent services.

## API Endpoints (high-level)

1. `POST /api/v1/auth/register`
2. `POST /api/v1/auth/verify-otp`
3. `POST /api/v1/auth/login`
4. `POST /api/v1/auth/forgot-password`
5. `POST /api/v1/auth/reset-password`
6. `POST /api/v1/auth/refresh`
7. `POST /api/v1/auth/logout`
8. `GET /api/v1/projects`
9. `POST /api/v1/projects`
10. `POST /api/v1/projects/:projectId/generate/starter-kit`
11. `POST /api/v1/projects/:projectId/generate/logo-direction`
12. `POST /api/v1/projects/:projectId/generate/campaign-pack`
13. `GET /api/v1/projects/:projectId/outputs`
14. `GET /api/v1/twist/active`

## Branching Model

1. `main` is stable baseline.
2. `develop` is active integration branch.
3. Feature branches must follow `feat/<module-name>-module`.
4. Merge flow is feature branch -> `develop` with incremental commits.

See [DEVELOPMENT.md](./DEVELOPMENT.md) and [PROJECT_SETUP.md](./PROJECT_SETUP.md) for full details.
