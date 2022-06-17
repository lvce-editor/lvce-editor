import * as ViewletQuickPick from '../src/parts/Viewlet/ViewletQuickPick.js'

test.skip('create', () => {
  const getProvider = () => {}
  const state = ViewletQuickPick.create(getProvider)
  expect(state).toBeDefined()
})

test.skip('loadContent', async () => {
  const state = ViewletQuickPick.create()
  await ViewletQuickPick.loadContent(state)
})
