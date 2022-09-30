test('viewlet.key-bindings', async () => {
  // act
  await Main.openUri('app://keybindings')

  // assert
  const inputBox = Locator('.KeyBindingsHeader .InputBox')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toHaveAttribute('type', 'search')
  await expect(inputBox).toHaveAttribute('placeholder', 'Search Key Bindings')
  const table = Locator('.KeyBindingsTable')
  await expect(table).toBeVisible()
  await expect(table).toHaveAttribute('aria-label', 'KeyBindings')
})
