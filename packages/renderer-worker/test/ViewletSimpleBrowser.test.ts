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
    reload: jest.fn(() => {
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
    getStats() {
      return {
        title: 'test',
        url: '',
        canGoBack: true,
        canGoForward: true,
      }
    },
  }
})
jest.unstable_mockModule('../src/parts/ElectronWebContentsView/ElectronWebContentsView.js', () => {
  return {
    createWebContentsView: jest.fn(() => {
      return 1
    }),
  }
})

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

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

const ViewletSimpleBrowser = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js')
const BrowserSearchSuggestions = await import('../src/parts/BrowserSearchSuggestions/BrowserSearchSuggestions.js')
const Command = await import('../src/parts/Command/Command.js')
const ElectronWebContentsViewFunctions = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')
const ElectronWebContentsView = await import('../src/parts/ElectronWebContentsView/ElectronWebContentsView.js')

test('create', () => {
  const state = ViewletSimpleBrowser.create()
  expect(state).toBeDefined()
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
    iframeSrc: 'https://example.com',
  })
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
  expect(ElectronWebContentsViewFunctions.setFallthroughKeyBindings).toHaveBeenCalledWith([])
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
  expect(ElectronWebContentsViewFunctions.setFallthroughKeyBindings).toHaveBeenCalledWith([])
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(2, 'https://example.com')
})

test('handleTitleUpdated', async () => {
  const state = ViewletSimpleBrowser.create()
  expect(await ViewletSimpleBrowser.handleTitleUpdated(state, 'new Title')).toMatchObject({
    title: '',
  })
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
  expect(ViewletSimpleBrowser.handleDidNavigate(loadingState, 'https://example.com')).toMatchObject({
    isLoading: false,
  })
})

test('handleDidNavigate', () => {
  const state = { ...ViewletSimpleBrowser.create(), isLoading: true }
  // @ts-ignore
  const newState = ViewletSimpleBrowser.handleDidNavigate(state, 'https://example.com/one', false, false)
  expect(newState).toMatchObject({
    iframeSrc: 'https://example.com/one',
    inputValue: 'https://example.com/one',
    isLoading: false,
  })
  // @ts-ignore
  expect(ViewletSimpleBrowser.handleDidNavigate(newState, 'https://example.com/two', false, false)).toMatchObject({
    iframeSrc: 'https://example.com/two',
    inputValue: 'https://example.com/two',
  })
})

test('showOverlay captures and hides the WebContentsView', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.capturePage.mockResolvedValue('data:image/png;base64,c25hcHNob3Q=')
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  const state = { ...ViewletSimpleBrowser.create(), browserViewId: 12 }

  const newState = await ViewletSimpleBrowser.showOverlay(state, 'quick-pick')

  expect(newState).toMatchObject({
    overlayIds: ['quick-pick'],
    snapshot: 'data:image/png;base64,c25hcHNob3Q=',
  })
  expect(ElectronWebContentsViewFunctions.capturePage).toHaveBeenCalledWith(12)
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledWith(12)
})

test('overlays share one snapshot and restore after the last overlay closes', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.capturePage.mockResolvedValue('data:image/png;base64,c25hcHNob3Q=')
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  const state = { ...ViewletSimpleBrowser.create(), browserViewId: 12 }

  const withQuickPick = await ViewletSimpleBrowser.showOverlay(state, 'quick-pick')
  const withBoth = await ViewletSimpleBrowser.showOverlay(withQuickPick, 'menu')
  const withMenu = await ViewletSimpleBrowser.hideOverlay(withBoth, 'quick-pick')
  const restored = await ViewletSimpleBrowser.hideOverlay(withMenu, 'menu')

  expect(ElectronWebContentsViewFunctions.capturePage).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.hide).toHaveBeenCalledTimes(1)
  expect(ElectronWebContentsViewFunctions.show).toHaveBeenCalledTimes(1)
  expect(restored).toMatchObject({
    overlayIds: [],
    snapshot: '',
  })
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

test('handleInput does not disclose URL-like values to the suggestions provider', async () => {
  const state = { ...ViewletSimpleBrowser.create(7), suggestionsEnabled: true }

  await ViewletSimpleBrowser.handleInput(state, 'https://example.com/private')

  expect(BrowserSearchSuggestions.get).not.toHaveBeenCalled()
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
  ElectronWebContentsViewFunctions.capturePage.mockResolvedValue('data:image/png;base64,c25hcHNob3Q=')
  // @ts-ignore
  ElectronWebContentsViewFunctions.hide.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 12,
    inputValue: 'what is',
    suggestionsEnabled: true,
  }

  const newState = await ViewletSimpleBrowser.applySuggestions(state, 7, 'what is', ['what is my ip', 'what is love'])

  expect(newState).toMatchObject({
    hasSuggestionsOverlay: true,
    overlayIds: ['search-suggestions'],
    selectedSuggestionIndex: 0,
    snapshot: 'data:image/png;base64,c25hcHNob3Q=',
    suggestions: ['what is', 'what is my ip', 'what is love'],
  })
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
    snapshot: 'data:image/png;base64,c25hcHNob3Q=',
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

test('acceptSuggestion restores the page and navigates', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.show.mockResolvedValue(undefined)
  const state = {
    ...ViewletSimpleBrowser.create(7),
    browserViewId: 12,
    hasSuggestionsOverlay: true,
    overlayIds: ['search-suggestions'],
    selectedSuggestionIndex: 1,
    snapshot: 'data:image/png;base64,c25hcHNob3Q=',
    suggestions: ['what is', 'what is my ip'],
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
  expect(ElectronWebContentsViewFunctions.setIframeSrc).toHaveBeenCalledWith(12, 'https://www.google.com/search?q=what+is+my+ip')
})
