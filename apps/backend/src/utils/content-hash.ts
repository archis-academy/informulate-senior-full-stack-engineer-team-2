import crypto from 'crypto';

export function generateContentHash(content: string): string {
  return crypto
    .createHash('sha256')
    .update(content.trim().toLowerCase())
    .digest('hex');
}

export function hasContentChanged(
  newContent: string,
  existingHash: string | null
): boolean {
  if (!existingHash) return true;
  return generateContentHash(newContent) !== existingHash;
}

export function prepareContentForEmbedding(
  ...parts: (string | null | undefined)[]
): string {
  return parts
    .filter(Boolean)
    .map((part) => part!.trim())
    .join(' | ')
    .replace(/\s+/g, ' ')
    .trim();
}