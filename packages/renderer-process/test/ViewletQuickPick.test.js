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

const QuickPick = await import(
  '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
)

test('create', () => {
  const state = QuickPick.create('>')
  QuickPick.setValue(state, '>')
  QuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  expect(state.$QuickPick).toBeDefined()
  expect(state.$QuickPickInput.value).toBe('>')
  const $QuickPickItemOne = state.$QuickPickItems.children[0]
  const $QuickPickItemTwo = state.$QuickPickItems.children[1]
  expect($QuickPickItemOne.textContent).toBe('item 1')
  expect($QuickPickItemTwo.textContent).toBe('item 2')
})

test('focusIndex', () => {
  const state = QuickPick.create('>')
  QuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  QuickPick.focusIndex(state, 0, 1)
  const $QuickPickItemOne = state.$QuickPickItems.children[0]
  const $QuickPickItemTwo = state.$QuickPickItems.children[1]
  expect($QuickPickItemOne.classList.contains('Focused')).toBe(false)
  expect($QuickPickItemTwo.classList.contains('Focused')).toBe(true)
})

test('setPicks - less picks', () => {
  const state = QuickPick.create('>')
  QuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  QuickPick.setPicks(state, [])
  expect(state.$QuickPickItems.children).toHaveLength(0)
})

test.skip('event - mousedown', () => {
  const state = QuickPick.create('>')
  QuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  const $QuickPickItemTwo = state.$QuickPickItems.children[1]
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  $QuickPickItemTwo.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(['QuickPick.selectIndex', 1])
})

test('event - mousedown - on focused item', () => {
  const state = QuickPick.create('>')
  QuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 1,
      label: 'item 1',
    },
  ])
  QuickPick.setFocusedIndex(state, 0, -1)
  const $QuickPickItemOne = state.$QuickPickItems.children[0]
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  $QuickPickItemOne.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    })
  )
  // expect(RendererWorker.send).toHaveBeenCalledTimes(1) // TODO
  expect(RendererWorker.send).toHaveBeenCalledWith('QuickPick.selectIndex', 0)
})

test.skip('event - beforeinput', () => {
  const state = QuickPick.create('>')
  QuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  const $QuickPickInput = state.$QuickPickInput
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  $QuickPickInput.dispatchEvent(
    new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      data: 'a',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    'QuickPick.handleInput',
    '>a',
  ])
})

test('event - input', () => {
  const state = QuickPick.create('>', [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  const $QuickPickInput = state.$QuickPickInput
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  $QuickPickInput.value = '>a'
  const event = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
  })
  $QuickPickInput.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'QuickPick.handleInput',
    '>a'
  )
})

test('accessibility - QuickPick should have aria label', () => {
  const state = QuickPick.create('>', [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  expect(state.$QuickPick.ariaLabel).toBe('Quick open')
})

test('accessibility - QuickPickInput should have aria label', () => {
  const state = QuickPick.create('>')
  QuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  expect(state.$QuickPickInput.ariaLabel).toBe(
    'Type the name of a command to run.'
  )
})

test('accessibility - aria-activedescendant should point to quick pick item', () => {
  const state = QuickPick.create('>')
  QuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  expect(state.$QuickPickInput.getAttribute('aria-activedescendant')).toBe(
    'QuickPickItem-1'
  )
  expect(state.$QuickPickItems.children[0].id).toBe('QuickPickItem-1')
})

test('event - wheel', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation((x) => {
    console.log(x)
  })
  const state = QuickPick.create('>')
  const event = new WheelEvent('wheel', {
    deltaY: 53,
    deltaMode: WheelEvent.DOM_DELTA_LINE,
  })
  const { $QuickPickItems } = state
  $QuickPickItems.dispatchEvent(event)
  // expect(RendererWorker.send).toHaveBeenCalledTimes(1) // TODO
  expect(RendererWorker.send).toHaveBeenCalledWith('QuickPick.handleWheel', 53)
})
