import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import { getEmbedding } from '../lib/ai/embeddings';

/**
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

/**
 * 🌿 Ayura Intelligence Lab Bulk Ingestion Script
 * ----------------------------------------------------
 * Orchestrates high-performance data ingestion for the neural synthesis pipeline.
 */

const prisma = new PrismaClient()

const DB_URL = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!DB_URL) {
  console.error('❌ DATABASE_URL or DIRECT_URL is required.');
  process.exit(1);
}

const DATA_DIR = path.join(process.cwd(), 'data/notebook');

async function main() {
  console.log('🚀 Starting Ayura Intelligence Lab Bulk Ingestion...');
  
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false }, // Required for Supabase in many environments
  });

  try {
    await client.connect();
    console.log('✅ Connected to Database.');

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.txt') || f.endsWith('.md'));
    if (files.length === 0) {
      console.log('⚠️ No files found in data/notebook/.');
      return;
    }

    for (const file of files) {
      const filePath = path.join(DATA_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const tradition = file.split('.')[0].charAt(0).toUpperCase() + file.split('.')[0].slice(1).split('_')[0]; // simple name extraction
      
      console.log(`\n📚 Processing [${tradition}] from ${file}...`);
      
      // Basic Chunking: split by sections or 800-char blocks
      const chunks = chunkText(content, 1000, 200);
      console.log(`➡️  Split into ${chunks.length} chunks.`);

      for (let i = 0; i < chunks.length; i++) {
        const text = chunks[i];
        process.stdout.write(`   🔹 Chunk ${i+1}/${chunks.length}... `);
        
        try {
          const embedding = await getEmbedding(text);
          const vectorStr = `[${embedding.join(',')}]`;

          // SQL with parameters for clean upsert
          await client.query(
            `INSERT INTO "KnowledgeChunk" (id, title, content, tradition, source, embedding) 
             VALUES ($1, $2, $3, $4, $5, $6::extensions.vector)
             ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, embedding = EXCLUDED.embedding`,
            [
              `nb-${tradition.toLowerCase()}-${i}`,
              `${tradition} Core Wisdom`,
              text,
              tradition,
              file,
              vectorStr
            ]
          );

          process.stdout.write('✅\n');
        } catch (err) {
          process.stdout.write('❌\n');
          console.error(`   Error in chunk ${i+1}:`, err);
        }
      }
    }

    console.log('\n✨ All wisdom ingested into the AI Brain.');
  } catch (err) {
    console.error('💥 Fatal Ingestion Error:', err);
  } finally {
    await client.end();
  }
}

/**
 * Splits text into overlapping chunks.
 */
function chunkText(text: string, size: number, overlap: number): string[] {
  const result: string[] = [];
  let currentPos = 0;
  
  // Normalize whitespace
  const cleanText = text.replace(/\s+/g, ' ').trim();

  while (currentPos < cleanText.length) {
    const end = Math.min(currentPos + size, cleanText.length);
    let chunk = cleanText.substring(currentPos, end);
    
    // Check if we can break at a better spot (sentence or space)
    if (end < cleanText.length) {
      const lastSpace = chunk.lastIndexOf(' ');
      if (lastSpace > size * 0.8) {
        chunk = chunk.substring(0, lastSpace);
      }
    }
    
    result.push(chunk.trim());
    currentPos += (chunk.length - overlap);
    if (currentPos >= cleanText.length || chunk.length < size * 0.5) break; 
  }
  
  return result;
}

main().catch(console.error);
