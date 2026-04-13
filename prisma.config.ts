import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Standard process.env check avoids throwing PrismaConfigEnvError during build time (Finding #8 resilience)
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  },
});
