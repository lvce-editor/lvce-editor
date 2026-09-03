import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js', () => {
  return {
    capturePage: jest.fn(() => {
      throw new Error('not implemented')
    }),
    hide: jest.fn(() => {
      throw new Error('not implemented')
    }),
    insertJavaScript: jest.fn(() => {
      throw new Error('not implemented')
    }),
    reload: jest.fn(() => {
      throw new Error('not implemented')
    }),
    setAudioMuted: jest.fn(() => {
      throw new Error('not implemented')
    }),
    toggleDevtools: jest.fn(() => {
      throw new Error('not implemented')
    }),
    forward: jest.fn(() => {
      throw new Error('not implemented')
    }),
    focus: jest.fn(() => {
      throw new Error('not implemented')
    }),
    backward: jest.fn(() => {
      throw new Error('not implemented')
    }),
    setIframeSrc: jest.fn(() => {
      throw new Error('not implemented')
    }),
    resizeWebContentsView: jest.fn(() => {
      throw new Error('not implemented')
    }),
    setFallthroughKeyBindings: jest.fn(() => {
      throw new Error('not implemented')
    }),
    show: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getStats: jest.fn(),
  }
})
jest.unstable_mockModule('../src/parts/ElectronWebContentsView/ElectronWebContentsView.js', () => {
  return {
    createWebContentsView: jest.fn(() => {
      return 1
    }),
    disposeWebContentsView: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/ElectronWindow/ElectronWindow.js', () => ({
  focus: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Focus/Focus.js', () => ({
  setFocus: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/KeyBindingsInitial/KeyBindingsInitial.js', () => {
  return {
    getKeyBindings() {
      return []
    },
  }
})

jest.unstable_mockModule('../src/parts/BrowserSearchSuggestions/BrowserSearchSuggestions.js', () => ({
  get: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/BrowserVisitedSites/BrowserVisitedSites.js', () => ({
  add: jest.fn(),
  getSuggestions: jest.fn(),
  load: jest.fn(),
  save: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/SimpleBrowserSnapshot/SimpleBrowserSnapshot.js', () => ({
  create: jest.fn(),
  dispose: jest.fn(),
}))

const ViewletSimpleBrowser = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js')
const ViewletSimpleBrowserOpenBackgroundTab = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserOpenBackgroundTab.js')
const ViewletSimpleBrowserResize = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserResize.js')
const BrowserSearchSuggestions = await import('../src/parts/BrowserSearchSuggestions/BrowserSearchSuggestions.js')
const BrowserVisitedSites = await import('../src/parts/BrowserVisitedSites/BrowserVisitedSites.js')
const Command = await import('../src/parts/Command/Command.js')
const ColorTheme = await import('../src/parts/ColorTheme/ColorTheme.js')
const ElectronWebContentsViewFunctions = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')
const ElectronWebContentsView = await import('../src/parts/ElectronWebContentsView/ElectronWebContentsView.js')
const ElectronWindow = await import('../src/parts/ElectronWindow/ElectronWindow.js')
const Focus = await import('../src/parts/Focus/Focus.js')
const InputName = await import('../src/parts/InputName/InputName.js')
const KeyCode = await import('../src/parts/KeyCode/KeyCode.js')
const KeyModifier = await import('../src/parts/KeyModifier/KeyModifier.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SimpleBrowserNewTabPage = await import('../src/parts/SimpleBrowserNewTabPage/SimpleBrowserNewTabPage.js')
const SimpleBrowserSnapshot = await import('../src/parts/SimpleBrowserSnapshot/SimpleBrowserSnapshot.js')
const ViewletModuleId = await import('../src/parts/ViewletModuleId/ViewletModuleId.js')
const WhenExpression = await import('../src/parts/WhenExpression/WhenExpression.js')

beforeEach(() => {
  ColorTheme.state.colorThemeCss = ''
  // @ts-ignore
  BrowserVisitedSites.add.mockImplementation((sites) => sites)
  // @ts-ignore
  BrowserVisitedSites.getSuggestions.mockReturnValue([])
  // @ts-ignore
  BrowserVisitedSites.load.mockResolvedValue([])
  // @ts-ignore
  ElectronWebContentsViewFunctions.getStats.mockResolvedValue({
    title: 'test',
    url: '',
    canGoBack: true,
    canGoForward: true,
  })
})

const browserTabKeyBindings = [
  KeyModifier.CtrlCmd | KeyCode.KeyW,
  KeyModifier.CtrlCmd | KeyCode.KeyT,
  KeyModifier.CtrlCmd | KeyCode.Tab,
  KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Tab,
]

const createTabsState = (selectedTabIndex = 0) => {
  const tabs = [
    {
      browserViewId: 12,
      canGoBack: false,
      canGoForward: false,
      favicon: '',
      iframeSrc: 'https://one.example',
      inputValue: 'https://one.example',
      isAudioPlaying: false,
      isLoading: false,
      muted: false,
      title: 'One',
    },
    {
      browserViewId: 13,
      canGoBack: true,
      canGoForward: false,
      favicon: '',
      iframeSrc: 'https://two.example',
      inputValue: 'https://two.example',
      isAudioPlaying: false,
      isLoading: false,
      muted: false,
      title: 'Two',
    },
    {
      browserViewId: 14,
      canGoBack: false,
      canGoForward: false,
      favicon: '',
      iframeSrc: 'https://three.example',
      inputValue: 'https://three.example',
      isAudioPlaying: false,
      isLoading: false,
      muted: false,
      title: 'Three',
    },
    {
      browserViewId: 15,
      canGoBack: false,
      canGoForward: false,
      favicon: '',
      iframeSrc: 'https://four.example',
      inputValue: 'https://four.example',
      isAudioPlaying: false,
      isLoading: false,
      muted: false,
      title: 'Four',
    },
  ]
  const selectedTab = tabs[selectedTabIndex]
  return {
    ...ViewletSimpleBrowser.create(),
    browserViewId: selectedTab.browserViewId,
    iframeSrc: selectedTab.iframeSrc,
    inputValue: selectedTab.inputValue,
    isAudioPlaying: selectedTab.isAudioPlaying,
    isLoading: selectedTab.isLoading,
    muted: selectedTab.muted,
    selectedTabIndex,
    tabs,
    title: selectedTab.title,
  }
}

const createTwoTabState = () => {
  const state = createTabsState()
  return {
    ...state,
    tabs: state.tabs.slice(0, 2),
  }
}

test('create', () => {
  const state = ViewletSimpleBrowser.create()
  expect(state).toBeDefined()
})

test('saveState preserves all browser tabs and the selected tab', () => {
  const state = createTabsState(1)

  expect(ViewletSimpleBrowser.saveState(state)).toEqual({
    iframeSrc: 'https://two.example',
    selectedTabIndex: 1,
    tabs: [
      { favicon: '', iframeSrc: 'https://one.example', inputValue: 'https://one.example', title: 'One' },
      { favicon: '', iframeSrc: 'https://two.example', inputValue: 'https://two.example', title: 'Two' },
      { favicon: '', iframeSrc: 'https://three.example', inputValue: 'https://three.example', title: 'Three' },
      { favicon: '', iframeSrc: 'https://four.example', inputValue: 'https://four.example', title: 'Four' },
    ],
  })
})

test('uses the URL input focus context for the address field', () => {
  const state = ViewletSimpleBrowser.create(42)

  const newState = ViewletSimpleBrowser.handleFocusIn(state, InputName.SimpleBrowserAddress)

  expect(newState).toBe(state)
  expect(Focus.setFocus).toHaveBeenCalledWith(WhenExpression.FocusSimpleBrowserInput, undefined, 42, ViewletModuleId.SimpleBrowser)
})

test('uses the browser focus context for tabs and toolbar controls', () => {
  const state = ViewletSimpleBrowser.create(42)

  const newState = ViewletSimpleBrowser.handleFocusIn(state, '')

  expect(newState).toBe(state)
  expect(Focus.setFocus).toHaveBeenCalledWith(WhenExpression.FocusSimpleBrowser, undefined, 42, ViewletModuleId.SimpleBrowser)
})

test('loadContent', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockImplementation(() => {
    return 1
  })
  // @ts-ignore
  // ElectronWebContentsViewFunctions.resizeBrowserView.mockImplementation(() => {})
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://', 0, 0, 0, 0)
  expect(await ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    audioIndicatorEnabled: true,
    headerHeight: 65,
    iframeSrc: 'https://example.com',
    tabHoverEnabled: false,
    tabsEnabled: true,
    unloadTabs: false,
  })
})

