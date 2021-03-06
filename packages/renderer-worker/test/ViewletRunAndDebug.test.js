import { jest } from '@jest/globals'
import * as ViewletRunAndDebug from '../src/parts/Viewlet/ViewletRunAndDebug.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

test('name', () => {
  expect(ViewletRunAndDebug.name).toBe('RunAndDebug')
})

test('create', () => {
  const state = ViewletRunAndDebug.create(0)
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletRunAndDebug.create(0)
  expect(await ViewletRunAndDebug.loadContent(state)).toEqual({
    disposed: false,
    id: 0,
  })
})

test('contentLoaded', async () => {
  const state = ViewletRunAndDebug.create(0)
  RendererProcess.state.send = jest.fn()
  await ViewletRunAndDebug.contentLoaded(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test('dispose', () => {
  const state = ViewletRunAndDebug.create(0)
  expect(ViewletRunAndDebug.dispose(state)).toEqual({
    id: 0,
    disposed: true,
  })
})

test('resize', () => {
  const state = ViewletRunAndDebug.create()
  const { newState, commands } = ViewletRunAndDebug.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toEqual({
    disposed: false,
    height: 200,
    id: undefined,
    left: 200,
    top: 200,
    width: 200,
  })
  expect(commands).toEqual([])
})
