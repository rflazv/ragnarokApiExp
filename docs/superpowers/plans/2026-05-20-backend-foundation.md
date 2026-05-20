# Backend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the initial NestJS backend foundation for the Ragnarok LATAM Leveling Assistant.

**Architecture:** The backend starts as a NestJS application with a pragmatic Clean Architecture folder structure. This phase does not implement game rules yet; it creates the project, health endpoint, PostgreSQL/Prisma setup, and empty module boundaries for future EXP and DivinePride work.

**Tech Stack:** NestJS, TypeScript, Jest, PostgreSQL, Prisma, Docker Compose.

---

## File Structure

Files and folders created by this plan:

- `backend/`: NestJS application root.
- `backend/src/main.ts`: HTTP application bootstrap.
- `backend/src/app.module.ts`: root Nest module.
- `backend/src/modules/health/presentation/health.controller.ts`: simple health endpoint.
- `backend/src/modules/health/health.module.ts`: health module wiring.
- `backend/src/modules/exp/`: empty Clean Architecture boundary for future EXP rules.
- `backend/src/modules/divine-pride/`: empty Clean Architecture boundary for future DivinePride importer.
- `backend/src/modules/maps/`: empty Clean Architecture boundary for future map data.
- `backend/src/modules/monsters/`: empty Clean Architecture boundary for future monster data.
- `backend/src/shared/`: shared domain and infrastructure boundaries.
- `backend/prisma/schema.prisma`: initial Prisma schema and database provider.
- `backend/.env.example`: sample local environment variables.
- `backend/docker-compose.yml`: PostgreSQL service for local development.
- `backend/README.md`: local backend setup and learning notes.

The root `docs/project-spec.md` remains the product source of truth. This plan only implements Fase 1.

---

### Task 1: Scaffold NestJS Project

**Files:**
- Create: `backend/`
- Create: `backend/package.json`
- Create: `backend/src/main.ts`
- Create: `backend/src/app.module.ts`

- [ ] **Step 1: Create the NestJS project**

Run:

```bash
npx @nestjs/cli new backend --package-manager npm --skip-git
```

Expected:

```txt
CREATE backend/package.json
CREATE backend/src/main.ts
CREATE backend/src/app.module.ts
CREATE backend/test/app.e2e-spec.ts
```

Why: NestJS gives us the backend framework, dependency injection, module system, Jest setup, and TypeScript defaults.

- [ ] **Step 2: Enter the backend folder and run tests**

Run:

```bash
cd backend
npm test
```

Expected:

```txt
Test Suites: 1 passed
```

Why: before changing generated code, prove the scaffold works.

- [ ] **Step 3: Run the backend once**

Run:

```bash
npm run start
```

Expected:

```txt
Nest application successfully started
```

Stop the process with `Ctrl+C` after confirming it starts.

- [ ] **Step 4: Commit the scaffold**

Run:

```bash
git add backend
git commit -m "chore: scaffold nestjs backend"
```

Expected:

```txt
[master <hash>] chore: scaffold nestjs backend
```

---

### Task 2: Add Health Module

**Files:**
- Create: `backend/src/modules/health/presentation/health.controller.ts`
- Create: `backend/src/modules/health/health.module.ts`
- Modify: `backend/src/app.module.ts`
- Test: `backend/src/modules/health/presentation/health.controller.spec.ts`

- [ ] **Step 1: Write the health controller test**

Create `backend/src/modules/health/presentation/health.controller.spec.ts`:

```ts
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns api health status', () => {
    const controller = new HealthController();

    expect(controller.check()).toEqual({
      status: 'ok',
      service: 'ragnarok-leveling-api',
    });
  });
});
```

Why: this is a tiny first example of testing behavior before implementation.

- [ ] **Step 2: Run the failing test**

Run:

```bash
npm test -- health.controller.spec.ts
```

Expected:

```txt
Cannot find module './health.controller'
```

- [ ] **Step 3: Implement the controller**

