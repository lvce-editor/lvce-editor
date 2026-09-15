import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-icon-theme-disabled'

export const test: Test = async ({ expect, ExtensionDetail, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.js`, '')
  await Workspace.setPath(tmpDir)

  const fileIcon = Locator('.TreeItem[aria-label="file.js"] .FileIcon')
  await expect(fileIcon).toBeVisible()

  await ExtensionDetail.open('builtin.vscode-icons')
  await ExtensionDetail.handleClickDisable()
  await expect(fileIcon).toHaveCount(0)

  await ExtensionDetail.handleClickEnable()
  await expect(fileIcon).toBeVisible()

  await Settings.update({
    'workbench.iconTheme': null,
  })
  await expect(fileIcon).toHaveCount(0)

  await Settings.update({
    'workbench.iconTheme': 'vscode-icons',
  })
  await expect(fileIcon).toBeVisible()
}
