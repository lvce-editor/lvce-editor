const name = 'sample.command-provider-error'

test('sample.command-provider-error', async () => {
  // arrange
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await Command.execute('command-provider-error.sampleCommand')

  // assert

  // TODO
})

export {}
