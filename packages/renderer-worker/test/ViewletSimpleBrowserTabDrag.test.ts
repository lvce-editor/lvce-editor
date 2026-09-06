import { expect, test } from '@jest/globals'
import * as SimpleBrowser from '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'
import * as TabDrag from '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserTabDrag.js'

const createState = (): any => ({
  ...SimpleBrowser.create(7, 'simple-browser://', 100, 50, 800, 600),
  browserViewId: 2,
  inputValue: 'https://two.example',
  selectedTabIndex: 1,
  tabs: [
    { browserViewId: 1, title: 'One' },
    { browserViewId: 2, title: 'Two' },
    { browserViewId: 0, title: 'Three' },
    { browserViewId: 0, title: 'Four' },
  ],
})

const startDrag = async (state: any, index: number | string): Promise<any> =>
  TabDrag.handleTabDragStart(await TabDrag.stageTabDrag(state, index, 0))

test('reorders a background tab before the first tab and keeps the active page', async () => {
  const state = createState()
  const { inputValue } = state
  const started = await startDrag(state, '2')
  const over = TabDrag.handleTabDragOver(started, '0', 0, 100, 0, 110)
  expect(over.tabDropIndex).toBe(0)
  const result = TabDrag.handleTabDrop(over)
  expect(result.tabs.map((tab) => tab.title)).toEqual(['Three', 'One', 'Two', 'Four'])
  expect(result.selectedTabIndex).toBe(2)
  expect(result.browserViewId).toBe(2)
  expect(result.inputValue).toBe(inputValue)
  expect(result.draggedTab).toBeUndefined()
  expect(result.isDraggingTab).toBe(false)
  expect(result.tabDropIndex).toBe(-1)
  expect(SimpleBrowser.saveState(result).selectedTabIndex).toBe(2)
})

test('moves the selected tab to the end without recreating its content', async () => {
  const state = createState()
  const { tabs } = state
  const result = TabDrag.handleTabDrop(TabDrag.handleTabsDragOver(await startDrag(state, 1)))
  expect(result.tabs.map((tab) => tab.title)).toEqual(['One', 'Three', 'Four', 'Two'])
  expect(result.tabs[3]).toBe(tabs[1])
  expect(result.selectedTabIndex).toBe(3)
  expect(result.browserViewId).toBe(2)
})

test('uses viewport position and horizontal scrolling to choose the insertion side', async () => {
  const state = await startDrag(createState(), 0)
  expect(TabDrag.handleTabDragOver(state, 2, 200, 100, 100, 249).tabDropIndex).toBe(2)
  expect(TabDrag.handleTabDragOver(state, 2, 200, 100, 100, 250).tabDropIndex).toBe(3)
})

test('distinguishes two unloaded tabs with zero ids', async () => {
  const started = await startDrag(createState(), 2)
  const result = TabDrag.handleTabDrop(TabDrag.handleTabsDragOver(started))
  expect(result.tabs.map((tab) => tab.title)).toEqual(['One', 'Two', 'Four', 'Three'])
})

test('navigation updates during a drag preserve the source identity', async () => {
  const state = await startDrag(createState(), 0)
  const { tabs } = state
  const updated = { ...state, tabs: tabs.with(0, { ...tabs[0], title: 'Navigated' }) }
  const result = TabDrag.handleTabDrop(TabDrag.handleTabsDragOver(updated))
  expect(result.tabs.map((tab) => tab.title)).toEqual(['Two', 'Three', 'Four', 'Navigated'])
})

test('closing the source during a drag does not reorder another tab', async () => {
  const state = await startDrag(createState(), 0)
  const { tabs } = state
  const updated = { ...state, tabDropIndex: 3, tabs: tabs.slice(1) }
  expect(TabDrag.handleTabDrop(updated).tabs).toBe(updated.tabs)
})

test.each([1, 2])('dropping at either edge of the source preserves order (%s)', async (tabDropIndex) => {
  const state = await startDrag(createState(), 1)
  const { tabs } = state
  const result = TabDrag.handleTabDrop({ ...state, tabDropIndex })
  expect(result.tabs).toBe(tabs)
  expect(result.draggedTab).toBeUndefined()
})

test('ignores foreign drags, right click, and invalid tabs', async () => {
  const state = createState()
  const { tabs } = state
  expect(TabDrag.handleTabDragOver(state, 0, 0, 100, 0, 110)).toBe(state)
  expect(TabDrag.handleTabsDragOver(state)).toBe(state)
  const rightClick = await TabDrag.stageTabDrag(state, 0, 2)
  const invalidTab = await TabDrag.stageTabDrag(state, 'bad', 0)
  expect(rightClick.draggedTab).toBeUndefined()
  expect(invalidTab.draggedTab).toBeUndefined()
  const staged = await TabDrag.stageTabDrag(state, 0, 0)
  expect(TabDrag.handleTabDrop({ ...staged, tabDropIndex: 4 }).tabs).toBe(tabs)
})

test('leaving the tab strip clears the indicator and cancellation clears drag data', async () => {
  const state = TabDrag.handleTabsDragOver(await startDrag(createState(), 0))
  expect(TabDrag.handleTabDragLeave(state, 150, 60)).toBe(state)
  expect(TabDrag.handleTabDragLeave(state, 150, 100).tabDropIndex).toBe(-1)
  const reset = TabDrag.resetTabDrag(state)
  expect(reset.draggedTab).toBeUndefined()
  expect(TabDrag.renderDragData.apply(state, reset)).toEqual(['Viewlet.setDragData', 7, { items: [], label: 'New Tab' }])
})
