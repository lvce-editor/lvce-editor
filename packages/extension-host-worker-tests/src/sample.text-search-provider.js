import {
  expect,
  Locator,
  test,
} from '../../renderer-worker/src/parts/TestFrameWork/TestFrameWork.js'
import {
  Extension,
  FileSystem,
  Search,
  SideBar,
  Workspace,
} from '../../renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponent.js'

const name = 'sample.text-search-provider'

test('sample.text-search-provider', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )
  await SideBar.open('Search')

  // act
  await Search.setValue('abc')

  // assert
  const results = Locator(`.Viewlet[data-viewlet-id="Search"] .TreeItem`)
  await expect(results).toHaveCount(1)
  const resultOne = results.nth(0)
  await expect(resultOne).toHaveText('./index.txt')
})