Create `backend/src/modules/health/presentation/health.controller.ts`:

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'ragnarok-leveling-api',
    };
  }
}
```

Why: the presentation layer receives HTTP requests. This controller does not contain business logic.

- [ ] **Step 4: Create the health module**

Create `backend/src/modules/health/health.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { HealthController } from './presentation/health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
```

Why: NestJS organizes features through modules. Even simple features get a module when they are part of the public API.

- [ ] **Step 5: Register HealthModule in AppModule**

Replace `backend/src/app.module.ts` with:

```ts
import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
```

- [ ] **Step 6: Run the health test**

Run:

```bash
npm test -- health.controller.spec.ts
```

Expected:

```txt
PASS src/modules/health/presentation/health.controller.spec.ts
```

- [ ] **Step 7: Run all backend tests**

Run:

```bash
npm test
```

Expected:

```txt
Test Suites: 2 passed
```

- [ ] **Step 8: Commit the health module**

Run:

```bash
git add backend/src
git commit -m "feat: add backend health endpoint"
```

Expected:

```txt
[master <hash>] feat: add backend health endpoint
```

---

### Task 3: Add Clean Architecture Module Boundaries

**Files:**
- Create: `backend/src/modules/exp/domain/.gitkeep`
- Create: `backend/src/modules/exp/application/.gitkeep`
- Create: `backend/src/modules/exp/presentation/.gitkeep`
- Create: `backend/src/modules/divine-pride/domain/.gitkeep`
- Create: `backend/src/modules/divine-pride/application/.gitkeep`
- Create: `backend/src/modules/divine-pride/infrastructure/.gitkeep`
- Create: `backend/src/modules/divine-pride/presentation/.gitkeep`
- Create: `backend/src/modules/maps/domain/.gitkeep`
- Create: `backend/src/modules/maps/application/.gitkeep`
- Create: `backend/src/modules/maps/infrastructure/.gitkeep`
- Create: `backend/src/modules/maps/presentation/.gitkeep`
- Create: `backend/src/modules/monsters/domain/.gitkeep`
- Create: `backend/src/modules/monsters/application/.gitkeep`
- Create: `backend/src/modules/monsters/infrastructure/.gitkeep`
- Create: `backend/src/modules/monsters/presentation/.gitkeep`
- Create: `backend/src/shared/domain/.gitkeep`
- Create: `backend/src/shared/infrastructure/.gitkeep`

- [ ] **Step 1: Create feature boundaries**

Run these PowerShell commands from the repository root:

```powershell
New-Item -ItemType Directory -Force backend/src/modules/exp/domain
New-Item -ItemType Directory -Force backend/src/modules/exp/application
New-Item -ItemType Directory -Force backend/src/modules/exp/presentation
New-Item -ItemType Directory -Force backend/src/modules/divine-pride/domain
New-Item -ItemType Directory -Force backend/src/modules/divine-pride/application
New-Item -ItemType Directory -Force backend/src/modules/divine-pride/infrastructure
New-Item -ItemType Directory -Force backend/src/modules/divine-pride/presentation
New-Item -ItemType Directory -Force backend/src/modules/maps/domain
New-Item -ItemType Directory -Force backend/src/modules/maps/application
New-Item -ItemType Directory -Force backend/src/modules/maps/infrastructure
New-Item -ItemType Directory -Force backend/src/modules/maps/presentation
New-Item -ItemType Directory -Force backend/src/modules/monsters/domain
New-Item -ItemType Directory -Force backend/src/modules/monsters/application
New-Item -ItemType Directory -Force backend/src/modules/monsters/infrastructure
New-Item -ItemType Directory -Force backend/src/modules/monsters/presentation
New-Item -ItemType Directory -Force backend/src/shared/domain
New-Item -ItemType Directory -Force backend/src/shared/infrastructure
```

Why: these folders make future code placement obvious while they are still empty.

- [ ] **Step 2: Add `.gitkeep` files**

Run:

```powershell
New-Item -ItemType File -Force backend/src/modules/exp/domain/.gitkeep
New-Item -ItemType File -Force backend/src/modules/exp/application/.gitkeep
New-Item -ItemType File -Force backend/src/modules/exp/presentation/.gitkeep
New-Item -ItemType File -Force backend/src/modules/divine-pride/domain/.gitkeep
New-Item -ItemType File -Force backend/src/modules/divine-pride/application/.gitkeep
New-Item -ItemType File -Force backend/src/modules/divine-pride/infrastructure/.gitkeep
New-Item -ItemType File -Force backend/src/modules/divine-pride/presentation/.gitkeep
New-Item -ItemType File -Force backend/src/modules/maps/domain/.gitkeep
New-Item -ItemType File -Force backend/src/modules/maps/application/.gitkeep
New-Item -ItemType File -Force backend/src/modules/maps/infrastructure/.gitkeep
New-Item -ItemType File -Force backend/src/modules/maps/presentation/.gitkeep
New-Item -ItemType File -Force backend/src/modules/monsters/domain/.gitkeep
New-Item -ItemType File -Force backend/src/modules/monsters/application/.gitkeep
New-Item -ItemType File -Force backend/src/modules/monsters/infrastructure/.gitkeep
New-Item -ItemType File -Force backend/src/modules/monsters/presentation/.gitkeep
New-Item -ItemType File -Force backend/src/shared/domain/.gitkeep
New-Item -ItemType File -Force backend/src/shared/infrastructure/.gitkeep
```

- [ ] **Step 3: Run tests**

Run from `backend/`:

```bash
npm test
```

Expected:

```txt
Test Suites: 2 passed
```

- [ ] **Step 4: Commit the boundaries**

Run:

```bash
git add backend/src/modules backend/src/shared
git commit -m "chore: add backend module boundaries"
```

Expected:

```txt
[master <hash>] chore: add backend module boundaries
```

---

### Task 4: Add Docker Compose for PostgreSQL

**Files:**
- Create: `backend/docker-compose.yml`
- Create: `backend/.env.example`
- Create: `backend/.gitignore` or modify generated `backend/.gitignore`

- [ ] **Step 1: Create Docker Compose config**

Create `backend/docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: ragnarok-leveling-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ragnarok
      POSTGRES_PASSWORD: ragnarok
      POSTGRES_DB: ragnarok_leveling
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Why: local infrastructure belongs in code so another developer can run the project without guessing database setup.

