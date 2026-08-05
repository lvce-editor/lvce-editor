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
      { icon: 'Terminal', label: 'tab 1', uid: 41 },
      { icon: 'Terminal', label: 'tab 2', uid: 42 },
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
      className: 'TerminalTab TerminalTabSelected',
      onClick: DomEventListenerFunctions.HandleClickTab,
    }),
  )
})
