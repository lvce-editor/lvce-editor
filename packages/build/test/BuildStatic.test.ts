import { afterEach, describe, expect, test } from '@jest/globals'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import * as Path from '../src/parts/Path/Path.js'
import { maybeRewriteBuiltinIconThemePaths } from '../src/parts/BuildStatic/BuildStatic.js'

const getDistPath = (commitHash: string) => {
  return Path.absolute(join('packages', 'build', '.tmp', 'dist', commitHash))
}

const getIconThemePath = (commitHash: string) => {
  return join(getDistPath(commitHash), 'extensions', 'builtin.vscode-icons', 'icon-theme.json')
}

afterEach(async () => {
  await rm(getDistPath('build-static-ignore-icon-theme'), { recursive: true, force: true })
  await rm(getDistPath('build-static-rewrite-icon-theme'), { recursive: true, force: true })
})

describe('maybeRewriteBuiltinIconThemePaths', () => {
  test('does nothing when icon theme handling is ignored', async () => {
    await expect(
      maybeRewriteBuiltinIconThemePaths({
        commitHash: 'build-static-ignore-icon-theme',
        pathPrefix: '/assets',
        ignoreIconTheme: true,
      }),
    ).resolves.toBeUndefined()
  })

  test('rewrites built-in icon theme paths when icon theme handling is enabled', async () => {
    const commitHash = 'build-static-rewrite-icon-theme'
    const iconThemePath = getIconThemePath(commitHash)
    await mkdir(dirname(iconThemePath), { recursive: true })
    await writeFile(iconThemePath, '{"iconPath":"/icons/default_file.svg"}')

    await maybeRewriteBuiltinIconThemePaths({
      commitHash,
      pathPrefix: '/assets',
      ignoreIconTheme: false,
    })

    const content = await readFile(iconThemePath, 'utf8')
    expect(content).toContain('"iconPath":"/assets/build-static-rewrite-icon-theme/icons/default_file.svg"')
  })
})
