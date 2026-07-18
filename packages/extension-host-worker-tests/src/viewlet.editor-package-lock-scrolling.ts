import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-package-lock-scrolling'

const createPackageLock = (): string => {
  const packages = Object.fromEntries(
    Array.from({ length: 100 }, (_, index) => [
      `node_modules/package-${String(index).padStart(3, '0')}`,
      {
        integrity: `sha512-package-${index}`,
        license: 'MIT',
        resolved: `https://registry.npmjs.org/package-${index}/-/package-${index}-${index}.0.0.tgz`,
        version: `${index}.0.0`,
      },
    ]),
  )
  return JSON.stringify(
    {
      lockfileVersion: 3,
      name: 'package-lock-scroll',
      packages,
      requires: true,
      version: '0.0.0-dev',
    },
    null,
    2,
  )
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/package-lock.json`
  await FileSystem.writeFile(filePath, createPackageLock())
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(filePath)

  await Promise.all(Array.from({ length: 10 }, () => Command.execute('Editor.handleWheel', 0, 0, 56)))

  const rows = Locator('.EditorRow')
  const packageRow = rows.nth(0)
  const integrityRow = rows.nth(1)
  const licenseRow = rows.nth(2)
  const resolvedRow = rows.nth(3)
  const versionRow = rows.nth(4)
  const closingRow = rows.nth(5)
  await expect(packageRow).toHaveText('    "node_modules/package-004": {')
  await expect(integrityRow).toHaveText('      "integrity": "sha512-package-4",')
  await expect(licenseRow).toHaveText('      "license": "MIT",')
  await expect(resolvedRow).toHaveText('      "resolved": "https://registry.npmjs.org/package-4/-/package-4-4.0.0.tgz",')
  await expect(versionRow).toHaveText('      "version": "4.0.0"')
  await expect(closingRow).toHaveText('    },')
}
