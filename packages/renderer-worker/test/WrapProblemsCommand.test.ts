import { expect, jest, test } from '@jest/globals'
import { wrapProblemsCommandWithDependencies } from '../src/parts/WrapProblemsCommand/WrapProblemsCommand.ts'

test('returns updated actions when the problems body has no diff', async () => {
  const invoke = jest.fn(async (command: string, ..._args: readonly unknown[]): Promise<unknown> => {
    if (command === 'Problems.diff2') {
      return []
    }
    if (command === 'Problems.renderActions') {
      return [{ title: 'View as List' }]
    }
    return undefined
  })
  const command = wrapProblemsCommandWithDependencies('viewAsTable', {
    getState: () => ({ marker: 'latest', uid: 7 }),
    invoke,
  })

  const result = await command({ actionsDom: [{ title: 'View as Table' }], uid: 7 })

  expect(result).toEqual({
    actionsDom: [{ title: 'View as List' }],
    commands: [],
    marker: 'latest',
    uid: 7,
  })
  expect(invoke).not.toHaveBeenCalledWith('Problems.render2', 7, [])
})

test('returns updated body commands and actions when both changed', async () => {
  const invoke = jest.fn(async (command: string, ..._args: readonly unknown[]): Promise<unknown> => {
    if (command === 'Problems.diff2') {
      return [1]
    }
    if (command === 'Problems.render2') {
      return [['Viewlet.setDom2']]
    }
    if (command === 'Problems.renderActions') {
      return [{ title: 'View as List' }]
    }
    return undefined
  })
  const command = wrapProblemsCommandWithDependencies('viewAsTable', {
    getState: () => ({ marker: 'latest', uid: 7 }),
    invoke,
  })

  const result = await command({ actionsDom: [{ title: 'View as Table' }], uid: 7 })

  expect(result.actionsDom).toEqual([{ title: 'View as List' }])
  expect(result.commands).toEqual([['Viewlet.setDom2']])
})

test('preserves state when neither body nor actions changed', async () => {
  const actionsDom = [{ title: 'View as Table' }]
  const state = { actionsDom, uid: 7 }
  const invoke = jest.fn(async (command: string, ..._args: readonly unknown[]): Promise<unknown> => {
    if (command === 'Problems.diff2') {
      return []
    }
    if (command === 'Problems.renderActions') {
      return actionsDom
    }
    return undefined
  })
  const command = wrapProblemsCommandWithDependencies('handleBlur', {
    getState: () => state,
    invoke,
  })

  const result = await command(state)

  expect(result).toBe(state)
})
