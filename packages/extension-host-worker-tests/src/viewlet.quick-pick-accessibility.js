import {
  expect,
  Locator,
  test,
} from '../../renderer-worker/src/parts/TestFrameWork/TestFrameWork.js'
import { QuickPick } from '../../renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponent.js'

// manual accessibility tests

// open quick pick
// nvda says:  "quick input, layout, toggle side bar, 1 of 92"
// windows narrator says:  "cap, scan, layout, toggle side bar, 1 of 92, selected"
// orca says: ""

// focus second item
// nvda says:  "layout, toggle panel, 2 of 92"
// windows narrator says:  "layout, toggle panel, 2 of 92, selected"
// orca says:  ""

test('viewlet.quick-pick-no-results', async () => {
  // arrange

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
})
