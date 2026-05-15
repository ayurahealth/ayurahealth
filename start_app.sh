#!/bin/bash
# Provide dummy environment variables required by pnpm start/build
export DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_dummy"
export UPSTASH_REDIS_REST_URL="https://dummy.upstash.io"
export UPSTASH_REDIS_REST_TOKEN="dummy_token"
export NODE_ENV="development"
# Run dev server
pnpm dev > /tmp/next_dev.log 2>&1 &
