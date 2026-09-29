import { expect, test } from '@jest/globals'

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

test('create keeps main visible', () => {
  const state = ViewletLayout.create(1)

  expect(state.mainVisible).toBe(true)
})

test('hideMain is a no-op', async () => {
  const state = ViewletLayout.create(1)

  const result = await ViewletLayout.hideMain(state)

  expect(result).toEqual({
    newState: state,
    commands: [],
  })
})

test('toggleMain is a no-op', async () => {
  const state = ViewletLayout.create(1)

  const result = await ViewletLayout.toggleMain(state)

  expect(result).toEqual({
    newState: state,
    commands: [],
  })
})
