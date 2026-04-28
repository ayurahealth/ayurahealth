import { Client } from 'pg';
import { getEmbedding } from '../lib/ai/embeddings';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const WISDOM_DATA = [
  {
    title: 'The Three Doshas',
    content: 'Ayurveda identifies three fundamental biological energies: Vata (air/ether), Pitta (fire/water), and Kapha (earth/water). Balanced doshas lead to health, while imbalance leads to disease.',
    source: 'Charaka Samhita',
    tradition: 'Ayurveda',
    tags: ['dosha', 'foundations', 'elements']
  },
  {
    title: 'The Concept of Qi',
    content: 'In Traditional Chinese Medicine (TCM), Qi is the vital life force that flows through meridians in the body. Health is the result of harmonious Qi flow and balance between Yin and Yang.',
    source: 'Huangdi Neijing',
    tradition: 'TCM',
    tags: ['qi', 'meridians', 'yin-yang']
  },
  {
    title: 'Law of Similars',
    content: 'Homeopathy is based on the principle "Similia Similibus Curentur" (let likes be cured by likes), where a substance that causes symptoms in a healthy person can cure similar symptoms in a sick person.',
    source: "Hahnemann's Organon",
    tradition: 'Homeopathy',
    tags: ['principles', 'similars', 'remedies']
  },
  {
    title: 'Vis Medicatrix Naturae',
    content: 'Naturopathy emphasizes the self-healing power of nature. The physician\'s role is to facilitate this natural process by removing obstacles to health and using natural therapies.',
    source: 'Hippocratic Principles',
    tradition: 'Naturopathy',
    tags: ['self-healing', 'nature', 'vitalism']
  },
  {
    title: 'The Four Tantras (Gyushi)',
    content: 'Tibetan Medicine (Sowa Rigpa) centers on the balance of three humors: Lung (wind), Tripa (bile), and Beken (phlegm), closely related to the Ayurvedic doshas but adapted to the high-altitude Himalayan context.',
    source: 'Gyushi',
    tradition: 'Tibetan',
    tags: ['humors', 'tantras', 'himalayan']
  }
];

async function ingest() {
  console.log('🧠 Starting Wisdom Ingestion into AI Brain (using pg)...');
  
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database.');

    for (const item of WISDOM_DATA) {
      console.log(`- processing "${item.title}"...`);
      const embedding = await getEmbedding(item.content);
      const vectorString = `[${embedding.join(',')}]`;

      await client.query(
        `INSERT INTO "KnowledgeChunk" (id, title, content, embedding, source, tradition, tags, "createdAt")
         VALUES (gen_random_uuid(), $1, $2, $3::extensions.vector, $4, $5, $6, NOW())`,
        [item.title, item.content, vectorString, item.source, item.tradition, item.tags]
      );
    }
    console.log('✅ Ingestion complete.');
  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ Ingestion failed:', err.message || error);
  } finally {
    await client.end();
  }
}

ingest().catch(console.error);
