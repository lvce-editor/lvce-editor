import {
  expect,
  Locator,
  test,
} from '../../renderer-worker/src/parts/TestFrameWork/TestFrameWork.js'
import {
  Explorer,
  FileSystem,
  KeyBoard,
  Workspace,
} from '../../renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponent.js'

test.skip('viewlet.explorer-keyboard-navigation', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a/b`)
  await FileSystem.writeFile(`${tmpDir}/a/b/c.txt`, 'ccccc')
  await FileSystem.mkdir(`${tmpDir}/folder-1`)
  await FileSystem.mkdir(`${tmpDir}/folder-2`)
  await FileSystem.mkdir(`${tmpDir}/folder-3`)
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'div')

  await Workspace.setPath(tmpDir)

  // act
  const explorer = Locator('.Viewlet[data-viewlet-id="Explorer"]')
  await explorer.click()

  // assert
  await expect(explorer).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('ArrowDown')

  // assert
  const titleA = '/a'
  const treeItemA = Locator(`.TreeItem[title$="${titleA}"]`)
  await expect(treeItemA).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('Space')

  // assert
  const titleB = '/a/b'
  const treeItemB = Locator(`.TreeItem[title$="${titleB}"]`)
  await expect(treeItemB).toBeVisible()
  await expect(treeItemA).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('ArrowDown')

  // assert
  await expect(treeItemB).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('Enter')

  // assert
  const titleC = '/a/b/c.txt'
  const treeItemC = Locator(`.TreeItem[title$="${titleC}"]`)
  await expect(treeItemC).toBeVisible()
  await expect(treeItemB).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('ArrowDown')

  // assert
  await expect(treeItemC).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('Enter')

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('ccccc')

  // act
  await KeyBoard.press('ArrowLeft')

  // assert
  await expect(treeItemB).toHaveClass('FocusOutline')
  await expect(treeItemC).toBeVisible()

  // act
  await KeyBoard.press('ArrowLeft')

  // assert
  await expect(treeItemB).toHaveClass('FocusOutline')
  await expect(treeItemC).not.toBeVisible()

  // act
  await KeyBoard.press('ArrowLeft')

  // assert
  await expect(treeItemA).toHaveClass('FocusOutline')
  await expect(treeItemB).toBeVisible()

  // act
  await KeyBoard.press('ArrowLeft')

  // assert
  await expect(treeItemA).toHaveClass('FocusOutline')
  await expect(treeItemB).not.toBeVisible()

  // act
  await KeyBoard.press('End')

  // assert
  const titleTest = '/test.txt'
  const treeItemTestTxt = Locator(`.TreeItem[title$="${titleTest}"]`)
  await expect(treeItemTestTxt).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('Home')

  // assert
  await expect(treeItemA).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('Delete')

  // assert
  await expect(treeItemA).not.toBeVisible()
  const titleFolder1 = `/folder-1`
  const treeItemFolder1 = Locator(`.TreeItem[title$="${titleFolder1}"]`)
  await expect(treeItemFolder1).toHaveClass('FocusOutline')

  // TODO test rename behavior
})
