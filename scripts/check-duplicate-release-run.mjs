import { pathToFileURL } from 'node:url'

export const hasPriorReleaseRun = (runs, currentRunId, headSha, headBranch) => runs.some((run) =>
  run.id < currentRunId &&
  run.event === 'push' &&
  run.head_sha === headSha &&
  run.head_branch === headBranch,
)

const main = async () => {
  const { GITHUB_API_URL = 'https://api.github.com', GITHUB_REPOSITORY, GITHUB_REF_NAME, GITHUB_RUN_ID, GITHUB_SHA, GITHUB_TOKEN } = process.env
  if (!GITHUB_REPOSITORY || !GITHUB_REF_NAME || !GITHUB_RUN_ID || !GITHUB_SHA || !GITHUB_TOKEN) {
    throw new Error('Missing GitHub Actions release-run environment')
  }
  const url = new URL(`${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/actions/workflows/release.yml/runs`)
  url.searchParams.set('branch', GITHUB_REF_NAME)
  url.searchParams.set('per_page', '100')
  const response = await fetch(url, { headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${GITHUB_TOKEN}`, 'x-github-api-version': '2022-11-28' } })
  if (!response.ok) throw new Error(`Failed to inspect release workflow runs: HTTP ${response.status}`)
  const { workflow_runs: runs } = await response.json()
  if (hasPriorReleaseRun(runs, Number(GITHUB_RUN_ID), GITHUB_SHA, GITHUB_REF_NAME)) {
    throw new Error(`Another push run already handles ${GITHUB_REF_NAME} at ${GITHUB_SHA}; stop before touching release assets`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
