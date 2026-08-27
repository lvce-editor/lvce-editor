import { readFile } from 'node:fs/promises'
import { expect, test } from '@jest/globals'

test('macOS signing steps use the lvce-oss CI artifact', async () => {
  const ciWorkflowUrl = new URL('../../../.github/workflows/ci.yml', import.meta.url)
  const ciWorkflow = await readFile(ciWorkflowUrl, 'utf8')
  const dmgPath = 'packages/build/.tmp/releases/lvce-oss-arm64.dmg'

  expect(ciWorkflow).toContain(`notarize-macos-dmg.sh ${dmgPath}`)
  expect(ciWorkflow).toContain(`verify-macos-dmg.sh ${dmgPath}`)
  expect(ciWorkflow).toContain(`path: ${dmgPath}`)
})
