/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletLocations = await import(
  '../src/parts/Viewlet/ViewletLocations.js'
)

test('name', () => {
  expect(ViewletLocations.name).toBe('Locations')
})

test('create', () => {
  const state = ViewletLocations.create()
  expect(state).toBeDefined()
})

test('setLocations - no location found', () => {
  const state = ViewletLocations.create()
  ViewletLocations.setLocations(state, [])
  expect(state.$Locations.children).toHaveLength(0)
})

test('setLocations - single location found', () => {
  const state = ViewletLocations.create()
  ViewletLocations.setLocations(state, [
    {
      depth: 1,
      posInSet: 1,
      setSize: 1,
      type: 'expanded',
      uri: '/test/index.js',
      name: 'index.js',
      lineText: '',
    },
    {
      depth: 2,
      posInSet: 1,
      setSize: 1,
      type: 'leaf',
      name: '',
      uri: '',
      lineText: 'test',
    },
  ])
  expect(state.$Locations.children).toHaveLength(2)
  expect(state.$Locations.children[0].textContent).toBe('index.js')
  expect(state.$Locations.children[1].textContent).toBe('test')
})

test('accessibility - location list should have role tree, aria label and tabindex', () => {
  const state = ViewletLocations.create()
  ViewletLocations.setLocations(state, [
    {
      depth: 1,
      posInSet: 1,
      setSize: 1,
      type: 'expanded',
      uri: '/test/index.js',
      name: 'index.js',
      lineText: '',
    },
    {
      depth: 2,
      posInSet: 1,
      setSize: 1,
      type: 'leaf',
      name: '',
      uri: '',
      lineText: 'test',
    },
  ])
  // expect(state.$Locations.ariaLabel).toBe('References') // TODO
  expect(state.$Locations.getAttribute('role')).toBe('tree')
  expect(state.$Locations.tabIndex).toBe(0)
})

test('event - left click on tree', () => {
  const state = ViewletLocations.create()
  ViewletLocations.setLocations(state, [
    {
      depth: 1,
      posInSet: 1,
      setSize: 1,
      type: 'expanded',
      uri: '/test/index.js',
      name: 'index.js',
      lineText: '',
    },
    {
      depth: 2,
      posInSet: 1,
      setSize: 1,
      type: 'leaf',
      name: '',
      uri: '',
      lineText: 'test',
    },
  ])
  const event = new MouseEvent('mousedown', {
    bubbles: true,
  })
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$Locations.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(['Locations.focusIndex', -1])
})

test('event - left click on reference', () => {
  const state = ViewletLocations.create()
  ViewletLocations.setLocations(state, [
    {
      depth: 1,
      posInSet: 1,
      setSize: 1,
      type: 'expanded',
      uri: '/test/index.js',
      name: 'index.js',
      lineText: '',
    },
    {
      depth: 2,
      posInSet: 1,
      setSize: 1,
      type: 'leaf',
      name: '',
      uri: '',
      lineText: 'test',
    },
  ])
  const $Location = state.$Locations.children[1]
  const event = new MouseEvent('mousedown', {
    bubbles: true,
  })
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  $Location.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(['Locations.selectIndex', 1])
})
