# DEVELOPMENT.md

## Git Workflow (required)

1. Keep `main` as production-grade baseline only.
2. Keep `develop` as the integration branch.
3. Start every module from `develop` using `feat/<module-name>-module`.
4. Commit in small increments with meaningful messages.
5. Merge feature branch into `develop` only after local checks.
6. Do not commit directly to `develop` unless handling emergency fix.

## Standard Branch Commands

1. `git checkout develop`
2. `git pull origin develop`
3. `git checkout -b feat/<module-name>-module`
4. Work and commit incrementally.
5. `git checkout develop`
6. `git merge --no-ff feat/<module-name>-module`

## Commit Message Convention

1. `feat(api): ...`
2. `feat(web): ...`
3. `feat(infra): ...`
4. `docs: ...`
5. `fix(api): ...`
6. `chore: ...`

## Backend Development Notes

1. API follows modular structure under `apps/api/src/modules`.
2. Shared middleware and infrastructure singletons are in `apps/api/src/common` and `apps/api/src/infrastructure`.
3. **AI Provider Selection:** Handled dynamically via `generation.service.ts`. Use `MOCK_AI_MODE=true` to develop offline or avoid Gemini quotas.
4. OTP and auth logic should remain consistent with security checks. Developer overrides (`OTP_BYPASS=true`) are available strictly for local validation.
5. Twist logic should stay isolated in `modules/twist`, validating structured output formatting.

## Frontend Development Notes

1. Angular app uses standalone components.
2. Core singleton services are in `apps/web/src/app/core/services`.
3. Route-level auth guard is in `core/guards/auth.guard.ts`.
4. UI modules are grouped in `features` folder.

## Local Validation Checklist

1. `npm install`
2. `npm run compose:up`
3. `npm run dev`
4. API health check `GET /api/v1/health`
5. Register -> OTP -> Login flow
6. Create project -> generate all three output types
7. Verify history and workspace rendering

## Glitch Prevention Checklist

1. Ensure API and web both use same base contracts.
2. Avoid direct schema duplication between apps.
3. Keep env values synced with `.env.example`.
4. Check branch status before every commit.
5. Resolve merge conflicts in feature branch before merging.
6. Keep changes module-focused per branch.
