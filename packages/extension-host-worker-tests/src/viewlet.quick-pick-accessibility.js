/// <reference path="../typings/types.d.ts" />

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
  await expect(quickPickInput).toHaveAttribute('role', 'combobox')
  await expect(quickPickInput).toHaveAttribute(
    'aria-activedescendant',
    'QuickPickItem-1'
  )

  // act
  await QuickPick.focusNext()

  // assert
  await expect(quickPickInput).toHaveAttribute(
    'aria-activedescendant',
    'QuickPickItem-2'
  )

  // act
  await QuickPick.setValue('not-found')

  // assert
  const noResultMessage = Locator('.QuickPickStatus')
  await expect(noResultMessage).toBeVisible()
  await expect(noResultMessage).toHaveText('No Results')
})
