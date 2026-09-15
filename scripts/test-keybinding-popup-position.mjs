import { createRequire } from 'node:module'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseKeyBindingString } from '../packages/renderer-worker/src/parts/ParseKeyBindingString/ParseKeyBindingString.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requireTests = createRequire(join(root, 'packages/extension-host-worker-tests/package.json'))
const requireBuild = createRequire(join(root, 'packages/build/package.json'))
const { _electron } = requireTests('playwright')
const { expect } = requireTests('@playwright/test')
const { build } = requireBuild('esbuild')

const profile = await mkdtemp(join(tmpdir(), 'lvce-keybinding-popup-position-'))
const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const bundleUrl = '/packages/renderer-worker/dist/keybindingPopupPositionTestMain.js'
let app

const getCenter = (box) => box.x + box.width / 2

const openCommandPalette = async (page, command) => {
  await page.keyboard.press('Control+Shift+p')
  const input = page.locator('#QuickPick input.InputBox')
  await expect(input).toBeVisible()
  await page.keyboard.type(command)
  const option = page.getByRole('option', { name: command, exact: true })
  await expect(option).toBeVisible()
  await option.click()
}

const getIdeCenter = async (page) => {
  const workbench = await page.locator('#Workbench').boundingBox()
  const preview = await page.locator('.PreviewArea').boundingBox()
  if (!workbench || !preview) {
    throw new Error('Expected Workbench and preview bounds')
  }
  return workbench.x + (workbench.width - preview.width) / 2
}

try {
  await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
  await writeFile(join(profile, 'example.txt'), 'Keybinding popup fixture')
  await writeFile(
    join(profile, 'config/lvce-oss/keybindings.json'),
    JSON.stringify([
      { source: 'User', key: parseKeyBindingString('Ctrl+Shift+K'), command: 'Main.openUri', args: ['app://keybindings'] },
      { source: 'User', key: parseKeyBindingString('Ctrl+Shift+B'), command: 'Layout.hideSideBar' },
    ]),
  )
  await build({
    entryPoints: [join(root, 'packages/renderer-worker/src/rendererWorkerMain.ts')],
    outfile: join(root, bundleUrl),
    bundle: true,
    format: 'esm',
    platform: 'browser',
    external: ['node:*', '/static/*', 'electron'],
    logLevel: 'error',
  })
  await writeFile(rendererPath, rendererSource.replace('/packages/renderer-worker/src/rendererWorkerMain.ts', bundleUrl))

  const env = { ...process.env, DEV: '1', LVCE_ROOT: root, LVCE_SHARED_PROCESS_PATH: join(root, 'packages/shared-process/src/sharedProcessMain.ts') }
  delete env.ELECTRON_RUN_AS_NODE
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
  app = await _electron.launch({
    executablePath: join(root, 'packages/main-process/node_modules/electron/dist/electron'),
    args: ['--no-sandbox', '--disable-http-cache', '.', profile],
    cwd: join(root, 'packages/main-process'),
    env,
    timeout: 60000,
  })
  const page = await app.firstWindow()
  page.setDefaultTimeout(15000)
  await expect(page.locator('#Workbench')).toBeVisible({ timeout: 30000 })
  await page.getByRole('treeitem', { name: 'example.txt', exact: true }).dblclick()
  await expect(page.locator('.Editor')).toBeVisible()

  await page.keyboard.press('Control+Shift+k')
  await expect(page.locator('.KeyBindings')).toBeVisible()
  await page.keyboard.press('Control+Shift+b')
  await expect(page.locator('.SideBar')).toHaveCount(0)
  await openCommandPalette(page, 'Simple Browser: Open in Preview Area')
  await expect(page.locator('.PreviewArea .SimpleBrowser')).toBeVisible()
  await page.locator('.KeyBindings .TableBody .TableRow').first().dblclick()

  const popup = page.locator('.Viewlet.DefineKeyBinding')
  await expect(popup).toBeVisible()
  await expect(popup.locator('input')).toBeVisible()
  await expect(popup.locator('input')).toBeFocused()
  await expect.poll(async () => getCenter(await popup.boundingBox())).toBeCloseTo(await getIdeCenter(page), 0)
  await page.keyboard.press('Escape')
  await expect(popup).toBeHidden()

  const sash = await page.locator('.SashPreview').boundingBox()
  if (!sash) throw new Error('Expected preview sash bounds')
  await page.mouse.move(sash.x + sash.width / 2, sash.y + sash.height / 2)
  await page.mouse.down()
  await page.mouse.move(sash.x - 120, sash.y + sash.height / 2)
  await page.mouse.up()
  await expect(page.locator('.PreviewArea')).toBeVisible()
  await page.locator('.KeyBindings .TableBody .TableRow').first().dblclick()
  await expect(popup).toBeVisible()
  await expect.poll(async () => getCenter(await popup.boundingBox())).toBeCloseTo(await getIdeCenter(page), 0)

  await page.keyboard.press('Escape')
  await expect(popup).toBeHidden()
  await page.locator('.PreviewCloseButton').click()
  await expect(page.locator('.PreviewArea')).toHaveCount(0)
  await page.locator('.KeyBindings .TableBody .TableRow').first().dblclick()
  await expect(popup).toBeVisible()
  await expect
    .poll(async () => getCenter(await popup.boundingBox()))
    .toBeCloseTo(
      await page.locator('#Workbench').evaluate((element) => {
        const { x, width } = element.getBoundingClientRect()
        return x + width / 2
      }),
      0,
    )
  console.log('Define keybinding popup centers in the IDE area while the Simple Browser is open, after resizing, and after closing it')
} finally {
  await app?.close()
  await writeFile(rendererPath, rendererSource)
  await rm(profile, { recursive: true, force: true })
}
