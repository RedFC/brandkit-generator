# PROJECT_SETUP.md

## Prerequisites

1. Node.js 22+
2. npm 10+
3. Docker + Docker Compose

## 1. Clone and Checkout

1. `git clone https://github.com/RedFC/brandkit-generator.git`
2. `cd brandkit-generator`
3. `git checkout develop`

## 2. Install Dependencies

1. `npm install`

## 3. Environment Setup

1. Copy root `.env.example` to `.env`.
2. Update JWT secrets for your local environment.
3. Keep `MONGO_URI` and `REDIS_URI` as default unless using custom ports.

## 4. Start Dependent Services

1. `npm run compose:up`
2. MongoDB runs on `localhost:27017`.
3. Redis runs on `localhost:6379`.
4. Mailhog SMTP runs on `localhost:1025`.
5. Mailhog UI runs on `http://localhost:8025`.

## 5. Start Applications

1. `npm run dev`
2. API starts at `http://localhost:8080`.
3. Web app starts at `http://localhost:4200`.

## 6. Verify API

1. Check health endpoint: `GET http://localhost:8080/api/v1/health`.
2. Register a user from frontend.
3. Open Mailhog and copy OTP.
4. Verify OTP and login.
5. Create project and generate all 3 output packs.

## 7. Common Commands

1. `npm run dev:api`
2. `npm run dev:web`
3. `npm run build`
4. `npm run typecheck`
5. `npm run compose:down`

## 8. Troubleshooting

1. If API cannot connect to MongoDB, ensure compose services are up.
2. If OTP email does not appear, check Mailhog UI.
3. If CORS error appears, confirm `CORS_ORIGIN` in `.env`.
4. If frontend fails to call API, verify `apps/web/src/environments/environment.ts`.

## 9. Branch Usage

1. Always create module branches from `develop`.
2. Use naming pattern `feat/<module-name>-module`.
3. Merge back into `develop` with `--no-ff`.
