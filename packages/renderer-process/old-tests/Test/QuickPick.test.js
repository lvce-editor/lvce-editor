import { keyboardOperation, check, test } from './utils.js'

test('QuickPick', async () => {
  await keyboardOperation({ key: 'p', ctrlKey: true })
  await check('#QuickPick', 'isVisible')
  await check('#QuickPickInput', 'isFocused')
  await check('#QuickPickItems', 'contains', '.QuickPickItem#item-0')
})

test('QuickPick closes with Escape', async () => {
  await keyboardOperation({ key: 'p', ctrlKey: true })
  await check('#QuickPick', 'isVisible')
  await check('#QuickPickInput', 'isFocused')
  await keyboardOperation({ key: 'Escape' })
  await check('#QuickPick', 'not.isVisible')
})
