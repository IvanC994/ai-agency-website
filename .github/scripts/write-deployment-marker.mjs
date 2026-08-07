import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const outputPath = join(
  repositoryRoot,
  'public',
  'routineforge-deployment.json'
);

const readGitCommit = () => {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return '';
  }
};

const commit = (
  process.env.WORKERS_CI_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  readGitCommit()
).trim().toLowerCase();

if (!/^[0-9a-f]{40}$/.test(commit)) {
  throw new Error(
    'Unable to determine a valid 40-character deployment commit SHA.'
  );
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify({ commit })}\n`,
  'utf8'
);

console.log(`Wrote deployment marker for ${commit}.`);
