import * as os from 'os';
import * as path from 'path';

/**
 * Resolves the writable uploads directory.
 * On Vercel Serverless Functions, process.cwd() is read-only so writes must target os.tmpdir().
 */
export function getUploadsDir(): string {
  const baseDir = process.env.VERCEL ? os.tmpdir() : process.cwd();
  return path.join(baseDir, 'uploads');
}
