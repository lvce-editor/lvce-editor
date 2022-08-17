import { test } from '../../renderer-worker/src/parts/TestFrameWork/TestFrameWork.js'
import {
  Extension,
  FileSystem,
  Search,
  SideBar,
  Workspace,
} from '../../renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponent.js'

const name = 'sample.text-search-provider-error'

test('sample.text-search-provider-error', async () => {
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
  // TODO search viewlet should show error message
  // await expect(overlayMessage).toHaveText(
  // 'Failed to search provider: oops'
  // )
})
