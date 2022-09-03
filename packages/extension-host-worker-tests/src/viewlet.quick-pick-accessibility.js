// manual accessibility tests

// open quick pick
// nvda says:  "quick input, layout, toggle side bar, 1 of 92"
// windows narrator says:  "cap, scan, layout, toggle side bar, 1 of 92, selected"
// orca says: "list with 92 items, layout, colon, toggle side bar"

// focus second item
// nvda says:  "layout, toggle panel, 2 of 92"
// windows narrator says:  "layout, toggle panel, 2 of 92, selected"
// orca says:  "layout, toggle panel"

// no results
// nvda says:  ""
// windows narrator says:  ""
// orca says:  "No results"

test('viewlet.quick-pick-no-results', async () => {
  // act
  await QuickPick.open()

  // assert
  const quickPickInput = Locator('#QuickPick .InputBox')
  const quickPickItems = Locator('.QuickPickItem')
  await expect(quickPickInput).toHaveAttribute('role', 'combobox')
  await expect(quickPickInput).toHaveAttribute(
    'aria-activedescendant',
    'QuickPickItemActive'
  )
  await expect(quickPickItems.nth(0)).toHaveAttribute(
    'id',
    'QuickPickItemActive'
  )

  // act
  await QuickPick.focusNext()

  // assert
  // TODO add toHaveId method to test framework
  await expect(quickPickItems.nth(1)).toHaveAttribute(
    'id',
    'QuickPickItemActive'
  )
  await expect(quickPickInput).toHaveAttribute(
    'aria-activedescendant',
    'QuickPickItemActive'
  )

  // act
  await QuickPick.setValue('not-found')

  // assert
  const noResultMessage = Locator('.QuickPickStatus')
  await expect(noResultMessage).toBeVisible()
  await expect(noResultMessage).toHaveText('No Results')
})