test('loadContent enables tab hovers through simpleBrowser.tabHover.enabled', async () => {
  Preferences.state['simpleBrowser.tabHover.enabled'] = true
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(1)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://', 0, 0, 300, 200)

  const newState = await ViewletSimpleBrowser.loadContent(state)

  expect(newState).toMatchObject({ tabHoverEnabled: true })
  delete Preferences.state['simpleBrowser.tabHover.enabled']
})

test('loadContent disables the audio indicator through simpleBrowser.audioIndicator.enabled', async () => {
  Preferences.state['simpleBrowser.audioIndicator.enabled'] = false
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(1)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://', 0, 0, 300, 200)

  const newState = await ViewletSimpleBrowser.loadContent(state)

  expect(newState).toMatchObject({ audioIndicatorEnabled: false })
  delete Preferences.state['simpleBrowser.audioIndicator.enabled']
})

test('loadContent disables the tab strip through simpleBrowser.tabs.enabled', async () => {
  Preferences.state['simpleBrowser.tabs.enabled'] = false
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(1)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://', 0, 0, 300, 200)

  const newState = await ViewletSimpleBrowser.loadContent(state)

  expect(newState).toMatchObject({ headerHeight: 30, tabsEnabled: false })
  expect(newState.tabs).toHaveLength(1)
  delete Preferences.state['simpleBrowser.tabs.enabled']
})

test('loadContent enables inactive tab unloading through simpleBrowser.unloadTabs', async () => {
  Preferences.state['simpleBrowser.unloadTabs'] = true
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(1)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://', 0, 0, 300, 200)

  const newState = await ViewletSimpleBrowser.loadContent(state)

  expect(newState).toMatchObject({ unloadTabs: true })
  delete Preferences.state['simpleBrowser.unloadTabs']
})

test('loadContent - restore id - same browser view', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockImplementation(() => {
    return 1
  })
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://1', 0, 0, 0, 0)
  expect(await ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    iframeSrc: 'https://example.com',
  })
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledWith(1, 0)
  expect(ElectronWebContentsViewFunctions.setFallthroughKeyBindings).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.setFallthroughKeyBindings).toHaveBeenCalledWith(1, browserTabKeyBindings)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).not.toHaveBeenCalled()
})

test('loadContent - restore id - browser view does not exist yet', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockImplementation(() => {
    return 2
  })
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockImplementation(() => {})
  const state = ViewletSimpleBrowser.create(0, 'simple-browser://1', 0, 0, 0, 0)
  expect(await ViewletSimpleBrowser.loadContent(state)).toMatchObject({
    iframeSrc: 'https://example.com',
  })
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledWith(1, 0)
  expect(ElectronWebContentsViewFunctions.setFallthroughKeyBindings).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.setFallthroughKeyBindings).toHaveBeenCalledWith(2, browserTabKeyBindings)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(2, 'https://example.com')
})

test('loadContent restores every tab but creates a web contents view only for the selected tab', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(17)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.getStats.mockResolvedValue({ canGoBack: false, canGoForward: false, title: '' })
  const state = ViewletSimpleBrowser.create(7, 'simple-browser://12', 10, 20, 300, 200)
  const savedState = {
    iframeSrc: 'https://two.example',
    selectedTabIndex: 1,
    tabs: [
      { favicon: 'https://one.example/favicon.ico', iframeSrc: 'https://one.example', inputValue: 'one.example', title: 'One' },
      { favicon: 'https://two.example/favicon.ico', iframeSrc: 'https://two.example', inputValue: 'two.example', title: 'Two' },
      { favicon: '', iframeSrc: 'https://three.example', inputValue: 'three.example', title: 'Three' },
    ],
  }

  const newState = await ViewletSimpleBrowser.loadContent(state, savedState)

  expect(newState).toMatchObject({
    browserViewId: 17,
    iframeSrc: 'https://two.example',
    inputValue: 'two.example',
    selectedTabIndex: 1,
    title: 'Two',
  })
  expect(newState.tabs).toMatchObject([
    { browserViewId: 0, iframeSrc: 'https://one.example', title: 'One' },
    { browserViewId: 17, iframeSrc: 'https://two.example', title: 'Two' },
    { browserViewId: 0, iframeSrc: 'https://three.example', title: 'Three' },
  ])
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledWith(12, 7)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(17, 'https://two.example')
})

test('handleTitleUpdated', async () => {
  const state = ViewletSimpleBrowser.create()
  expect(await ViewletSimpleBrowser.handleTitleUpdated(state, 'new Title')).toMatchObject({
    title: 'new Title',
  })
})

test('creates and selects an empty tab while keeping the original view alive', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(13)
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7, '', 10, 20, 300, 200),
    browserViewId: 12,
    tabs: [
      {
        browserViewId: 12,
        canGoBack: false,
        canGoForward: false,
        favicon: 'https://example.com/favicon.png',
        iframeSrc: 'https://example.com',
        inputValue: 'https://example.com',
        isLoading: false,
        title: 'Example',
      },
    ],
  }

  const newState = await ViewletSimpleBrowser.createNewTab(state)

  expect(newState).toMatchObject({ browserViewId: 13, inputValue: '', selectedTabIndex: 1, title: 'New Tab' })
  expect(newState.tabs).toHaveLength(2)
  expect(ElectronWebContentsView.disposeWebContentsView).not.toHaveBeenCalled()
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(12)
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(13)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(13, SimpleBrowserNewTabPage.getUrl())
  expect(ElectronWindow.focus).toHaveBeenCalledTimes(1)
})

test('updates open new tab pages when the color theme changes', async () => {
  ColorTheme.state.colorThemeCss = ':root { --EditorBackground: #193549; --InputBoxBackground: #15232d; }'
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  const state = createTwoTabState()
  state.tabs[0].iframeSrc = ''

  const newState = await ViewletSimpleBrowser.handleColorThemeChanged(state)

  expect(newState).toBe(state)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(12, SimpleBrowserNewTabPage.getUrl())
})

