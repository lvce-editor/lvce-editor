import {
  expect,
  Locator,
  test,
} from '../../renderer-worker/src/parts/TestFrameWork/TestFrameWork.js'
import {
  ContextMenu,
  Explorer,
  FileSystem,
  Workspace,
} from '../../renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponent.js'

test('viewlet.explorer-delete-file', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')

  await Workspace.setPath(tmpDir)

  // act
  await Explorer.openContextMenu(0)

  // assert
  await ContextMenu.selectItem('Delete')
  const file1 = Locator('text=file1.txt')
  await expect(file1).toBeHidden()
})
