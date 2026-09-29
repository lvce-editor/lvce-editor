import { readFile } from 'node:fs/promises'
import { expect, test } from '@jest/globals'

test('release workflow does not publish the retired extension host helper process', async () => {
  const releaseWorkflowUrl = new URL('../../../.github/workflows/release.yml', import.meta.url)
  const releaseWorkflow = await readFile(releaseWorkflowUrl, 'utf8')

  expect(releaseWorkflow).not.toContain('extension-host-helper-process')
})