test('opens a target blank link in a new selected tab by default', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(13)
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7, '', 10, 20, 300, 200),
    browserViewId: 12,
    tabs: [{ browserViewId: 12, iframeSrc: 'https://example.com', inputValue: 'https://example.com', title: 'Example' }],
  }

  const newState = await ViewletSimpleBrowser.handleWindowOpen(state, 12, 'https://example.com/docs', 'foreground-tab')

  expect(newState).toMatchObject({ browserViewId: 13, iframeSrc: 'https://example.com/docs', selectedTabIndex: 1 })
  expect(newState.tabs).toHaveLength(2)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(13, 'https://example.com/docs')
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(12)
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(13)
  expect(ElectronWebContentsViewFunctions.focus).toHaveBeenCalledWith(13)
})

test('keeps a target blank background tab hidden', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(13)
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7, '', 10, 20, 300, 200),
    browserViewId: 12,
    tabs: [{ browserViewId: 12, iframeSrc: 'https://example.com', inputValue: 'https://example.com', title: 'Example' }],
  }

  const newState = await ViewletSimpleBrowser.handleWindowOpen(state, 12, 'https://example.com/docs', 'background-tab')

  expect(newState).toMatchObject({ browserViewId: 12, selectedTabIndex: 0 })
  expect(newState.tabs).toHaveLength(2)
  expect(ElectronWebContentsViewFunctions.show).not.toHaveBeenCalled()
})

test('keeps a new background tab unloaded when tab unloading is enabled', async () => {
  const state = {
    ...ViewletSimpleBrowser.create(7, '', 10, 20, 300, 200),
    browserViewId: 12,
    tabs: [{ browserViewId: 12, iframeSrc: 'https://example.com', inputValue: 'https://example.com', title: 'Example' }],
    unloadTabs: true,
  }

  const newState = await ViewletSimpleBrowser.handleWindowOpen(state, 12, 'https://example.com/docs', 'background-tab')

  expect(newState.tabs[1]).toMatchObject({ browserViewId: 0, iframeSrc: 'https://example.com/docs', isLoading: false })
  expect(ElectronWebContentsView.createWebContentsView).not.toHaveBeenCalled()
  expect(ElectronWebContentsViewFunctions.setIframeSrc).not.toHaveBeenCalled()
})

test('opens a context menu link in a new background web contents view', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(13)
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7, '', 10, 20, 300, 200),
    browserViewId: 12,
    tabs: [{ browserViewId: 12, iframeSrc: 'https://example.com', inputValue: 'https://example.com', title: 'Example' }],
  }

  const newState = await ViewletSimpleBrowserOpenBackgroundTab.openBackgroundTab(state, 'https://example.com/docs')

  expect(newState).toMatchObject({ browserViewId: 12, selectedTabIndex: 0 })
  expect(newState.tabs).toHaveLength(2)
  expect(newState.tabs[1]).toMatchObject({ browserViewId: 13, iframeSrc: 'https://example.com/docs' })
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(13, 'https://example.com/docs')
  expect(ElectronWebContentsViewFunctions.show).not.toHaveBeenCalled()
})

test('opens a target blank link in the system browser when configured', async () => {
  Preferences.state['simpleBrowser.openExternalLinks'] = 'externalBrowser'
  const state = {
    ...ViewletSimpleBrowser.create(),
    browserViewId: 12,
    tabs: [{ browserViewId: 12 }],
  }

  const newState = await ViewletSimpleBrowser.handleWindowOpen(state, 12, 'https://example.com/docs', 'foreground-tab')

  expect(newState).toBe(state)
  expect(Command.execute).toHaveBeenCalledWith('Open.openExternal', 'https://example.com/docs')
  delete Preferences.state['simpleBrowser.openExternalLinks']
})

test('ignores a target blank event from another simple browser instance', async () => {
  const state = {
    ...ViewletSimpleBrowser.create(),
    browserViewId: 12,
    tabs: [{ browserViewId: 12 }],
  }

  const newState = await ViewletSimpleBrowser.handleWindowOpen(state, 99, 'https://example.com/docs', 'foreground-tab')

  expect(newState).toBe(state)
  expect(ElectronWebContentsView.createWebContentsView).not.toHaveBeenCalled()
  expect(Command.execute).not.toHaveBeenCalled()
})

test('switches tabs by showing the selected view before hiding the previous active view', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(),
    browserViewId: 12,
    tabs: [
      {
        browserViewId: 12,
        canGoBack: false,
        canGoForward: false,
        favicon: '',
        iframeSrc: 'https://one.example',
        inputValue: 'https://one.example',
        isLoading: false,
        title: 'One',
        zoomLevel: 0,
      },
      {
        browserViewId: 13,
        canGoBack: true,
        canGoForward: false,
        favicon: '',
        iframeSrc: 'https://two.example',
        inputValue: 'https://two.example',
        isLoading: false,
        title: 'Two',
        zoomLevel: 1,
      },
    ],
  }

  const newState = await ViewletSimpleBrowser.selectTab(state, '1')

  expect(newState).toMatchObject({
    browserViewId: 13,
    canGoBack: true,
    inputValue: 'https://two.example',
    selectedTabIndex: 1,
    title: 'Two',
    zoomLevel: 1,
  })
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(12)
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(13)
  // @ts-ignore
  const showCallOrder = ElectronWebContentsViewFunctions.show.mock.invocationCallOrder[0]
  // @ts-ignore
  const hideCallOrder = ElectronWebContentsViewFunctions.hide.mock.invocationCallOrder[0]
  expect(showCallOrder).toBeLessThan(hideCallOrder)
})

test('unloads a silent inactive tab after capturing its dom and css', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.insertJavaScript.mockResolvedValue({
    css: '.page { color: red; }',
    dom: { type: 'html', attributes: {}, children: [{ type: 'body', attributes: {}, children: [] }] },
    url: 'https://one.example',
  })
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsView.disposeWebContentsView.mockResolvedValue(undefined)
  const state = { ...createTwoTabState(), unloadTabs: true }

  const newState = await ViewletSimpleBrowser.selectTab(state, 1)

  expect(ElectronWebContentsViewFunctions.insertJavaScript).toHaveBeenCalledWith(12, expect.any(String))
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledWith(12)
  expect(ElectronWebContentsViewFunctions.hide).not.toHaveBeenCalledWith(12)
  expect(newState.tabs[0]).toMatchObject({
    browserViewId: 0,
    pageSnapshot: {
      css: '.page { color: red; }',
      key: 'webcontents-snapshot-one-example',
    },
  })
})

test('never unloads an inactive tab that is playing audio', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const state = createTwoTabState()
  const tabs = state.tabs.with(0, { ...state.tabs[0], isAudioPlaying: true })

  const newState = await ViewletSimpleBrowser.selectTab({ ...state, isAudioPlaying: true, tabs, unloadTabs: true }, 1)

  expect(newState.tabs[0]).toMatchObject({ browserViewId: 12, isAudioPlaying: true })
  expect(ElectronWebContentsViewFunctions.insertJavaScript).not.toHaveBeenCalled()
  expect(ElectronWebContentsView.disposeWebContentsView).not.toHaveBeenCalled()
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(12)
})

test('keeps the inactive web contents alive when snapshot capture fails', async () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  try {
    // @ts-ignore
    ElectronWebContentsViewFunctions.insertJavaScript.mockRejectedValue(new Error('capture failed'))
    // @ts-ignore
    ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
    // @ts-ignore
    ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
    // @ts-ignore
    ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
    const state = { ...createTwoTabState(), unloadTabs: true }

    const newState = await ViewletSimpleBrowser.selectTab(state, 1)

    expect(newState.tabs[0]).toMatchObject({ browserViewId: 12 })
    expect(ElectronWebContentsView.disposeWebContentsView).not.toHaveBeenCalled()
    expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(12)
  } finally {
    consoleError.mockRestore()
  }
})

