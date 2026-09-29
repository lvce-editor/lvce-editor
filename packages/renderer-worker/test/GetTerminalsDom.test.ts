import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetTerminalsDom from '../src/parts/GetTerminalsDom/GetTerminalsDom.js'
import * as MergeClassNames from '../src/parts/MergeClassNames/MergeClassNames.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('renders split terminals in order and forwards terminal presses', () => {
  const dom = GetTerminalsDom.getTerminalsDom({
    childUids: [41, 42],
    height: 400,
    selectedIndex: 0,
    tabs: [{ label: 'tab 1', uid: 41 }],
    tabsWidth: 90,
    terminalTabsEnabled: false,
    width: 800,
    y: 20,
  })

  expect(dom).toEqual([
    {
      'data-uid': undefined,
      onDragOver: 'handleDragOver',
      onDrop: 'handleDrop',
      childCount: 2,
      className: MergeClassNames.mergeClassNames('Viewlet', 'Terminals'),
      onMouseDown: DomEventListenerFunctions.HandleMouseDown,
      type: VirtualDomElements.Div,
    },
    {
      type: VirtualDomElements.Reference,
      uid: 41,
    },
    {
      type: VirtualDomElements.Reference,
      uid: 42,
    },
  ])
})

test('renders terminal tabs with switch commands', () => {
  const dom = GetTerminalsDom.getTerminalsDom({
    childUids: [42],
    height: 400,
    selectedIndex: 1,
    tabs: [
      { icon: 'terminal-bash', label: 'bash', uid: 41 },
      { icon: 'terminal-bash', label: 'bash', uid: 42 },
    ],
    tabsWidth: 90,
    terminalTabsEnabled: true,
    width: 800,
    y: 20,
  })

  expect(dom).toContainEqual(
    expect.objectContaining({
      'data-index': 0,
      className: 'TerminalTab',
      onClick: DomEventListenerFunctions.HandleClickTab,
    }),
  )
  expect(dom).toContainEqual(
    expect.objectContaining({
      'data-index': 1,
      className: 'TerminalTab TerminalTabSelected TerminalTabGroupStart',
      onClick: DomEventListenerFunctions.HandleClickTab,
    }),
  )
  expect(dom).toContainEqual(
    expect.objectContaining({
      'data-command': 'killTerminalTab',
      'data-index': 0,
      className: 'TerminalTabKill',
      onClick: DomEventListenerFunctions.HandleClickTerminalTabAction,
    }),
  )
  expect(dom).toContainEqual(
    expect.objectContaining({
      className: 'TerminalTabIcon',
      maskImage: '/icons/terminal-bash.svg',
    }),
  )
})

test('renders split terminal tabs as connected rows and selects the focused split', () => {
  const dom = GetTerminalsDom.getTerminalsDom({
    activeTerminalUids: [42, 44],
    childUids: [41, 42, 43],
    height: 400,
    selectedIndex: 0,
    tabs: [
      { icon: 'terminal-bash', label: 'bash', terminalUids: [41, 42, 43], uid: 41 },
      { icon: 'terminal-bash', label: 'bash', terminalUids: [44], uid: 44 },
    ],
    tabsWidth: 90,
    terminalTabsEnabled: true,
    width: 800,
    y: 20,
  })

  const rows = dom.filter((entry) => (entry.className === 'TerminalTab' || entry.className?.startsWith('TerminalTab ')) && 'data-index' in entry)
  expect(rows).toEqual([
    expect.objectContaining({
      className: 'TerminalTab TerminalTabSplit TerminalTabSplitFirst',
      'data-index': 0,
      'data-terminalUid': 41,
    }),
    expect.objectContaining({
      className: 'TerminalTab TerminalTabSelected TerminalTabSplit TerminalTabSplitMiddle',
      'data-index': 0,
      'data-terminalUid': 42,
    }),
    expect.objectContaining({
      className: 'TerminalTab TerminalTabSplit TerminalTabSplitLast',
      'data-index': 0,
      'data-terminalUid': 43,
    }),
    expect.objectContaining({
      className: 'TerminalTab TerminalTabGroupStart',
      'data-index': 1,
      'data-terminalUid': 44,
    }),
  ])
})

test('shows terminal tabs for a single split group', () => {
  const dom = GetTerminalsDom.getTerminalsDom({
    activeTerminalUids: [42],
    childUids: [41, 42],
    height: 400,
    selectedIndex: 0,
    tabs: [{ icon: 'terminal-bash', label: 'bash', terminalUids: [41, 42], uid: 41 }],
    tabsWidth: 90,
    terminalTabsEnabled: true,
    width: 800,
    y: 20,
  })

  expect(dom[0]).toMatchObject({ childCount: 3 })
  expect(dom).toContainEqual(expect.objectContaining({ className: 'TerminalTab TerminalTabSplit TerminalTabSplitFirst' }))
  expect(dom).toContainEqual(expect.objectContaining({ className: 'TerminalTab TerminalTabSelected TerminalTabSplit TerminalTabSplitLast' }))
})

test('shows a draggable terminal tab for a single terminal', () => {
  const dom = GetTerminalsDom.getTerminalsDom({
    childUids: [41],
    height: 400,
    selectedIndex: 0,
    tabs: [{ icon: 'terminal-bash', label: 'bash', uid: 41 }],
    tabsWidth: 90,
    terminalTabsEnabled: true,
    width: 800,
    y: 20,
  })

  expect(dom[0]).toMatchObject({ childCount: 2, onDrop: 'handleDrop', onDragOver: 'handleDragOver' })
  expect(dom).toContainEqual(expect.objectContaining({ className: 'TerminalTab TerminalTabSelected', draggable: true }))
  expect(dom).toContainEqual({ type: VirtualDomElements.Reference, uid: 41 })
})
