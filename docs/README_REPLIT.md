# 🌿 AyuraHealth: Replit Quick-Start
# 🧠 Council of Agents & AI Brain Edition

You have successfully moved your Ayurvedic Oracle to Replit. To get everything running:

## 1. Set Up Secrets (Environment Variables) 🔑
Replit does not read `.env.local`. You MUST add the following to the **Secrets** tool (the padlock icon):

- `DATABASE_URL`: Your Supabase connection string.
- `DIRECT_URL`: Required for Prisma migrations.
- `GROQ_API_KEY`: For the Llama-3 model.
- `OPENROUTER_API_KEY`: For the Nemotron Deep Mind mode.
- `CLERK_SECRET_KEY` & `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: For authentication.

## 2. Initialize the AI Brain 🧠
The knowledge base is pre-populated in `data/notebook/`. Run the ingestion command in the shell once you set your secrets:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 DATABASE_URL=$DIRECT_URL npx tsx scripts/ingest-notebook.ts
```

## 3. Run the App 🚀
Click the large **RUN** button at the top. This will launch the Next.js development server.

### Troubleshooting
- **Prisma**: If you see database connection errors, ensure `DIRECT_URL` is set correctly in Secrets and run `npx prisma generate`.
- **Port Mapping**: The app runs on port 3000 and is mapped to port 80 via `.replit`.

---
**Josef: AyuraHealth — Ancient Wisdom, Modern AI.**
