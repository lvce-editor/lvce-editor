import { describe, expect, test } from '@jest/globals'
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { removeRipGrepFiles, removeRipGrepPackages } from '../src/parts/RemoveRipgrepFiles/RemoveRipGrepFiles.ts'

const createRipGrepPackage = async (indexContent: string): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'lvce-ripgrep-'))
  const packagePath = join(root, 'node_modules', '@lvce-editor', 'ripgrep', 'src')
  await mkdir(packagePath, { recursive: true })
  await writeFile(join(packagePath, 'index.js'), indexContent)
  await writeFile(join(packagePath, 'index.d.ts'), '')
  await writeFile(join(packagePath, 'postinstall.js'), '')
  await writeFile(join(packagePath, 'downloadRipGrep.js'), '')
  return root
}

describe('removeRipGrepFiles', () => {
  test('removes legacy download ripgrep export when present', async () => {
    const root = await createRipGrepPackage(
      [`export { rgPath } from '@vscode/ripgrep'`, `export { downloadRipGrep } from './downloadRipGrep.js'`, ''].join('\n'),
    )

    try {
      await removeRipGrepFiles(root, 'linux', 'x64')

      const content = await readFile(join(root, 'node_modules', '@lvce-editor', 'ripgrep', 'src', 'index.js'), 'utf8')
      expect(content).toBe(`export { rgPath } from '@vscode/ripgrep'\n\n`)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('keeps current ripgrep export when legacy helper is absent', async () => {
    const root = await createRipGrepPackage(`export { rgPath } from '@vscode/ripgrep'\n`)

    try {
      await removeRipGrepFiles(root, 'linux', 'x64')

      const content = await readFile(join(root, 'node_modules', '@lvce-editor', 'ripgrep', 'src', 'index.js'), 'utf8')
      expect(content).toBe(`export { rgPath } from '@vscode/ripgrep'\n`)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})

test('removes ripgrep packages from Debian app contents', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lvce-debian-ripgrep-'))
  const nodeModules = join(root, 'packages', 'shared-process', 'node_modules')
  const ripgrepPackages = [
    join(nodeModules, '@lvce-editor', 'ripgrep'),
    join(nodeModules, '@vscode', 'ripgrep'),
    join(nodeModules, '@vscode', 'ripgrep-linux-x64'),
    join(nodeModules, '@vscode', 'other-package'),
  ]

  try {
    await Promise.all(ripgrepPackages.map((path) => mkdir(path, { recursive: true })))
    await removeRipGrepPackages(join(root, 'packages', 'shared-process'))

    await expect(access(ripgrepPackages[0])).rejects.toThrow()
    await expect(access(ripgrepPackages[1])).rejects.toThrow()
    await expect(access(ripgrepPackages[2])).rejects.toThrow()
    await expect(access(ripgrepPackages[3])).resolves.toBeUndefined()
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
