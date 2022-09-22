import * as ViewletManager from '../src/parts/ViewletManager/ViewletManager.js'
import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
import * as VirtualDomDiffType from '../src/parts/VirtualDomDiffType/VirtualDomDiffType.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletQuickPick, oldState, newState)
}

test('render - add one item', () => {
  const oldState = {
    ...ViewletQuickPick.create(),
    minLineY: 0,
    maxLineY: 10,
  }
  const newState = {
    ...oldState,
    items: [
      {
        label: 'item 1',
      },
    ],
  }
  const changes = render(oldState, newState)
  expect(changes).toEqual([
    [
      'Viewlet.send',
      'QuickPick',
      'setDom',
      [
        {
          index: 0,
          newDom: [
            {
              childCount: 1,
              props: {
                ariaPosInSet: 1,
                ariaSetSize: 1,
                className: 'QuickPickItem',
                role: 'option',
              },
              type: VirtualDomElements.Div,
            },
            {
              childCount: 1,
              props: {
                className: 'Label',
              },
              type: VirtualDomElements.Div,
            },
            {
              childCount: 0,
              props: {
                text: 'item 1',
              },
              type: VirtualDomElements.Text,
            },
          ],
          operation: 5,
        },
      ],
    ],
    ['Viewlet.send', 'QuickPick', 'setValue', undefined],
  ])
})

test('render - remove one item and keep one', () => {
  const oldState = {
    ...ViewletQuickPick.create(),
    minLineY: 0,
    maxLineY: 10,
    items: [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
    ],
  }
  const newState = {
    ...oldState,
    items: [
      {
        label: 'item 1',
      },
    ],
  }
  const changes = render(oldState, newState)
  expect(changes).toEqual([
    [
      'Viewlet.send',
      'QuickPick',
      'setDom',
      [
        {
          index: 0,
          operation: VirtualDomDiffType.ElementsRemove,
          keepCount: 1,
        },
      ],
    ],
    ['Viewlet.send', 'QuickPick', 'setValue', undefined],
  ])
})

test('render - change label of one element', () => {
  const oldState = {
    ...ViewletQuickPick.create(),
    items: [
      {
        label: 'item 1',
      },
    ],
    minLineY: 0,
    maxLineY: 10,
  }
  const newState = {
    ...oldState,
    items: [
      {
        label: 'item 2',
      },
    ],
  }

  const changes = render(oldState, newState)
  expect(changes).toEqual([
    [
      'Viewlet.send',
      'QuickPick',
      'setDom',
      [
        {
          index: 1,
          key: 'text',
          operation: VirtualDomDiffType.AttributeSet,
          value: 'item 2',
        },
      ],
    ],
    ['Viewlet.send', 'QuickPick', 'setValue', undefined],
  ])
})

test('render - change icon of one element', () => {
  const oldState = {
    ...ViewletQuickPick.create(),
    items: [
      {
        label: 'item 1',
        icon: 'f_css',
      },
    ],
    minLineY: 0,
    maxLineY: 10,
  }
  const newState = {
    ...oldState,
    items: [
      {
        label: 'item 1',
        icon: 'f_html',
      },
    ],
  }

  const changes = render(oldState, newState)
  expect(changes).toEqual([
    [
      'Viewlet.send',
      'QuickPick',
      'setDom',
      [
        {
          index: 1,
          operation: VirtualDomDiffType.AttributeSet,
          key: 'src',
          value: 'f_html',
        },
      ],
    ],
    ['Viewlet.send', 'QuickPick', 'setValue', undefined],
  ])
})

test('render - remove icon of one element', () => {
  const oldState = {
    ...ViewletQuickPick.create(),
    items: [
      {
        label: 'item 1',
        icon: 'f_css',
      },
    ],
    minLineY: 0,
    maxLineY: 10,
  }
  const newState = {
    ...oldState,
    items: [
      {
        label: 'item 1',
      },
    ],
  }

  const changes = render(oldState, newState)
  expect(changes).toEqual([
    [
      'Viewlet.send',
      'QuickPick',
      'setDom',
      [
        {
          index: 1,
          operation: VirtualDomDiffType.ElementRemove,
        },
      ],
    ],
    ['Viewlet.send', 'QuickPick', 'setValue', undefined],
  ])
})
