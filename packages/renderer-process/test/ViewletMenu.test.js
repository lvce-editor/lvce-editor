/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ViewletMenu from '../src/parts/Viewlet/ViewletMenu.js'

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

const getTextContent = ($Node) => {
  return $Node.textContent
}
const getSimpleList = ($Menu) => {
  return Array.from($Menu.children).map(getTextContent)
}

test('create', () => {
  const state = ViewletMenu.create()
  expect(state).toBeDefined()
})

test('setPosition', () => {
  const state = ViewletMenu.create()
  ViewletMenu.setPosition(state, 10, 20)
  expect(state.$Menu.style.left).toBe('10px')
  expect(state.$Menu.style.top).toBe('20px')
})

test('setItems', () => {
  const state = ViewletMenu.create()
  ViewletMenu.setItems(state, [
    {
      id: 'item-1', // TODO probably don't need id -> just use index
      label: 'item 1',
      flags: 0,
    },
    {
      label: '__Separator',
      flags: 1,
    },
    {
      id: 'item-2',
      label: 'item 2',
      flags: 2,
    },
    {
      id: 'item-3',
      label: 'item 3',
      flags: 3,
    },
  ])
  expect(getSimpleList(state.$Menu)).toEqual(['item 1', '', 'item 2', 'item 3'])
})
