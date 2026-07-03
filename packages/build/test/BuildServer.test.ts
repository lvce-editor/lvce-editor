import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { setVersionsAndDependencies } from '../src/parts/BuildServer/BuildServer.js'

const writeJson = async (path: string, value: unknown): Promise<void> => {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`)
}

const readJson = async (path: string): Promise<any> => {
  return JSON.parse(await readFile(path, 'utf8'))
}

test('setVersionsAndDependencies includes process explorer as shared-process dependency', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-build-server-'))
  try {
    const serverPackageJson = join(dir, 'server-package.json')
    const sharedProcessPackageJson = join(dir, 'shared-process-package.json')

    await writeJson(serverPackageJson, {
      name: '@lvce-editor/server',
      dependencies: {},
      scripts: {},
      devDependencies: {},
      jest: {},
    })
    await writeJson(sharedProcessPackageJson, {
      name: '@lvce-editor/shared-process',
      dependencies: {
        '@lvce-editor/assert': '1.5.1',
      },
      optionalDependencies: {
        '@lvce-editor/process-explorer': '3.0.0',
        '@vscode/windows-process-tree': '1.0.0',
        'symlink-dir': '1.0.0',
        tail: '2.2.6',
      },
      scripts: {},
      devDependencies: {},
      jest: {},
    })

    await setVersionsAndDependencies({
      version: '1.2.3',
      files: [serverPackageJson, sharedProcessPackageJson],
    })

    const serverJson = await readJson(serverPackageJson)
    const sharedProcessJson = await readJson(sharedProcessPackageJson)

    expect(serverJson.dependencies['@lvce-editor/shared-process']).toBe('1.2.3')
    expect(serverJson.dependencies['@lvce-editor/static-server']).toBe('1.2.3')
    expect(sharedProcessJson.dependencies['@lvce-editor/extension-host-helper-process']).toBe('1.2.3')
    expect(sharedProcessJson.dependencies['@lvce-editor/process-explorer']).toBe('3.0.0')
    expect(sharedProcessJson.optionalDependencies).not.toHaveProperty('@lvce-editor/process-explorer')
    expect(sharedProcessJson.optionalDependencies).not.toHaveProperty('@vscode/windows-process-tree')
    expect(sharedProcessJson.optionalDependencies).not.toHaveProperty('symlink-dir')
    expect(sharedProcessJson.optionalDependencies.tail).toBe('2.2.6')
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
