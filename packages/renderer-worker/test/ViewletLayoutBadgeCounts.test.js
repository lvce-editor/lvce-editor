import { expect, test } from '@jest/globals'

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

test('create initializes empty badge counts', () => {
  const state = ViewletLayout.create(1)

  expect(ViewletLayout.getBadgeCounts(state)).toEqual({})
})

test('setBadgeCount stores badge count in layout state', async () => {
  const state = ViewletLayout.create(1)

  const result = await ViewletLayout.setBadgeCount(state, 'Source Control', 3)

  expect(result).toEqual({
    commands: [],
    newState: {
      ...state,
      badgeCounts: {
        'Source Control': 3,
      },
    },
  })
  expect(ViewletLayout.getBadgeCounts(result.newState)).toEqual({
    'Source Control': 3,
  })
})