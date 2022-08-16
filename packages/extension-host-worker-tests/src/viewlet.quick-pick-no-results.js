import {
  expect,
  Locator,
  test,
} from '../../renderer-worker/src/parts/TestFrameWork/TestFrameWork.js'
import {
  Editor,
  Extension,
  FileSystem,
  Main,
  Workspace,
  ContextMenu,
  QuickPick,
} from '../../renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponent.js'

test('viewlet.quick-pick-no-results', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )

  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('aaaaaaaa')

  // assert
  // TODO should show that there are no results
})
