import { expect, jest, test } from '@jest/globals'
import { createAccountLifecycle } from '../src/parts/Authentication/AccountLifecycle.ts'

const participant = { willChange: 'example.release', didChange: 'example.resume' }
const extension = { accountLifecycle: participant, commands: [{ id: participant.willChange }, { id: participant.didChange }] }

test('awaits pre-change cleanup and preserves the participants captured for each overlapping operation', async () => {
  const cleanup = Promise.withResolvers<void>()
  const execute = jest
    .fn<(command: string) => Promise<unknown>>()
    .mockResolvedValue(undefined)
    .mockImplementationOnce(() => cleanup.promise)
  const getExtensions = jest.fn(async () => [extension])
  const lifecycle = createAccountLifecycle({ execute, getExtensions })
  const first = lifecycle.beginAccountChange()
  expect(lifecycle.getAccountChangeState()).toEqual({ changing: true, generation: 1 })
  let finished = false
  void first.then(() => {
    finished = true
  })
  await Promise.resolve()
  await Promise.resolve()
  expect(execute).toHaveBeenCalledWith(participant.willChange)
  expect(finished).toBe(false)
  const second = await lifecycle.beginAccountChange()
  getExtensions.mockResolvedValue([])
  await lifecycle.endAccountChange(second)
  expect(lifecycle.getAccountChangeState()).toEqual({ changing: true, generation: 2 })
  cleanup.resolve()
  const id = await first
  await lifecycle.endAccountChange(id)
  expect(lifecycle.getAccountChangeState()).toEqual({ changing: false, generation: 2 })
  expect(execute.mock.calls).toEqual([[participant.willChange], [participant.willChange], [participant.didChange], [participant.didChange]])
  await lifecycle.endAccountChange(id)
  expect(execute).toHaveBeenCalledTimes(4)
})

test('offline cleanup failures leave sign-out available and still notify all participants on completion', async () => {
  const execute = jest.fn<(command: string) => Promise<unknown>>().mockRejectedValue(new Error('offline'))
  const lifecycle = createAccountLifecycle({ execute, getExtensions: async () => [extension] })
  const id = await lifecycle.beginAccountChange()
  expect(lifecycle.getAccountChangeState().changing).toBe(true)
  await lifecycle.endAccountChange(id)
  expect(lifecycle.getAccountChangeState().changing).toBe(false)
  expect(execute.mock.calls).toEqual([[participant.willChange], [participant.didChange]])
})

test('ignores disabled extensions and undeclared lifecycle commands', async () => {
  const execute = jest.fn<(command: string) => Promise<unknown>>()
  const lifecycle = createAccountLifecycle({
    execute,
    getExtensions: async () => [{ ...extension, disabled: true }, { accountLifecycle: participant }, { commands: extension.commands }],
  })
  await lifecycle.endAccountChange(await lifecycle.beginAccountChange())
  expect(execute).not.toHaveBeenCalled()
})

test('offline discovery still permits sign-out and invalidates old grants', async () => {
  const lifecycle = createAccountLifecycle({
    execute: async () => {},
    getExtensions: async () => {
      throw new Error('discovery failed')
    },
  })
  const id = await lifecycle.beginAccountChange()
  expect(lifecycle.getAccountChangeState()).toEqual({ changing: true, generation: 1 })
  await lifecycle.endAccountChange(id)
  expect(lifecycle.getAccountChangeState()).toEqual({ changing: false, generation: 1 })
})
