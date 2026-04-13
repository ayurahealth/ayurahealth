import { defineConfig } from '@prisma/client/config'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  },
  // Ensure we are using the driver adapter in the client constructor
})
