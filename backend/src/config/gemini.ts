import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export interface GeminiKeyEntry {
  index: number;
  label: string;
  envVar: string;
  maskedKey: string;
  client: GoogleGenAI;
}

function maskKey(key: string): string {
  if (!key) return '';
  const trimmed = key.trim();
  if (trimmed.length <= 8) return '****';
  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}

function resolveConfiguredKeys(): { envVar: string; label: string; key: string }[] {
  const discovered: { envVar: string; label: string; key: string }[] = [];
  const seenKeys = new Set<string>();

  const addKeyIfValid = (envVar: string, label: string, rawVal?: string) => {
    if (!rawVal) return;
    const cleanKey = rawVal.trim().replace(/^["']|["']$/g, '');
    if (cleanKey && !seenKeys.has(cleanKey)) {
      seenKeys.add(cleanKey);
      discovered.push({ envVar, label, key: cleanKey });
    }
  };

  // 1. Primary Key
  addKeyIfValid('GEMINI_API_KEY', 'Primary Key', process.env.GEMINI_API_KEY);

  // 2. Backup / Spare Keys
  addKeyIfValid('GEMINI_API_KEY_BACKUP', 'Spare Backup Key 1', process.env.GEMINI_API_KEY_BACKUP);
  addKeyIfValid('GEMINI_BACKUP_API_KEY', 'Spare Backup Key 2', process.env.GEMINI_BACKUP_API_KEY);
  addKeyIfValid('GEMINI_API_KEY_SPARE', 'Spare Key', process.env.GEMINI_API_KEY_SPARE);
  addKeyIfValid('GEMINI_SPARE_API_KEY', 'Spare Key Alias', process.env.GEMINI_SPARE_API_KEY);

  // 3. Comma-separated list support in GEMINI_API_KEYS or GEMINI_API_KEY
  const commaSeparated = process.env.GEMINI_API_KEYS;
  if (commaSeparated) {
    const parts = commaSeparated.split(',').map((k) => k.trim());
    parts.forEach((k, idx) => {
      addKeyIfValid('GEMINI_API_KEYS', `Additional Key #${idx + 1}`, k);
    });
  }

  return discovered;
}

const resolvedKeys = resolveConfiguredKeys();

export const geminiClients: GeminiKeyEntry[] = resolvedKeys.map((item, index) => {
  const client = new GoogleGenAI({
    apiKey: item.key,
    httpOptions: {
      headers: {
        'User-Agent': 'tripflow-backend',
      },
    },
  });

  return {
    index,
    label: item.label,
    envVar: item.envVar,
    maskedKey: maskKey(item.key),
    client,
  };
});

export const isGeminiConfigured = geminiClients.length > 0;
export const hasBackupGeminiKey = geminiClients.length > 1;
export const primaryGeminiClient = geminiClients[0]?.client ?? null;

/**
 * Executes a Gemini operation with automatic failover to spare/backup API keys
 * if the current key encounters rate-limiting (429), quota exhaustion, or service failure.
 */
export async function executeGeminiWithFailover<T>(
  operation: (client: GoogleGenAI, entry: GeminiKeyEntry) => Promise<T>,
  callerContext: string = 'Gemini AI'
): Promise<T> {
  if (geminiClients.length === 0) {
    throw new Error(`[${callerContext}] No Gemini API key configured in environment.`);
  }

  let lastError: any = null;

  for (let i = 0; i < geminiClients.length; i++) {
    const entry = geminiClients[i];
    try {
      const result = await operation(entry.client, entry);
      if (i > 0) {
        console.log(
          `✨ [${callerContext}] Recovered successfully using spare key [${entry.label} (${entry.maskedKey})]`
        );
      }
      return result;
    } catch (err: any) {
      lastError = err;
      const errorMsg = err?.message || String(err);
      console.warn(
        `⚠️ [${callerContext}] Key #${entry.index + 1} (${entry.label} - ${entry.maskedKey}) failed: ${errorMsg}`
      );

      const hasNext = i + 1 < geminiClients.length;
      if (hasNext) {
        const nextEntry = geminiClients[i + 1];
        console.info(
          `🔄 [${callerContext}] Automatically switching to spare Gemini API key [${nextEntry.label} (${nextEntry.maskedKey})]...`
        );
      }
    }
  }

  throw lastError || new Error(`[${callerContext}] All configured Gemini API keys failed.`);
}

/**
 * High-level helper to generate content with failover and optional timeout support.
 */
export async function generateContentWithFailover(
  params: Parameters<GoogleGenAI['models']['generateContent']>[0],
  options: {
    timeoutMs?: number;
    callerContext?: string;
  } = {}
): Promise<any> {
  const { timeoutMs, callerContext = 'Gemini GenerateContent' } = options;

  return executeGeminiWithFailover(async (client) => {
    const callPromise = client.models.generateContent(params);
    if (!timeoutMs) {
      return await callPromise;
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    );

    return await Promise.race([callPromise, timeoutPromise]);
  }, callerContext);
}