test('shows a cached virtual-dom preview while an unloaded tab reloads', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(18)
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.resizeWebContentsView.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const pageSnapshot = {
    css: '.page { color: red; }',
    dom: [{ type: 4, className: 'page', childCount: 0 }],
    key: 'webcontents-snapshot-one-example',
  }
  const state = {
    ...ViewletSimpleBrowser.create(7, 'simple-browser://12', 10, 20, 300, 200),
    browserViewId: 12,
    headerHeight: 65,
    isAudioPlaying: true,
    tabs: [
      { browserViewId: 12, iframeSrc: 'https://two.example', inputValue: 'two.example', isAudioPlaying: true, title: 'Two' },
      { browserViewId: 0, iframeSrc: 'https://one.example', inputValue: 'one.example', pageSnapshot, title: 'One' },
    ],
    unloadTabs: true,
  }

  const loadingState = await ViewletSimpleBrowser.selectTab(state, 1)

  expect(loadingState.tabs[1]).toMatchObject({ browserViewId: 18, isLoading: true, pageSnapshot })
  expect(ElectronWebContentsViewFunctions.show).not.toHaveBeenCalledWith(18)
  expect(ElectronWebContentsViewFunctions.focus).not.toHaveBeenCalledWith(18)
  await ViewletSimpleBrowser.show(loadingState)

  // @ts-ignore
  ElectronWebContentsViewFunctions.getStats.mockResolvedValue({ canGoBack: false, canGoForward: false })
  const loadedState = await ViewletSimpleBrowser.handleDidNavigate(loadingState, 18, 'https://one.example')

  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(18)
  expect(ElectronWebContentsViewFunctions.focus).toHaveBeenCalledWith(18)
  expect(loadedState.tabs[1]).toMatchObject({ browserViewId: 18, isLoading: false })
  expect(loadedState.tabs[1].pageSnapshot).toBeUndefined()
})

test('creates a restored background tab web contents view when the tab is selected', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(18)
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.resizeWebContentsView.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7, 'simple-browser://17', 10, 20, 300, 200),
    browserViewId: 17,
    headerHeight: 65,
    selectedTabIndex: 1,
    tabs: [
      { browserViewId: 0, iframeSrc: 'https://one.example', inputValue: 'one.example', title: 'One' },
      { browserViewId: 17, iframeSrc: 'https://two.example', inputValue: 'two.example', title: 'Two' },
    ],
  }

  const newState = await ViewletSimpleBrowser.selectTab(state, 0)

  expect(newState).toMatchObject({
    browserViewId: 18,
    iframeSrc: 'https://one.example',
    inputValue: 'one.example',
    selectedTabIndex: 0,
    title: 'One',
  })
  expect(newState.tabs[0]).toMatchObject({ browserViewId: 18, iframeSrc: 'https://one.example', isLoading: true })
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsView.createWebContentsView).toHaveBeenCalledWith(0, 7)
  expect(ElectronWebContentsViewFunctions.resizeWebContentsView).toHaveBeenCalledWith(18, 10, 85, 300, 135)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(18, 'https://one.example')
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(18)
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(17)
  expect(ElectronWebContentsViewFunctions.focus).toHaveBeenCalledWith(18)
})

test('Ctrl+Tab from the focused web contents selects the next browser tab', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const state = createTwoTabState()

  const newState = await ViewletSimpleBrowser.handleKeyBinding(state, 12, KeyModifier.CtrlCmd | KeyCode.Tab)

  expect(newState).toMatchObject({ browserViewId: 13, selectedTabIndex: 1, title: 'Two' })
  expect(ElectronWebContentsViewFunctions.focus).toHaveBeenCalledWith(13)
})

test('Ctrl+Shift+Tab from the focused web contents wraps to the previous browser tab', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const state = createTwoTabState()

  const newState = await ViewletSimpleBrowser.handleKeyBinding(state, 12, KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Tab)

  expect(newState).toMatchObject({ browserViewId: 13, selectedTabIndex: 1, title: 'Two' })
  expect(ElectronWebContentsViewFunctions.focus).toHaveBeenCalledWith(13)
})

test('Ctrl+W from the focused web contents closes the current browser tab', async () => {
  // @ts-ignore
  ElectronWebContentsView.disposeWebContentsView.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const state = createTwoTabState()

  const newState = await ViewletSimpleBrowser.handleKeyBinding(state, 12, KeyModifier.CtrlCmd | KeyCode.KeyW)

  expect(newState).toMatchObject({ browserViewId: 13, selectedTabIndex: 0, title: 'Two' })
  expect(newState.tabs).toHaveLength(1)
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledWith(12)
  expect(ElectronWebContentsViewFunctions.focus).toHaveBeenCalledWith(13)
})

test('Ctrl+T from the focused web contents creates a new browser tab', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(14)
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.resizeWebContentsView.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  const state = createTwoTabState()

  const newState = await ViewletSimpleBrowser.handleKeyBinding(state, 12, KeyModifier.CtrlCmd | KeyCode.KeyT)

  expect(newState).toMatchObject({ browserViewId: 14, focusAddressVersion: 1, selectedTabIndex: 2, title: 'New Tab' })
  expect(newState.tabs).toHaveLength(3)
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(12)
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(14)
  expect(ElectronWindow.focus).toHaveBeenCalledTimes(1)
})

test('ignores keybindings from another simple browser instance', async () => {
  const state = createTwoTabState()

  const newState = await ViewletSimpleBrowser.handleKeyBinding(state, 99, KeyModifier.CtrlCmd | KeyCode.Tab)

  expect(newState).toBe(state)
  expect(ElectronWebContentsViewFunctions.hide).not.toHaveBeenCalled()
})

test('updates the matching background tab from web contents events', async () => {
  const state = {
    ...ViewletSimpleBrowser.create(),
    browserViewId: 12,
    tabs: [
      { browserViewId: 12, favicon: '', iframeSrc: 'https://one.example', inputValue: 'https://one.example', title: 'One' },
      { browserViewId: 13, favicon: '', iframeSrc: 'https://two.example', inputValue: 'https://two.example', title: 'Two' },
    ],
  }

  const withTitle = await ViewletSimpleBrowser.handleTitleUpdated(state, 13, 'Updated Two')
  const withFavicon = ViewletSimpleBrowser.handlePageFaviconUpdated(withTitle, 13, ['https://two.example/favicon.png'])
  const withAudio = ViewletSimpleBrowser.handleAudioStateChanged(withFavicon, 13, true)

  expect(withAudio.title).toBe('')
  expect(withAudio.tabs[1]).toMatchObject({ favicon: 'https://two.example/favicon.png', isAudioPlaying: true, title: 'Updated Two' })
})

