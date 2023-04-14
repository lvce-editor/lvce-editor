/**
 * @jest-environment jsdom
 */
import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
import * as DomAttributeType from '../src/parts/DomAttributeType/DomAttributeType.js'

test('create', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.setValue(state, '>')
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
  expect(state.$QuickPick).toBeDefined()
  expect(state.$QuickPickInput.value).toBe('>')
  const $QuickPickItemOne = state.$QuickPickItems.children[0]
  const $QuickPickItemTwo = state.$QuickPickItems.children[1]
  expect($QuickPickItemOne.textContent).toBe('item 1')
  expect($QuickPickItemTwo.textContent).toBe('item 2')
})

test('setFocusedIndex', () => {
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

test('setPicks - less picks', () => {
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

test('setPicks - with icons', () => {
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
  expect($QuickPickItems.children[0].innerHTML).toBe('<i class="FileIcon_file"></i><div class="QuickPickLabel">file-1.txt</div>')
})

test('accessibility - QuickPick should have aria label', () => {
  const state = ViewletQuickPick.create()
  expect(state.$QuickPick.ariaLabel).toBe('Quick open')
})

test('accessibility - QuickPickInput should have aria label', () => {
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
  expect(state.$QuickPickInput.ariaLabel).toBe('Type the name of a command to run.')
})

test('accessibility - aria-activedescendant should point to quick pick item', () => {
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
  ViewletQuickPick.setFocusedIndex(state, -1, 0)
  expect(state.$QuickPickInput.getAttribute(DomAttributeType.AriaActiveDescendant)).toBe('QuickPickItemActive')
  // expect(state.$QuickPickItems.children[0].id).toBe('QuickPickItem-1')
})

test('hideStatus', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.showNoResults(state)
  ViewletQuickPick.hideStatus(state)
  expect(state.$QuickPickStatus).toBeUndefined()
})
