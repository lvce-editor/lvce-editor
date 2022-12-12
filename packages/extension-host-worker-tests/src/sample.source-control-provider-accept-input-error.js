const name = 'sample.source-control-provider-accept-input-error'

test.skip('sample.source-control-provider-accept-input-error', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )
  await SideBar.open('Source Control')
  await Command.execute('Source Control.handleInput', 'abc')

  // act
  await Command.execute('Source Control.acceptInput')

  // assert

  // TODO
})

export {}