test('remembers the origin when a page favicon is received', () => {
  const visitedSites = [{ favicon: 'https://soundcloud.com/favicon.ico', origin: 'https://soundcloud.com' }]
  // @ts-ignore
  BrowserVisitedSites.add.mockReturnValue(visitedSites)
  const state = {
    ...ViewletSimpleBrowser.create(),
    browserViewId: 12,
    tabs: [{ browserViewId: 12, favicon: '', iframeSrc: 'https://soundcloud.com/discover', title: 'SoundCloud' }],
  }

  const newState = ViewletSimpleBrowser.handlePageFaviconUpdated(state, 12, ['https://soundcloud.com/favicon.ico'])

  expect(BrowserVisitedSites.add).toHaveBeenCalledWith([], 'https://soundcloud.com/discover', 'https://soundcloud.com/favicon.ico')
  expect(BrowserVisitedSites.save).toHaveBeenCalledWith(visitedSites)
  expect(newState).toMatchObject({ favicon: 'https://soundcloud.com/favicon.ico', visitedSites })
})

test('updates audio state for the selected tab', () => {
  const state = {
    ...ViewletSimpleBrowser.create(),
    browserViewId: 12,
    tabs: [{ browserViewId: 12, isAudioPlaying: false }],
  }

  const playing = ViewletSimpleBrowser.handleAudioStateChanged(state, 12, true)
  const paused = ViewletSimpleBrowser.handleAudioStateChanged(playing, 12, false)

  expect(playing).toMatchObject({ isAudioPlaying: true, tabs: [{ browserViewId: 12, isAudioPlaying: true }] })
  expect(paused).toMatchObject({ isAudioPlaying: false, tabs: [{ browserViewId: 12, isAudioPlaying: false }] })
})

test('closing a tab disposes only its web contents view', async () => {
  // @ts-ignore
  ElectronWebContentsView.disposeWebContentsView.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(),
    browserViewId: 12,
    tabs: [
      { browserViewId: 12, favicon: '', iframeSrc: 'https://one.example', inputValue: 'https://one.example', title: 'One' },
      { browserViewId: 13, favicon: '', iframeSrc: 'https://two.example', inputValue: 'https://two.example', title: 'Two' },
    ],
  }

  const newState = await ViewletSimpleBrowser.closeTab(state, 1)

  expect(newState.tabs).toHaveLength(1)
  expect(newState.browserViewId).toBe(12)
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledWith(13)
})

test('closes the selected tab from the browser menu', async () => {
  // @ts-ignore
  ElectronWebContentsView.disposeWebContentsView.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(),
    browserViewId: 13,
    selectedTabIndex: 1,
    tabs: [
      { browserViewId: 12, favicon: '', iframeSrc: 'https://one.example', inputValue: 'https://one.example', title: 'One', zoomLevel: 0 },
      { browserViewId: 13, favicon: '', iframeSrc: 'https://two.example', inputValue: 'https://two.example', title: 'Two', zoomLevel: 0 },
    ],
  }

  const newState = await ViewletSimpleBrowser.closeCurrentTab(state)

  expect(newState.tabs).toHaveLength(1)
  expect(newState.browserViewId).toBe(12)
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledWith(13)
})

test('mutes a background tab without changing the active tab state', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.setAudioMuted.mockResolvedValue(undefined)
  const state = createTabsState()

  const newState = await ViewletSimpleBrowser.muteTab(state, 1)

  expect(ElectronWebContentsViewFunctions.setAudioMuted).toHaveBeenCalledWith(13, true)
  expect(newState.muted).toBe(false)
  expect(newState.tabs[1].muted).toBe(true)
})

test('unmutes a muted tab', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.setAudioMuted.mockResolvedValue(undefined)
  const state = createTabsState()
  state.tabs[1].muted = true

  const newState = await ViewletSimpleBrowser.muteTab(state, 1)

  expect(ElectronWebContentsViewFunctions.setAudioMuted).toHaveBeenCalledWith(13, false)
  expect(newState.muted).toBe(false)
  expect(newState.tabs[1].muted).toBe(false)
})

test('duplicates a tab directly to its right and selects the duplicate', async () => {
  // @ts-ignore
  ElectronWebContentsView.createWebContentsView.mockResolvedValue(16)
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  const state = createTabsState()

  const newState = await ViewletSimpleBrowser.duplicateTab(state, 1)

  expect(newState.tabs.map((tab) => tab.browserViewId)).toEqual([12, 13, 16, 14, 15])
  expect(newState).toMatchObject({ browserViewId: 16, iframeSrc: 'https://two.example', selectedTabIndex: 2, title: 'Two' })
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(16, 'https://two.example')
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(12)
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(16)
})

test('reloads only the requested tab', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.reload.mockResolvedValue(undefined)
  const state = createTabsState()

  const newState = await ViewletSimpleBrowser.reloadTab(state, 2)

  expect(ElectronWebContentsViewFunctions.reload).toHaveBeenCalledWith(14)
  expect(newState.isLoading).toBe(false)
  expect(newState.tabs[2].isLoading).toBe(true)
})

test('closes tabs to the left and activates the context-menu tab when necessary', async () => {
  // @ts-ignore
  ElectronWebContentsView.disposeWebContentsView.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const state = createTabsState()

  const newState = await ViewletSimpleBrowser.closeTabsToTheLeft(state, 2)

  expect(newState.tabs.map((tab) => tab.browserViewId)).toEqual([14, 15])
  expect(newState).toMatchObject({ browserViewId: 14, selectedTabIndex: 0, title: 'Three' })
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledTimes(2)
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledWith(12)
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledWith(13)
})

test('closes tabs to the right and activates the context-menu tab when necessary', async () => {
  // @ts-ignore
  ElectronWebContentsView.disposeWebContentsView.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const state = createTabsState(3)

  const newState = await ViewletSimpleBrowser.closeTabsToTheRight(state, 1)

  expect(newState.tabs.map((tab) => tab.browserViewId)).toEqual([12, 13])
  expect(newState).toMatchObject({ browserViewId: 13, selectedTabIndex: 1, title: 'Two' })
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledTimes(2)
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledWith(14)
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledWith(15)
})

test('closes every other tab and selects the context-menu tab', async () => {
  // @ts-ignore
  ElectronWebContentsView.disposeWebContentsView.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  const state = createTabsState()

  const newState = await ViewletSimpleBrowser.closeOtherTabs(state, 1)

  expect(newState.tabs.map((tab) => tab.browserViewId)).toEqual([13])
  expect(newState).toMatchObject({ browserViewId: 13, selectedTabIndex: 0, title: 'Two' })
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledTimes(3)
  expect(ElectronWebContentsView.disposeWebContentsView).not.toHaveBeenCalledWith(13)
})
test('hides every retained web contents view when the Simple Browser is hidden', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(),
    tabs: [{ browserViewId: 12 }, { browserViewId: 0 }, { browserViewId: 13 }],
  }

  await ViewletSimpleBrowser.hide(state)

  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledTimes(2)
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenNthCalledWith(1, 12)
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenNthCalledWith(2, 13)
})

test('resizes active and hidden web contents views', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.resizeWebContentsView.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7, '', 10, 20, 300, 200),
    tabs: [{ browserViewId: 12 }, { browserViewId: 0 }, { browserViewId: 13 }],
  }

  await ViewletSimpleBrowserResize.resizeEffect(state)

  expect(ElectronWebContentsViewFunctions.resizeWebContentsView).toHaveBeenNthCalledWith(1, 12, 10, 85, 300, 135)
  expect(ElectronWebContentsViewFunctions.resizeWebContentsView).toHaveBeenNthCalledWith(2, 13, 10, 85, 300, 135)
})

