// manual accessibility tests

// focus input
// nvda says: "search key bindings, edit, results will update as you type, blank"
// windows narrator says: ""
// orca says: ""

// No results
// nvda says: "no results"
// windows narrator says: ""
// orca says: ""

test('viewlet.keybindings', async () => {
  // act
  await Main.openUri('app://keybindings')

  // assert
  const inputBox = Locator('.KeyBindingsHeader .InputBox')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toHaveAttribute('type', 'search')
  await expect(inputBox).toHaveAttribute('placeholder', 'Search Key Bindings')
  expect(inputBox).toHaveAttribute(
    'aria-description',
    'Results will update as you type'
  )
  const table = Locator('.KeyBindingsTable')
  await expect(table).toBeVisible()
  await expect(table).toHaveAttribute('aria-label', 'KeyBindings')
})
