import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as ViewletSimpleBrowserRender from '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserRender.js'

const state = {
  browserViewId: 12,
  canGoBack: false,
  canGoForward: false,
  iframeSrc: 'https://example.com',
  inputValue: 'w',
  isLoading: false,
  selectedSuggestionIndex: -1,
  snapshot: '',
  suggestions: [],
  uid: 42,
}

test('does not rerender the native address input while typing', () => {
  const newState = {
    ...state,
    inputValue: 'wh',
  }

  expect(ViewletSimpleBrowserRender.render[0].isEqual(state, newState)).toBe(true)
})

test('renders the title through the parent title contract', () => {
  const oldState = { ...state, title: 'Simple Browser' }
  const newState = { ...state, title: 'Lvce Editor · GitHub' }

  expect(ViewletSimpleBrowserRender.renderTitle.isEqual(oldState, newState)).toBe(false)
  expect(ViewletSimpleBrowserRender.renderTitle.apply(oldState, newState)).toBe('Lvce Editor · GitHub')
  expect(ViewletSimpleBrowserRender.render).not.toContain(ViewletSimpleBrowserRender.renderTitle)
})

test('rerenders when suggestions change', () => {
  const newState = {
    ...state,
    suggestions: ['what is'],
  }

  expect(ViewletSimpleBrowserRender.render[0].isEqual(state, newState)).toBe(false)
})

test('updates inline completion when the input changes but suggestions stay the same', () => {
  const oldState = { ...state, inputValue: 'what is', suggestions: ['what is'] }
  const newState = { ...oldState, inputValue: 'what' }

  expect(ViewletSimpleBrowserRender.render[0].isEqual(oldState, newState)).toBe(false)
  const commands = ViewletSimpleBrowserRender.render[0].apply(oldState, newState)
  expect(commands[0][2]).not.toContainEqual(expect.objectContaining({ key: 'value' }))
})

test('rerenders when the audio indicator setting changes', () => {
  const oldState = {
    ...state,
    audioIndicatorEnabled: true,
  }
  const newState = {
    ...state,
    audioIndicatorEnabled: false,
  }

  expect(ViewletSimpleBrowserRender.render[0].isEqual(oldState, newState)).toBe(false)
})

test('rerenders when a tab is muted', () => {
  const oldState = {
    ...state,
    tabs: [{ browserViewId: 12, favicon: '', isAudioPlaying: true, muted: false, title: 'Example' }],
  }
  const newState = {
    ...state,
    tabs: [{ browserViewId: 12, favicon: '', isAudioPlaying: true, muted: true, title: 'Example' }],
  }

  expect(ViewletSimpleBrowserRender.render[0].isEqual(oldState, newState)).toBe(false)
})

test('renders suggestions incrementally without taking keyboard focus', () => {
  const newState = {
    ...state,
    suggestions: ['what is'],
  }

  const commands = ViewletSimpleBrowserRender.render[0].apply(state, newState)

  expect(commands[0].slice(0, 2)).toEqual(['Viewlet.setTreePatches', 42])
  expect(commands[0][2]).not.toHaveLength(0)
  expect(commands.some((command) => command[0] === 'Viewlet.focusElementByName')).toBe(false)
})

test('renders the initial dom in full', () => {
  const oldState = {
    ...state,
    browserViewId: 0,
  }

  const commands = ViewletSimpleBrowserRender.render[0].apply(oldState, state)

  expect(commands).toHaveLength(1)
  expect(commands[0].slice(0, 2)).toEqual(['Viewlet.setDom2', 42])
})

test('keeps the browser root when adding history suggestions without an inline completion', () => {
  const oldState = { ...state, iframeSrc: '', inputValue: 'example' }
  const newState = { ...oldState, suggestions: [{ value: 'https://example.com', favicon: '', type: 'url' }] }

  const commands = ViewletSimpleBrowserRender.render[0].apply(oldState, newState)

  expect(commands[0].slice(0, 2)).toEqual(['Viewlet.setTreePatches', 42])
  expect(commands[0][2]).toEqual([
    expect.objectContaining({ type: 6, nodes: expect.arrayContaining([expect.objectContaining({ className: 'SimpleBrowserSuggestions' })]) }),
  ])
})

