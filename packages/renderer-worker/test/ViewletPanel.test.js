import * as ViewletPanel from '../src/parts/ViewletPanel/ViewletPanel.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

test('name', () => {
  expect(ViewletPanel.name).toBe('Panel')
})

test('create', () => {
  const state = ViewletPanel.create()
  expect(state).toBeDefined()
})

test.skip('loadContent', async () => {
  const state = ViewletPanel.create()
  expect(await ViewletPanel.loadContent(state)).toEqual({
    disposed: false,
    src: 'abc',
  })
})

// TODO
test.skip('contentLoaded', async () => {
  const state = { ...ViewletPanel.create(), src: 'abc' }
  await ViewletPanel.contentLoaded(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith({})
})

test('dispose', () => {
  const state = ViewletPanel.create()
  expect(ViewletPanel.dispose(state)).toMatchObject({
    disposed: true,
  })
})
