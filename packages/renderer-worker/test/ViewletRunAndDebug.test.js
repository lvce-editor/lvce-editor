import * as ViewletRunAndDebug from '../src/parts/ViewletRunAndDebug/ViewletRunAndDebug.js'

test('name', () => {
  expect(ViewletRunAndDebug.name).toBe('Run And Debug')
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

test('dispose', () => {
  const state = ViewletRunAndDebug.create(0)
  expect(ViewletRunAndDebug.dispose(state)).toEqual({
    id: 0,
    disposed: true,
  })
})

test('resize', () => {
  const state = ViewletRunAndDebug.create()
  const newState = ViewletRunAndDebug.resize(state, {
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
})