test('does not focus the address input after suggestions close', () => {
  const oldState = {
    ...state,
    suggestions: ['what is'],
  }

  const commands = ViewletSimpleBrowserRender.render[0].apply(oldState, state)

  expect(commands).toHaveLength(1)
})

test('synchronizes the native address value when selecting another tab', () => {
  const oldState = { ...state, browserViewId: 12, inputValue: 'https://example.com' }
  const newState = { ...state, browserViewId: 13, inputValue: '' }

  expect(ViewletSimpleBrowserRender.render[1].isEqual(oldState, newState)).toBe(false)
  expect(ViewletSimpleBrowserRender.render[1].multiple).toBe(true)
  expect(ViewletSimpleBrowserRender.render[1].apply(oldState, newState)).toEqual([['Viewlet.setValueByName', 42, 'simple-browser-address', '']])
})

test('synchronizes the address after navigation in the current tab', () => {
  const newState = { ...state, iframeSrc: 'https://other.example', inputValue: 'https://other.example' }

  expect(ViewletSimpleBrowserRender.render[1].isEqual(state, newState)).toBe(false)
  expect(ViewletSimpleBrowserRender.render[1].apply(state, newState)).toEqual([
    ['Viewlet.setValueByName', 42, 'simple-browser-address', 'https://other.example'],
  ])
})

test('does not overwrite newer native typing when suggestions arrive', () => {
  const newState = { ...state, inputValue: 'wh', suggestions: ['what is'] }

  expect(ViewletSimpleBrowserRender.render[1].isEqual(state, newState)).toBe(true)
  const patches = ViewletSimpleBrowserRender.render[0].apply(state, newState)[0][2]
  expect(patches).not.toContainEqual(expect.objectContaining({ key: 'value' }))
})

test('synchronizes the address when navigating to the same URL again', () => {
  const newState = { ...state, addressValueVersion: 1 }

  expect(ViewletSimpleBrowserRender.render[1].isEqual(state, newState)).toBe(false)
})

test('focuses the address input for a new empty tab', () => {
  const oldState = { ...state, focusAddressVersion: 0 }
  const newState = { ...state, focusAddressVersion: 1 }

  expect(ViewletSimpleBrowserRender.render[2].isEqual(oldState, newState)).toBe(false)
  expect(ViewletSimpleBrowserRender.render[2].multiple).toBe(true)
  expect(ViewletSimpleBrowserRender.render[2].apply(oldState, newState)).toEqual([['Viewlet.focusElementByName', 42, 'simple-browser-address']])
})

test('adopts scoped css while a cached page preview is visible', () => {
  const pageSnapshot = {
    css: '.card { color: red; }',
    dom: [{ type: 4, className: 'card', childCount: 0 }],
  }
  const oldState = { ...state, selectedTabIndex: 0, tabs: [{ browserViewId: 12 }] }
  const newState = { ...oldState, tabs: [{ browserViewId: 18, pageSnapshot }] }

  expect(ViewletSimpleBrowserRender.render[3].isEqual(oldState, newState)).toBe(false)
  expect(ViewletSimpleBrowserRender.render[3].apply(oldState, newState)).toEqual([
    ['Css.addCssStyleSheet', 'simple-browser-preview-42', '.SimpleBrowserPreview {\n.card { color: red; }\n}'],
  ])
})

