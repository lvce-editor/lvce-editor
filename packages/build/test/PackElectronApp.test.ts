import { expect, test } from '@jest/globals'
import { extractFile, statFile } from '@electron/asar'
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { packElectronApp } from '../src/parts/PackElectronApp/PackElectronApp.ts'

test('packs the entry point and keeps the Node runtime and external resources on disk', async () => {
  const resourcesPath = await mkdtemp(join(tmpdir(), 'lvce-asar-test-'))
  const files = {
    'package.json': JSON.stringify({ type: 'module', main: 'packages/main-process/dist/mainProcessMain.js' }),
    'packages/main-process/dist/mainProcessMain.js': `const root = join(__dirname$1, '../../..');`,
    'packages/main-process/pages/error/error.html': 'error page',
    'packages/main-process/node_modules/native/native.node': 'native module',
    'packages/shared-process/src/sharedProcessMain.js': 'shared process',
    'packages/shared-process/node_modules/node-pty/build/Release/pty.node': 'pty',
    'packages/shared-process/node_modules/@lvce-editor/ripgrep/bin/rg': 'ripgrep',
    'static/build/extensions/tool/bin/tool': 'extension executable',
    'static/build/font.woff2': 'font',
    'config.json': '{}',
  }
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const path = join(resourcesPath, 'app', relativePath)
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, content)
    }
    await packElectronApp({ resourcesPath })
    await expect(access(join(resourcesPath, 'app'))).rejects.toThrow()
    const archivePath = join(resourcesPath, 'app.asar')
    expect(JSON.parse(extractFile(archivePath, 'package.json').toString()).main).toBe('packages/main-process/dist/mainProcessMain.js')
    expect(statFile(archivePath, 'packages/main-process/dist/mainProcessMain.js').unpacked).not.toBe(true)
    expect(extractFile(archivePath, 'packages/main-process/dist/mainProcessMain.js').toString()).toContain('app.asar.unpacked')
    for (const [relativePath, content] of Object.entries(files).slice(2)) {
      expect(statFile(archivePath, relativePath).unpacked).toBe(true)
      expect(await readFile(join(resourcesPath, 'app.asar.unpacked', relativePath), 'utf8')).toBe(content)
    }
  } finally {
    await rm(resourcesPath, { recursive: true, force: true })
  }
})