- [ ] **Step 2: Create environment example**

Create `backend/.env.example`:

```env
DATABASE_URL="postgresql://ragnarok:ragnarok@localhost:5432/ragnarok_leveling?schema=public"
PORT=3000
```

- [ ] **Step 3: Ensure local `.env` is ignored**

Make sure `backend/.gitignore` contains:

```gitignore
.env
node_modules
dist
coverage
```

Why: `.env.example` is committed; real `.env` stays local.

- [ ] **Step 4: Start PostgreSQL**

Run from `backend/`:

```bash
docker compose up -d
```

Expected:

```txt
Container ragnarok-leveling-postgres Started
```

- [ ] **Step 5: Check container status**

Run:

```bash
docker compose ps
```

Expected:

```txt
ragnarok-leveling-postgres
```

- [ ] **Step 6: Commit local infra**

Run:

```bash
git add backend/docker-compose.yml backend/.env.example backend/.gitignore
git commit -m "chore: add postgres local setup"
```

Expected:

```txt
[master <hash>] chore: add postgres local setup
```

---

### Task 5: Add Prisma

**Files:**
- Create: `backend/prisma/schema.prisma`
- Modify: `backend/package.json`

- [ ] **Step 1: Install Prisma packages**

Run from `backend/`:

```bash
npm install prisma @prisma/client
```

Expected:

```txt
added <number> packages
```

- [ ] **Step 2: Initialize Prisma**

Run:

```bash
npx prisma init
```

Expected:

```txt
✔ Your Prisma schema was created at prisma/schema.prisma
```

- [ ] **Step 3: Define the initial Prisma schema**

Replace `backend/prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Why: no tables yet. We add database models when the DivinePride importer design is ready.

- [ ] **Step 4: Copy local env file**

Run from `backend/`:

```powershell
Copy-Item .env.example .env
```

Expected: `backend/.env` exists locally and is not tracked by Git.

- [ ] **Step 5: Validate Prisma schema**

Run:

```bash
npx prisma validate
```

Expected:

```txt
The schema at prisma/schema.prisma is valid
```

- [ ] **Step 6: Generate Prisma client**

Run:

```bash
npx prisma generate
```

Expected:

```txt
Generated Prisma Client
```

- [ ] **Step 7: Commit Prisma setup**

Run:

```bash
git add backend/package.json backend/package-lock.json backend/prisma/schema.prisma
git commit -m "chore: add prisma setup"
```

Expected:

```txt
[master <hash>] chore: add prisma setup
```

---

### Task 6: Add Backend README

**Files:**
- Create: `backend/README.md`

- [ ] **Step 1: Create backend README**

Create `backend/README.md`:

```md
# Ragnarok Leveling API

Backend NestJS for the Ragnarok LATAM Leveling Assistant.

## Stack

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- Jest

## Local Setup

Install dependencies:

```bash
npm install
```

Create local environment:

```powershell
Copy-Item .env.example .env
```

Start PostgreSQL:

```bash
docker compose up -d
```

Validate Prisma:

```bash
npx prisma validate
```

Run tests:

```bash
npm test
```

Run API:

```bash
npm run start:dev
```

Health check:

```txt
GET http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "ragnarok-leveling-api"
}
```

## Architecture Notes

The backend uses a pragmatic Clean Architecture structure:

- `domain`: pure game rules and core models;
- `application`: use cases;
- `infrastructure`: database, Prisma, HTTP clients and external integrations;
- `presentation`: controllers, DTOs and REST routes.

The EXP calculation module should remain independent from NestJS, Prisma and DivinePride.
```

- [ ] **Step 2: Run tests one final time**

Run from `backend/`:

```bash
npm test
```

Expected:

```txt
Test Suites: 2 passed
```

- [ ] **Step 3: Commit README**

Run:

```bash
git add backend/README.md
git commit -m "docs: add backend setup guide"
```

Expected:

```txt
[master <hash>] docs: add backend setup guide
```

---

## Self-Review

Spec coverage:

- Fase 1 requires NestJS, tests, PostgreSQL Docker Compose, Prisma, and initial module structure. This plan covers all of them.
- EXP rules, DivinePride importing, API calculations, and frontend are intentionally outside this plan and remain for later phases.

Placeholder scan:

- No implementation step depends on undefined application code.
- No task asks for generic error handling without concrete code.

Type consistency:

- Health endpoint consistently uses `HealthController`, `HealthModule`, and response fields `status` and `service`.

## Execution Choice

Plan complete and saved to `docs/superpowers/plans/2026-05-20-backend-foundation.md`.

Two execution options:

1. **Subagent-Driven (recommended)** - dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - execute tasks in this session using executing-plans, batch execution with checkpoints.

Recommended for learning: **Inline Execution**, because we can pause after each task and explain what changed.