test('removes cached page css when the real page becomes visible', () => {
  const pageSnapshot = {
    css: '.card { color: red; }',
    dom: [{ type: 4, className: 'card', childCount: 0 }],
  }
  const oldState = { ...state, selectedTabIndex: 0, tabs: [{ browserViewId: 18, pageSnapshot }] }
  const newState = { ...oldState, tabs: [{ browserViewId: 18 }] }

  expect(ViewletSimpleBrowserRender.render[3].apply(oldState, newState)).toEqual([['Css.removeCssStyleSheet', 'simple-browser-preview-42']])
})

test('routes the browser menu button click with its bottom-edge coordinates', () => {
  expect(ViewletSimpleBrowserRender.renderEventListeners()).toContainEqual({
    name: 'handleClickSimpleBrowserMenu',
    params: [
      'showMenu',
      'event.clientX',
      'event.currentTarget.parentElement.offsetTop',
      'event.currentTarget.offsetTop',
      'event.currentTarget.offsetHeight',
    ],
  })
})

test.each([
  [DomEventListenerFunctions.HandleClickBackward, 'backward'],
  [DomEventListenerFunctions.HandleClickForward, 'forward'],
  [DomEventListenerFunctions.HandleClickReload, 'reload'],
])('routes %s to the %s command', (name, command) => {
  expect(ViewletSimpleBrowserRender.renderEventListeners()).toContainEqual({
    name,
    params: [command],
  })
})

test('routes address input changes to the simple browser state', () => {
  expect(ViewletSimpleBrowserRender.renderEventListeners()).toContainEqual({
    name: DomEventListenerFunctions.HandleInput,
    params: ['handleInput', 'event.target.value'],
  })
})

test('routes browser chrome focus with the focused element name', () => {
  expect(ViewletSimpleBrowserRender.renderEventListeners()).toContainEqual({
    name: DomEventListenerFunctions.HandleFocusInSimpleBrowser,
    params: ['handleFocusIn', 'event.target.name'],
  })
})

test('routes tab context-menu events with the tab index and pointer coordinates', () => {
  const listener = ViewletSimpleBrowserRender.renderEventListeners().find(
    (candidate) => candidate.name === DomEventListenerFunctions.HandleContextMenuSimpleBrowserTab,
  )

  expect(listener).toEqual({
    name: DomEventListenerFunctions.HandleContextMenuSimpleBrowserTab,
    params: ['handleTabContextMenu', 'event.currentTarget.dataset.index', 'event.clientX', 'event.clientY'],
  })
})

test('routes tab pointer events to show and hide the rich hover', () => {
  expect(ViewletSimpleBrowserRender.renderEventListeners()).toEqual(
    expect.arrayContaining([
      {
        name: DomEventListenerFunctions.HandlePointerOverSimpleBrowserTab,
        params: [
          'showTabHover',
          'event.currentTarget.dataset.index',
          'event.currentTarget.offsetLeft',
          'event.currentTarget.offsetWidth',
          'event.currentTarget.parentElement.scrollLeft',
        ],
      },
      {
        name: DomEventListenerFunctions.HandlePointerOutSimpleBrowserTab,
        params: ['hideTabHover', 'event.currentTarget.dataset.index', 'event.clientX', 'event.clientY'],
      },
      {
        name: DomEventListenerFunctions.HandlePointerDownSimpleBrowserTab,
        params: ['handleTabPointerDown', 'event.currentTarget.dataset.index', 'event.button'],
      },
    ]),
  )
})

test('routes audio button clicks to mute the tab without selecting it', () => {
  expect(ViewletSimpleBrowserRender.renderEventListeners()).toContainEqual({
    name: DomEventListenerFunctions.HandleClickSimpleBrowserTabAudio,
    params: ['muteTab', 'event.currentTarget.dataset.index'],
    stopPropagation: true,
  })
})

test('tab action pointer presses dismiss the hover without selecting the tab', () => {
  expect(ViewletSimpleBrowserRender.renderEventListeners()).toContainEqual({
    name: DomEventListenerFunctions.HandlePointerDownSimpleBrowserTabAction,
    params: ['hideTabHover'],
    stopPropagation: true,
  })
})
