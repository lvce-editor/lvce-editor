/// <reference path="../typings/types.d.ts" />

const name = 'sample.brace-completion-provider-error-spelling'

test.skip('sample.brace-completion-provider-error-spelling', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, ``)

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.executeBraceCompletion('{')

  // assert
  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO could be even more helpful here and during extension development
  // try to find the closest matching api name (edit distance)
  // and when clicking "ok", automatically fixing the spelling error in the source code
  await expect(overlayMessage).toHaveText(
    'Error: Failed to activate extension sample.brace-completion-provider-error-spelling: TypeError: vscode.registerBraceCompletionProcider is not a function'
  )
})

export {}