test('disposes every retained web contents view with the Simple Browser', async () => {
  // @ts-ignore
  ElectronWebContentsView.disposeWebContentsView.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7),
    snapshot: 'blob:https://example.com/snapshot',
    tabs: [{ browserViewId: 12 }, { browserViewId: 0 }, { browserViewId: 13 }],
  }

  await ViewletSimpleBrowser.dispose(state)

  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenCalledTimes(2)
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenNthCalledWith(1, 12)
  expect(ElectronWebContentsView.disposeWebContentsView).toHaveBeenNthCalledWith(2, 13)
  expect(SimpleBrowserSnapshot.dispose).toHaveBeenCalledWith('blob:https://example.com/snapshot')
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [['Css.removeCssStyleSheet', 'simple-browser-preview-7']])
})

test('handleWillNavigate', () => {
  const state = ViewletSimpleBrowser.create()
  // @ts-ignore
  expect(ViewletSimpleBrowser.handleWillNavigate(state, 'https://example.com', false, false)).toMatchObject({
    isLoading: true,
  })
})

test('setUrl applies the loading state before navigation completes', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockReturnValue({
    then() {
      throw new Error('navigation should not be awaited')
    },
  })
  const state = { ...ViewletSimpleBrowser.create(), browserViewId: 12 }

  const loadingState = await ViewletSimpleBrowser.setUrl(state, 'https://example.com')

  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(12, 'https://example.com')
  expect(loadingState).toMatchObject({
    iframeSrc: 'https://example.com',
    inputValue: 'https://example.com',
    isLoading: true,
  })
  await expect(ViewletSimpleBrowser.handleDidNavigate(loadingState, 'https://example.com')).resolves.toMatchObject({
    isLoading: false,
  })
})

test('setUrl opens cookie import urls as a main-area view', async () => {
  const state = { ...ViewletSimpleBrowser.create(), browserViewId: 12 }

  const newState = await ViewletSimpleBrowser.setUrl(state, 'cookie-import-view:///firefox/default')

  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', 'cookie-import-view:///firefox/default')
  expect(ElectronWebContentsViewFunctions.setIframeSrc).not.toHaveBeenCalled()
  expect(newState).toMatchObject({ inputValue: 'cookie-import-view:///firefox/default' })
})

test('handleDidNavigate refreshes navigation state', async () => {
  const state = { ...ViewletSimpleBrowser.create(), browserViewId: 12, isLoading: true }
  // @ts-ignore
  ElectronWebContentsViewFunctions.getStats.mockResolvedValueOnce({ canGoBack: true, canGoForward: false })

  const newState = await ViewletSimpleBrowser.handleDidNavigate(state, 12, 'https://example.com/one')

  expect(ElectronWebContentsViewFunctions.getStats).toHaveBeenCalledWith(12)
  expect(newState).toMatchObject({
    canGoBack: true,
    canGoForward: false,
    iframeSrc: 'https://example.com/one',
    inputValue: 'https://example.com/one',
    isLoading: false,
  })
})

test('keeps the internal new tab URL out of the address state', async () => {
  const state = { ...ViewletSimpleBrowser.create(), browserViewId: 12 }
  // @ts-ignore
  ElectronWebContentsViewFunctions.getStats.mockResolvedValueOnce({ canGoBack: false, canGoForward: false })

  const loadingState = ViewletSimpleBrowser.handleWillNavigate(state, 12, SimpleBrowserNewTabPage.url)
  const loadedState = await ViewletSimpleBrowser.handleDidNavigate(loadingState, 12, SimpleBrowserNewTabPage.url)

  expect(loadingState).toMatchObject({ iframeSrc: '', isLoading: true })
  expect(loadedState).toMatchObject({ iframeSrc: '', inputValue: '', isLoading: false })
})

test('showOverlay captures and hides the WebContentsView', async () => {
  const png = new Uint8Array([137, 80, 78, 71])
  // @ts-ignore
  ElectronWebContentsViewFunctions.capturePage.mockResolvedValue(png)
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  SimpleBrowserSnapshot.create.mockReturnValue('blob:https://example.com/snapshot')
  const state = { ...ViewletSimpleBrowser.create(), browserViewId: 12, iframeSrc: 'https://example.com' }

  const newState = await ViewletSimpleBrowser.showOverlay(state, 'quick-pick')

  expect(newState).toMatchObject({
    overlayIds: ['quick-pick'],
    snapshot: 'blob:https://example.com/snapshot',
  })
  expect(ElectronWebContentsViewFunctions.capturePage).toHaveBeenCalledWith(12)
  expect(SimpleBrowserSnapshot.create).toHaveBeenCalledWith(png)
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(12)
})

test('overlays keep a cached page preview in place while its WebContentsView loads', async () => {
  const pageSnapshot = {
    css: '.page { color: red; }',
    dom: [{ type: 4, className: 'page', childCount: 0 }],
    key: 'webcontents-snapshot-example-com',
  }
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 18,
    iframeSrc: 'https://example.com',
    tabs: [{ browserViewId: 18, pageSnapshot }],
  }

  const withOverlay = await ViewletSimpleBrowser.showOverlay(state, 'menu')
  const restored = await ViewletSimpleBrowser.hideOverlay(withOverlay, 'menu')

  expect(withOverlay).toMatchObject({ overlayIds: ['menu'], snapshot: '' })
  expect(restored).toMatchObject({ overlayIds: [], snapshot: '' })
  expect(ElectronWebContentsViewFunctions.capturePage).not.toHaveBeenCalled()
  expect(ElectronWebContentsViewFunctions.hide).not.toHaveBeenCalled()
  expect(ElectronWebContentsViewFunctions.show).not.toHaveBeenCalled()
})

test('overlays share one snapshot and restore after the last overlay closes', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.capturePage.mockResolvedValue(new Uint8Array([137, 80, 78, 71]))
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  // @ts-ignore
  SimpleBrowserSnapshot.create.mockReturnValue('blob:https://example.com/snapshot')
  const state = { ...ViewletSimpleBrowser.create(), browserViewId: 12, iframeSrc: 'https://example.com' }

  const withQuickPick = await ViewletSimpleBrowser.showOverlay(state, 'quick-pick')
  const withBoth = await ViewletSimpleBrowser.showOverlay(withQuickPick, 'menu')
  const withMenu = await ViewletSimpleBrowser.hideOverlay(withBoth, 'quick-pick')
  const restored = await ViewletSimpleBrowser.hideOverlay(withMenu, 'menu')

  expect(ElectronWebContentsViewFunctions.capturePage).toHaveBeenCalledTimes(1)
  expect(SimpleBrowserSnapshot.create).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledTimes(1)
  expect(SimpleBrowserSnapshot.dispose).toHaveBeenCalledTimes(1)
  expect(SimpleBrowserSnapshot.dispose).toHaveBeenCalledWith('blob:https://example.com/snapshot')
  expect(restored).toMatchObject({
    overlayIds: [],
    snapshot: '',
  })
})

test('showOverlay revokes a new snapshot when hiding the WebContentsView fails', async () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  try {
    // @ts-ignore
    ElectronWebContentsViewFunctions.capturePage.mockResolvedValue(new Uint8Array([137, 80, 78, 71]))
    // @ts-ignore
    ElectronWebContentsViewFunctions.hide.mockRejectedValue(new Error('Failed to hide'))
    // @ts-ignore
    SimpleBrowserSnapshot.create.mockReturnValue('blob:https://example.com/snapshot')
    const state = { ...ViewletSimpleBrowser.create(), browserViewId: 12, iframeSrc: 'https://example.com' }

    const newState = await ViewletSimpleBrowser.showOverlay(state, 'quick-pick')

    expect(newState).toBe(state)
    expect(SimpleBrowserSnapshot.dispose).toHaveBeenCalledWith('blob:https://example.com/snapshot')
  } finally {
    consoleError.mockRestore()
  }
})

