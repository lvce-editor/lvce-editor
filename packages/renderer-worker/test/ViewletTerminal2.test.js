import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

const ViewletTerminal2 = await import(
  '../src/parts/ViewletTerminal2/ViewletTerminal2.js'
)

test('name', () => {
  expect(ViewletTerminal2.name).toBe(ViewletModuleId.Terminal2)
})

test('create', () => {
  const state = ViewletTerminal2.create()
  expect(state).toBeDefined()
})
