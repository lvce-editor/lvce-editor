/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as WheelEventType from '../src/parts/WheelEventType/WheelEventType.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'
import * as VirtualDomDiffType from '../src/parts/VirtualDomDiffType/VirtualDomDiffType.js'

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

const ViewletQuickPick = await import(
  '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
)

test('create', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.setValue(state, '>')
  // ViewletQuickPick.setPicks(state, [
  //   {
  //     posInSet: 1,
  //     setSize: 2,
  //     label: 'item 1',
  //   },
  //   {
  //     posInSet: 2,
  //     setSize: 2,
  //     label: 'item 2',
  //   },
  // ])
  expect(state.$QuickPick).toBeDefined()
  expect(state.$QuickPickInput.value).toBe('>')
  // const $QuickPickItemOne = state.$QuickPickItems.children[0]
  // const $QuickPickItemTwo = state.$QuickPickItems.children[1]
  // expect($QuickPickItemOne.textContent).toBe('item 1')
  // expect($QuickPickItemTwo.textContent).toBe('item 2')
})

// TODO move test to renderer worker
test.skip('setFocusedIndex', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.setPicks(state, [
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
  ViewletQuickPick.setFocusedIndex(state, 0, 1)
  const $QuickPickItemOne = state.$QuickPickItems.children[0]
  const $QuickPickItemTwo = state.$QuickPickItems.children[1]
  expect($QuickPickItemOne.id).toBe('')
  expect($QuickPickItemTwo.id).toBe('QuickPickItemActive')
})

// TODO move test to renderer worker
test.skip('setPicks - less picks', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.setPicks(state, [
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
  ViewletQuickPick.setPicks(state, [])
  expect(state.$QuickPickItems.children).toHaveLength(0)
})

// TODO move test to renderer worker
test.skip('setPicks - with icons', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 2,
      label: 'file-1.txt',
      icon: '_file',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'file-2.txt',
      icon: '_file',
    },
  ])
  const { $QuickPickItems } = state
  expect($QuickPickItems.children).toHaveLength(2)
  expect($QuickPickItems.children[0].innerHTML).toBe(
    '<i class="Icon_file"></i><div class="Label">file-1.txt</div>'
  )
})

test.skip('event - mousedown', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.setPicks(state, [
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

test.skip('event - mousedown - on focused item', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.setDom(state, [
    {
      type: VirtualDomDiffType.ElementsAdd,
      index: 0,
      newDom: [
        {
          type: VirtualDomElements.Div,
          props: {
            className: 'QuickPickItem',
          },
          childCount: 1,
        },
        {
          type: VirtualDomElements.Div,
          props: {
            className: 'QuickPickItemLabel',
          },
          childCount: 1,
        },
        {
          type: VirtualDomElements.Text,
          props: {
            text: 'item 1',
          },
          childCount: 0,
        },
      ],
    },
  ])
  console.log(state.$QuickPickItems.innerHTML)
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
  const state = ViewletQuickPick.create()
  ViewletQuickPick.setPicks(state, [
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
  const state = ViewletQuickPick.create()
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
  const state = ViewletQuickPick.create()
  expect(state.$QuickPick.ariaLabel).toBe('Quick open')
})

test('accessibility - QuickPickInput should have aria label', () => {
  const state = ViewletQuickPick.create()
  expect(state.$QuickPickInput.ariaLabel).toBe(
    'Type the name of a command to run.'
  )
})

test('event - wheel', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation((x) => {
    console.log(x)
  })
  const state = ViewletQuickPick.create()
  const event = new WheelEvent('wheel', {
    deltaY: 53,
    deltaMode: WheelEventType.DomDeltaLine,
  })
  const { $QuickPickItems } = state
  $QuickPickItems.dispatchEvent(event)
  // expect(RendererWorker.send).toHaveBeenCalledTimes(1) // TODO
  expect(RendererWorker.send).toHaveBeenCalledWith('QuickPick.handleWheel', 53)
})

test.skip('hideStatus', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.showNoResults(state)
  ViewletQuickPick.hideStatus(state)
  expect(state.$QuickPickStatus).toBeUndefined()
})