test('hideOverlay revokes the snapshot when restoring the WebContentsView fails', async () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  try {
    // @ts-ignore
    ElectronWebContentsViewFunctions.show.mockRejectedValue(new Error('Failed to show'))
    const state = {
      ...ViewletSimpleBrowser.create(),
      browserViewId: 12,
      overlayIds: ['quick-pick'],
      snapshot: 'blob:https://example.com/snapshot',
    }

    const newState = await ViewletSimpleBrowser.hideOverlay(state, 'quick-pick')

    expect(newState).toMatchObject({ overlayIds: [], snapshot: '' })
    expect(SimpleBrowserSnapshot.dispose).toHaveBeenCalledWith('blob:https://example.com/snapshot')
  } finally {
    consoleError.mockRestore()
  }
})

test('showTabHover captures the page and shows the full title and memory usage', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.capturePage.mockResolvedValue(new Uint8Array([137, 80, 78, 71]))
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.getStats.mockResolvedValue({ memory: 42_000_000, title: 'A complete page title' })
  // @ts-ignore
  SimpleBrowserSnapshot.create.mockReturnValue('blob:https://example.com/snapshot')
  const state = {
    ...ViewletSimpleBrowser.create(7, 'simple-browser://12', 10, 20, 500, 300),
    browserViewId: 12,
    iframeSrc: 'https://example.com',
    tabHoverEnabled: true,
    tabs: [{ browserViewId: 12, title: 'Example' }],
  }

  const newState = await ViewletSimpleBrowser.showTabHover(state, 0, 25, 180, 0)

  expect(ElectronWebContentsViewFunctions.getStats).toHaveBeenCalledWith(12, true)
  expect(newState).toMatchObject({
    overlayIds: ['tab-hover'],
    snapshot: 'blob:https://example.com/snapshot',
    tabHover: {
      index: 0,
      left: 25,
      memoryLabel: 'Memory usage: 42 MB',
      tabLeft: 25,
      tabWidth: 180,
      title: 'A complete page title',
    },
  })
})

test('showTabHover does nothing when tab hovers are disabled', async () => {
  const state = {
    ...ViewletSimpleBrowser.create(7, 'simple-browser://12', 0, 0, 500, 300),
    browserViewId: 12,
    tabs: [{ browserViewId: 12, title: 'Example' }],
  }

  await expect(ViewletSimpleBrowser.showTabHover(state, 0, 0, 180, 0)).resolves.toBe(state)
  expect(ElectronWebContentsViewFunctions.capturePage).not.toHaveBeenCalled()
  expect(ElectronWebContentsViewFunctions.getStats).not.toHaveBeenCalled()
})

test('showTabHover shows the saved title for an unloaded tab without requesting memory', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.capturePage.mockResolvedValue(new Uint8Array([137, 80, 78, 71]))
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  SimpleBrowserSnapshot.create.mockReturnValue('blob:https://example.com/snapshot')
  const state = {
    ...ViewletSimpleBrowser.create(7, 'simple-browser://12', 10, 20, 500, 300),
    browserViewId: 12,
    iframeSrc: 'https://selected.example.com',
    selectedTabIndex: 0,
    tabHoverEnabled: true,
    tabs: [
      { browserViewId: 12, title: 'Selected tab' },
      { browserViewId: 0, title: 'Unloaded complete title' },
    ],
  }

  const newState = await ViewletSimpleBrowser.showTabHover(state, 1, 205, 180, 0)

  expect(ElectronWebContentsViewFunctions.getStats).not.toHaveBeenCalled()
  expect(newState.tabHover).toMatchObject({
    index: 1,
    memoryLabel: 'Memory usage unavailable',
    title: 'Unloaded complete title',
  })
})

test('hideTabHover ignores pointer transitions inside the hovered tab', async () => {
  const state = {
    ...ViewletSimpleBrowser.create(7, 'simple-browser://12', 10, 20, 500, 300),
    browserViewId: 12,
    overlayIds: ['tab-hover'],
    snapshot: 'blob:https://example.com/snapshot',
    tabHover: { index: 0, left: 25, memoryLabel: 'Memory usage: 42 MB', tabLeft: 25, tabWidth: 180, title: 'Example' },
  }

  await expect(ViewletSimpleBrowser.hideTabHover(state, 0, 50, 30)).resolves.toBe(state)
  expect(ElectronWebContentsViewFunctions.show).not.toHaveBeenCalled()
})

test('hideTabHover restores the page after the pointer leaves the tab', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7, 'simple-browser://12', 10, 20, 500, 300),
    browserViewId: 12,
    overlayIds: ['tab-hover'],
    snapshot: 'blob:https://example.com/snapshot',
    tabHover: { index: 0, left: 25, memoryLabel: 'Memory usage: 42 MB', tabLeft: 25, tabWidth: 180, title: 'Example' },
  }

  const newState = await ViewletSimpleBrowser.hideTabHover(state, 0, 50, 80)

  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(12)
  expect(SimpleBrowserSnapshot.dispose).toHaveBeenCalledWith('blob:https://example.com/snapshot')
  expect(newState).toMatchObject({ overlayIds: [], snapshot: '' })
  expect(newState.tabHover).toBeUndefined()
})

test('handleInput does not request suggestions when disabled', async () => {
  const state = { ...ViewletSimpleBrowser.create(7), suggestionsEnabled: false }

  const newState = await ViewletSimpleBrowser.handleInput(state, 'what is')

  expect(newState.inputValue).toBe('what is')
  expect(BrowserSearchSuggestions.get).not.toHaveBeenCalled()
})

test('handleInput requests suggestions when enabled', async () => {
  // @ts-ignore
  BrowserSearchSuggestions.get.mockResolvedValue(['what is my ip'])
  // @ts-ignore
  Command.execute.mockResolvedValue(undefined)
  const state = { ...ViewletSimpleBrowser.create(7), suggestionsEnabled: true }

  const newState = await ViewletSimpleBrowser.handleInput(state, 'what is')
  await new Promise((resolve) => setTimeout(resolve, 0))

  expect(newState).toMatchObject({ inputValue: 'what is', selectedSuggestionIndex: -1 })
  expect(BrowserSearchSuggestions.get).toHaveBeenCalledWith('what is')
  expect(Command.execute).toHaveBeenCalledWith('SimpleBrowser.applySuggestions', 7, 'what is', ['what is my ip'])
})

test('handleInput replaces partial search suggestions when the input becomes a URL', async () => {
  const localSuggestion = {
    favicon: 'https://soundcloud.com/favicon.ico',
    type: 'url',
    value: 'https://soundcloud.com',
  }
  // @ts-ignore
  BrowserVisitedSites.getSuggestions.mockReturnValue([localSuggestion])
  const state = {
    ...ViewletSimpleBrowser.create(7),
    hasSuggestionsOverlay: true,
    inputValue: 'soundcloud.c',
    overlayIds: ['search-suggestions'],
    suggestions: [{ favicon: '', type: 'search', value: 'soundcloud.c' }, localSuggestion],
    suggestionsEnabled: true,
  }

  const newState = await ViewletSimpleBrowser.handleInput(state, 'soundcloud.com')

  expect(BrowserSearchSuggestions.get).not.toHaveBeenCalled()
  expect(BrowserVisitedSites.getSuggestions).toHaveBeenCalledWith([], 'soundcloud.com')
  expect(Command.execute).not.toHaveBeenCalled()
  expect(newState).toMatchObject({ inputValue: 'soundcloud.com', selectedSuggestionIndex: 0, suggestions: [localSuggestion] })
})

