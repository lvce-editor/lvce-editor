import assert from 'node:assert/strict'
import { test } from 'node:test'
import { hasPriorReleaseRun } from '../check-duplicate-release-run.mjs'

const currentRunId = 42
const headSha = '0123456789abcdef0123456789abcdef01234567'
const headBranch = 'v0.125.0'

test('rejects a second push run for the same release tag and commit', () => {
  assert.equal(hasPriorReleaseRun([
    { id: 41, event: 'push', head_sha: headSha, head_branch: headBranch },
  ], currentRunId, headSha, headBranch), true)
})

test('allows the current run, newer queued runs, and unrelated tag, commit, or event', () => {
  assert.equal(hasPriorReleaseRun([
    { id: currentRunId, event: 'push', head_sha: headSha, head_branch: headBranch },
    { id: currentRunId + 1, event: 'push', head_sha: headSha, head_branch: headBranch },
    { id: 40, event: 'push', head_sha: headSha, head_branch: 'v0.124.0' },
    { id: 39, event: 'push', head_sha: 'fedcba9876543210fedcba9876543210fedcba98', head_branch: headBranch },
    { id: 38, event: 'workflow_dispatch', head_sha: headSha, head_branch: headBranch },
  ], currentRunId, headSha, headBranch), false)
})
