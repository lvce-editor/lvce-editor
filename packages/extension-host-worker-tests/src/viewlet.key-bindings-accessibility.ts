// manual accessibility tests

// focus input
// nvda says: "search key bindings, edit, results will update as you type, blank"
// windows narrator says: "search key bindings, edit"
// orca says: "search key bindings, entry, results will update as you type"

// No results
// nvda says: "no results"
// windows narrator says: "alert, no results found"
// orca says: "no results found"

export const name = 'viewlet.keybindings'

export const test = async ({ Main, Locator, expect }) => {
  // act
  await Main.openUri('app://keybindings')

  // assert
  const inputBox = Locator('.KeyBindingsSearchInputBox')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toHaveAttribute('type', 'search')
  await expect(inputBox).toHaveAttribute('placeholder', 'Type to search in keybindings')
  expect(inputBox).toHaveAttribute('aria-description', 'Results will update as you type')
  const table = Locator('.KeyBindingsTable')
  await expect(table).toBeVisible()
  await expect(table).toHaveAttribute('aria-label', 'KeyBindings')
}