test('applySuggestions ignores stale results', async () => {
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 12,
    inputValue: 'new query',
    suggestionsEnabled: true,
  }

  const newState = await ViewletSimpleBrowser.applySuggestions(state, 7, 'old query', ['old query result'])

  expect(newState).toBe(state)
  expect(ElectronWebContentsViewFunctions.capturePage).not.toHaveBeenCalled()
})

test('applySuggestions captures the page and shows provider results', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.capturePage.mockResolvedValue(new Uint8Array([137, 80, 78, 71]))
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  SimpleBrowserSnapshot.create.mockReturnValue('blob:https://example.com/snapshot')
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 12,
    iframeSrc: 'https://example.com',
    inputValue: 'what is',
    suggestionsEnabled: true,
  }

  const newState = await ViewletSimpleBrowser.applySuggestions(state, 7, 'what is', ['what is my ip', 'what is love'])

  expect(newState).toMatchObject({
    hasSuggestionsOverlay: true,
    overlayIds: ['search-suggestions'],
    selectedSuggestionIndex: 0,
    snapshot: 'blob:https://example.com/snapshot',
    suggestions: [
      { favicon: '', type: 'search', value: 'what is' },
      { favicon: '', type: 'search', value: 'what is my ip' },
      { favicon: '', type: 'search', value: 'what is love' },
    ],
  })
})

test('applySuggestions does not capture a page for an empty new tab', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 12,
    inputValue: 'what is',
    suggestionsEnabled: true,
  }

  const newState = await ViewletSimpleBrowser.applySuggestions(state, 7, 'what is', ['what is my ip'])

  expect(newState).toMatchObject({
    hasSuggestionsOverlay: true,
    overlayIds: ['search-suggestions'],
    selectedSuggestionIndex: 0,
    snapshot: '',
    suggestions: [
      { favicon: '', type: 'search', value: 'what is' },
      { favicon: '', type: 'search', value: 'what is my ip' },
    ],
  })
  expect(ElectronWebContentsViewFunctions.capturePage).not.toHaveBeenCalled()
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(12)
})

test('applySuggestions closes an existing popup after a provider failure', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 12,
    hasSuggestionsOverlay: true,
    inputValue: 'what is',
    overlayIds: ['search-suggestions'],
    selectedSuggestionIndex: 0,
    snapshot: 'blob:https://example.com/snapshot',
    suggestions: ['what is'],
    suggestionsEnabled: true,
  }

  const newState = await ViewletSimpleBrowser.applySuggestions(state, 7, 'what is', [])

  expect(newState).toMatchObject({
    hasSuggestionsOverlay: false,
    overlayIds: [],
    selectedSuggestionIndex: -1,
    snapshot: '',
    suggestions: [],
  })
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(12)
  expect(SimpleBrowserSnapshot.dispose).toHaveBeenCalledWith('blob:https://example.com/snapshot')
})

test('suggestion selection stays within the available results', () => {
  const state = {
    ...ViewletSimpleBrowser.create(7),
    hasSuggestionsOverlay: true,
    selectedSuggestionIndex: 0,
    suggestions: ['one', 'two'],
  }

  const second = ViewletSimpleBrowser.selectNextSuggestion(state)
  const stillSecond = ViewletSimpleBrowser.selectNextSuggestion(second)
  const first = ViewletSimpleBrowser.selectPreviousSuggestion(stillSecond)

  expect(second.selectedSuggestionIndex).toBe(1)
  expect(stillSecond.selectedSuggestionIndex).toBe(1)
  expect(first.selectedSuggestionIndex).toBe(0)
})

test('applySuggestions places matching visited sites before provider results', async () => {
  const localSuggestion = {
    favicon: 'https://soundcloud.com/favicon.ico',
    type: 'url',
    value: 'https://soundcloud.com',
  }
  // @ts-ignore
  BrowserVisitedSites.getSuggestions.mockReturnValue([localSuggestion])
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 12,
    inputValue: 'soundcloud',
    suggestionsEnabled: true,
  }

  const newState = await ViewletSimpleBrowser.applySuggestions(state, 7, 'soundcloud', ['soundcloud music'])

  expect(newState.suggestions).toEqual([
    localSuggestion,
    { favicon: '', type: 'search', value: 'soundcloud' },
    { favicon: '', type: 'search', value: 'soundcloud music' },
  ])
})

test('acceptSuggestion restores the page and navigates', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 12,
    hasSuggestionsOverlay: true,
    overlayIds: ['search-suggestions'],
    selectedSuggestionIndex: 1,
    snapshot: 'blob:https://example.com/snapshot',
    suggestions: [
      { favicon: '', type: 'search', value: 'what is' },
      { favicon: '', type: 'search', value: 'what is my ip' },
    ],
    suggestionsEnabled: true,
  }

  const newState = await ViewletSimpleBrowser.acceptSuggestion(state)

  expect(newState).toMatchObject({
    hasSuggestionsOverlay: false,
    iframeSrc: 'https://www.google.com/search?q=what+is+my+ip',
    inputValue: 'what is my ip',
    isLoading: true,
    snapshot: '',
    suggestions: [],
  })
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(12)
  expect(SimpleBrowserSnapshot.dispose).toHaveBeenCalledWith('blob:https://example.com/snapshot')
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(12, 'https://www.google.com/search?q=what+is+my+ip')
})

test('acceptSuggestion navigates directly to a visited URL suggestion', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 12,
    hasSuggestionsOverlay: true,
    overlayIds: ['search-suggestions'],
    selectedSuggestionIndex: 0,
    suggestions: [
      {
        favicon: 'https://soundcloud.com/favicon.ico',
        type: 'url',
        value: 'https://soundcloud.com',
      },
    ],
    suggestionsEnabled: true,
  }

  const newState = await ViewletSimpleBrowser.acceptSuggestion(state)

  expect(newState).toMatchObject({ iframeSrc: 'https://soundcloud.com', inputValue: 'https://soundcloud.com', isLoading: true })
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(12, 'https://soundcloud.com')
})

test('go closes suggestions and submits the input value', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.focus.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.setIframeSrc.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 12,
    hasSuggestionsOverlay: true,
    inputValue: 'example.com',
    overlayIds: ['search-suggestions'],
    selectedSuggestionIndex: -1,
    snapshot: 'blob:https://example.com/snapshot',
    suggestions: [{ favicon: '', type: 'search', value: 'example website' }],
    suggestionsEnabled: true,
  }

  const newState = await ViewletSimpleBrowser.go(state)

  expect(newState).toMatchObject({
    hasSuggestionsOverlay: false,
    iframeSrc: 'https://example.com',
    inputValue: 'example.com',
    isLoading: true,
    snapshot: '',
    suggestions: [],
  })
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledWith(12)
  expect(SimpleBrowserSnapshot.dispose).toHaveBeenCalledWith('blob:https://example.com/snapshot')
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(12, 'https://example.com')
})
