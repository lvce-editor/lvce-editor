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
} from '../../renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponent.js'

const name = 'sample.reference-provider-error-main-not-found'

test('sample.reference-provider-error-main-not-found', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Find all references')

  // assert
  const viewletLocations = Locator('.Viewlet[data-viewlet-id="Locations"]')
  await expect(viewletLocations).toBeVisible()

  // TODO should improve error message
  // TODO should show part of stack trace maybe?
  // const origin = location.origin
  const mainUrl = new URL(
    '../fixtures/sample.reference-provider-error-main-not-found/not-found.js',
    import.meta.url
  ).toString()
  await expect(viewletLocations).toHaveText(
    `Error: Failed to activate extension sample.reference-provider-error-main-not-found: TypeError: Failed to fetch dynamically imported module: ${mainUrl}`
  )
})
