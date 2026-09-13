import assert from 'node:assert/strict'
import { _electron, expect } from '@playwright/test'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseKeyBindingString } from '../../renderer-worker/src/parts/ParseKeyBindingString/ParseKeyBindingString.js'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const executablePath = process.env.LVCE_TEST_EXECUTABLE || resolve(root, 'packages/build/.tmp/electron-bundle/x64/lvce-oss')
const profile = await mkdtemp(join(tmpdir(), 'lvce-notebook-defaults-'))
await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
await writeFile(
  join(profile, 'config/lvce-oss/keybindings.json'),
  JSON.stringify([
    { source: 'User', key: parseKeyBindingString('Ctrl+Alt+1'), command: 'Main.openUri', args: ['extension-detail:///builtin.notebook'] },
    { source: 'User', key: parseKeyBindingString('Ctrl+Alt+2'), command: 'Main.closeAllEditors' },
  ]),
)
const notebook = join(profile, 'example.ipynb')
await writeFile(
  notebook,
  JSON.stringify({
    nbformat: 4,
    nbformat_minor: 5,
    cells: [{ cell_type: 'code', source: ['print(42)'], metadata: {}, execution_count: null, outputs: [] }],
    metadata: {},
  }),
)
const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE
for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
let app
const launch = async () => {
  app = await _electron.launch({
    executablePath,
    args: ['--no-sandbox', `--user-data-dir=${join(profile, 'chromium')}`, notebook],
    env,
    timeout: 30000,
  })
  const page = await app.firstWindow()
  await expect(page.locator('.Workbench')).toBeVisible()
  return page
}
const openDetail = async (page) => {
  await page.bringToFront()
  await page.locator('.Workbench').click()
  await page.keyboard.press('Control+Alt+1')
  await expect(page.locator('.ExtensionDetailName')).toHaveText('Notebookbuiltin')
}
try {
  let page = await launch()
  await expect(page.locator('.NotebookSource')).toBeHidden()
  await openDetail(page)
  await expect(page.locator('[name="Install"]')).toBeHidden()
  await expect(page.locator('[name="Disable"]')).toBeHidden()
  await page.locator('[name="Enable"]').click()
  await expect(page.locator('[name="Disable"]')).toBeVisible()
  const enablementPath = join(profile, 'data/lvce-oss/extensions/disabled-extensions.json')
  await expect.poll(async () => JSON.parse(await readFile(enablementPath, 'utf8')).enabledExtensions).toContain('builtin.notebook')
  await app.close()
  app = undefined

  page = await launch()
  await openDetail(page)
  await expect(page.locator('[name="Enable"]')).toBeHidden()
  await expect(page.locator('[name="Disable"]')).toBeVisible()
  await page.keyboard.press('Control+Alt+2')
  await page.getByRole('treeitem', { name: 'example.ipynb', exact: true }).dblclick()
  await expect(page.locator('.NotebookSource')).toHaveValue('print(42)')
  assert.deepEqual(JSON.parse(await readFile(enablementPath, 'utf8')).enabledExtensions, ['builtin.notebook'])
  console.log('Packaged notebook is installed, disabled initially, and enabled after restarting with the same isolated profile')
} finally {
  await app?.close()
  await rm(profile, { recursive: true, force: true })
}
