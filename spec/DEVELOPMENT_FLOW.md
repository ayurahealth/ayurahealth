# Ayura Intelligence — Development Flow

## Branch Strategy

```
main                         <- Production-ready code; auto-deploys to Vercel
  └─ deploy/production-gold  <- Explicit production deployment trigger
feature/xyz                  <- Feature branches (merge via PR)
fix/issue-name               <- Bug fix branches
chore/description            <- Non-functional changes (docs, deps)
```

**Rule**: Never push directly to `main` for features. Use PRs for review.

## Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/ayurahealth/ayurahealth.git
cd ayurahealth

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your keys

# 4. Generate Prisma client
npx prisma generate

# 5. Run migrations (if using local DB)
npx prisma migrate dev

# 6. Start dev server
npm run dev
# Opens at http://localhost:3000
```

## Mandatory Development Lifecycle Protocol

For every single task, feature, or bug fix, we strictly follow this end-to-end lifecycle:

```
 1. 📝 CREATE ISSUE       → Define the problem / feature on GitHub
 2. 📋 REVIEW REQS        → Analyze requirements and constraints
 3. 🌿 CREATE BRANCH      → Checkout `feat/xyz` or `fix/issue-123`
 4. 📐 IMPLEMENTATION PLAN → Draft technical plan and changes
 5. 👤 HUMAN APPROVAL     → Present plan and obtain explicit approval
 6. 💻 DEVELOPMENT        → Write clean, type-safe code
 7. 🧪 TEST & VERIFY      → Run `npm run typecheck` & smoke checks
 8. 📦 COMMIT & PUSH      → Conventional commit & push branch to origin
 9. 🔀 CREATE PR          → Open Pull Request against `main`
10. 🧐 REVIEW PR          → Inspect diff & ensure CI checks pass
11. 🚀 MERGE PR           → Merge into `main` & sync `deploy/production-gold`
12. 🧹 DELETE BRANCH      → Remove merged local & remote feature branches
13. ✅ CLOSE ISSUE        → Update and close the GitHub issue
14. 🔄 NEXT TASK          → Return to step 1 for the next item
```

---

## Step-by-Step Command Guide

### 1. Issue & Branch Creation
```bash
# Checkout latest main
git checkout main
git pull origin main

# Create dedicated feature/fix branch
git checkout -b fix/issue-description # or feat/feature-name
```

### 2. Plan & Human Approval
- In Planning Mode, create the design doc / implementation plan.
- Wait for the user's explicit approval before writing code.

### 3. Development & Local Testing
```bash
# Execute changes...
# Verify zero TypeScript errors
npm run typecheck
```

### 4. Commit & Push Branch
```bash
git add -A
git commit -m "feat(scope): concise description"
git push origin feat/feature-name
```

### 5. Pull Request, Merge & Branch Cleanup
```bash
# Merge to main
git checkout main
git pull origin main
git merge feat/feature-name
git push origin main
git push origin main:deploy/production-gold

# Delete feature branch locally and remotely
git branch -d feat/feature-name
git push origin --delete feat/feature-name
```

---

## Commit Convention (Conventional Commits)

```
feat:     New feature or enhancement
fix:      Bug fix
chore:    Maintenance, deps updates, config
docs:     Documentation only changes
refactor: Code restructure (no behavior change)
perf:     Performance improvement
test:     Test additions or changes
ci:       CI/CD pipeline changes
```

Examples:
```
feat(chat): add caveman mode toggle
fix(middleware): dynamic Clerk import prevents edge crash
chore(deps): upgrade @clerk/nextjs to 7.x
docs(spec): add architecture and agent documentation
```

## CI/CD Pipeline

`.github/workflows/ops-production.yml` triggers on every `main` push:

```
1. audit-and-guard
   ├── Secret Scan (grep for sk_live, hardcoded keys)
   └── Branch Policy Guard

2. build-and-verify
   ├── npx prisma generate
   ├── node scripts/auth-guard.mjs
   ├── npm run typecheck (tsc --noEmit)
   └── npm run build (full Next.js build)

3. smoke-test
   └── curl /api/health → validates production is live
```

## Deployment Commands

```bash
# Deploy to production
git push origin main
git push origin main:deploy/production-gold

# Vercel auto-deploys from deploy/production-gold branch
# Monitor at: https://vercel.com/abhishek0333xs-projects/ayurahealth
```

## Code Standards

| Standard | Rule |
|----------|------|
| TypeScript | Strict mode; no `any` except required Prisma dynamic access |
| Logging | Use `lib/logger.ts` (structured) — never `console.log` in commits |
| API Validation | Always use Zod schema before processing request body |
| Error Handling | All async code in try-catch; graceful degradation always |
| SSE Streaming | Always buffer chunks: `buffer += decode(value, {stream: true}); lines = buffer.split('\n'); buffer = lines.pop()` |
| Secrets | Only in `.env.local` (dev) or Vercel env vars (prod); never in code |

## Environment File Management

| File | Purpose | In Git? |
|------|---------|---------|
| `.env.example` | Template showing all required variable names | ✅ Yes |
| `.env.local` | Local development secrets | ❌ No (.gitignore) |
| `.env` | Should remain empty | ❌ No |
| Vercel Dashboard | Production + Preview secrets | Via Vercel UI only |

## Database Migrations

```bash
# Development: create and apply migration
npx prisma migrate dev --name describe_your_change

# Production: apply pending migrations
npx prisma migrate deploy

# Inspect current DB state
npx prisma studio

# Reset local DB (destructive!)
npx prisma migrate reset
```

## Testing Strategy

| Type | Tool | Status |
|------|------|--------|
| Type checking | `tsc --noEmit` | ✅ Active (CI) |
| Build verification | `npm run build` | ✅ Active (CI) |
| Health check | `curl /api/health` | ✅ Active (CI smoke) |
| Unit tests | Jest | 🔜 Phase 2 |
| E2E tests | Playwright | 🔜 Phase 2 |
| Manual smoke | Chat with "hi" in prod | ✅ After each deploy |

## Rollback Procedure

```bash
# Find last good commit
git log --oneline -10

# Option A: Revert (safe, creates new commit)
git revert HEAD
git push origin main
git push origin main:deploy/production-gold

# Option B: Hard reset (use with caution)
git reset --hard <good-commit-sha>
git push origin main --force-with-lease
git push origin main:deploy/production-gold --force-with-lease
```

## iOS Build (Capacitor)

```bash
# Full iOS build
npm run build
npm run cap:sync
npm run cap:open  # Opens Xcode

# Or shorthand
npm run ios:setup
```
