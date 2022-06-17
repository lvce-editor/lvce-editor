import { check, keyboardOperation, test } from './utils.js'

test.skip('Workbench', async () => {
  await check('#SideBar', 'isVisible')
  await keyboardOperation({ key: 'b', ctrlKey: true })
  await check('#SideBar', 'not.isVisible')
  await keyboardOperation({ key: 'b', ctrlKey: true })
  await check('#SideBar', 'isVisible')

  await check('#Panel', 'isVisible')
  await keyboardOperation({ key: '`', ctrlKey: true })
  await check('#Panel', 'not.isVisible')
  await keyboardOperation({ key: '`', ctrlKey: true })
  await check('#Panel', 'isVisible')
})
