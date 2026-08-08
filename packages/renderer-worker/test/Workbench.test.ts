// @ts-nocheck
import { beforeEach, expect, jest, test } from '@jest/globals'

const mockInitData = jest.fn()
const mockBoundsSet = jest.fn()
const mockColorThemeHydrate = jest.fn(async () => {})
const mockCleanUpWorkers = jest.fn(async () => {})
const mockFocusHydrate = jest.fn(async () => {})
const mockGetExtensionView = jest.fn(async () => undefined)
const mockKeyBindingsHydrate = jest.fn(async () => {})
const mockLaunchSharedProcess = jest.fn(async () => {})
const mockLocationHydrate = jest.fn(async () => {})
const mockLocationInitialize = jest.fn()
const mockModuleLoad = jest.fn(async () => ({}))
const mockOpenInitialUri = jest.fn(async () => {})
const mockRendererProcessListen = jest.fn(async () => {})
const mockRendererProcessInvoke = jest.fn(async () => {})
const mockSaveStateGet = jest.fn(async () => ({ isLoading: false }))
const mockShouldInitializeAuth = jest.fn(() => false)
const mockSaveStateHydrate = jest.fn(async () => {})
const mockWebSocketInitialize = jest.fn()
const mockWorkspaceHydrate = jest.fn(async () => {})
const mockWorkspaceFileWatcherHydrate = jest.fn(async () => {})
const mockWorkspaceIsTest = jest.fn(() => false)
const mockWatchFilesForHotReload = jest.fn(async () => {})
const mockHeadlessLayoutInitialize = jest.fn()
const mockRecentlyOpenedHydrate = jest.fn(async () => {})
const mockPreferencesHydrate = jest.fn(async () => {})
const mockFileSystemStateRegister = jest.fn()
const mockLifeCycleMark = jest.fn()
const mockViewletManagerCreate = jest.fn(() => ({ uid: 0 }))
const mockViewletManagerLoad = jest.fn(async () => [['Viewlet.createFunctionalRoot', 'Test']])

jest.unstable_mockModule('../src/parts/Bounds/Bounds.js', () => ({
  set: mockBoundsSet,
}))

jest.unstable_mockModule('../src/parts/ColorTheme/ColorTheme.js', () => ({
  hydrate: mockColorThemeHydrate,
}))

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
  setLoad: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/CleanAuthCallbackUrl/CleanAuthCallbackUrl.js', () => ({
  cleanAuthCallbackUrl: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/CleanUpWorkersAfterLoad/CleanUpWorkersAfterLoad.js', () => ({
  cleanUpWorkersAfterLoad: mockCleanUpWorkers,
}))

jest.unstable_mockModule('../src/parts/DevelopFileWatcher/DevelopFileWatcher.js', () => ({
  hydrate: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ExecuteCurrentTest/ExecuteCurrentTest.js', () => ({
  executeCurrentTest: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/FileSystemMap/FileSystemMap.js', () => ({
  map: {},
}))

jest.unstable_mockModule('../src/parts/FileSystemState/FileSystemState.js', () => ({
  registerAll: mockFileSystemStateRegister,
}))

jest.unstable_mockModule('../src/parts/Focus/Focus.js', () => ({
  hydrate: mockFocusHydrate,
}))

jest.unstable_mockModule('../src/parts/HasCodeQueryParam/HasCodeQueryParam.js', () => ({
  hasCodeQueryParam: jest.fn(() => false),
}))

jest.unstable_mockModule('../src/parts/HeadlessLayout/HeadlessLayout.js', () => ({
  initialize: mockHeadlessLayoutInitialize,
}))

jest.unstable_mockModule('../src/parts/IconTheme/IconTheme.js', () => ({
  hydrate: jest.fn(async () => {}),
}))

jest.unstable_mockModule('../src/parts/Id/Id.js', () => ({
  create: jest.fn(() => 12),
}))

jest.unstable_mockModule('../src/parts/InitData/InitData.js', () => ({
  getInitData: mockInitData,
}))

jest.unstable_mockModule('../src/parts/IpcState/IpcState.js', () => ({
  setConfig: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/KeyBindings/KeyBindings.js', () => ({
  hydrate: mockKeyBindingsHydrate,
}))

jest.unstable_mockModule('../src/parts/Languages/Languages.js', () => ({
  hydrate: jest.fn(async () => {}),
}))

jest.unstable_mockModule('../src/parts/LaunchSharedProcess/LaunchSharedProcess.js', () => ({
  launchSharedProcess: mockLaunchSharedProcess,
}))

jest.unstable_mockModule('../src/parts/LaunchTestWorker/LaunchTestWorker.ts', () => ({
  preloadTestWorker: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/LifeCycle/LifeCycle.js', () => ({
  mark: mockLifeCycleMark,
}))

jest.unstable_mockModule('../src/parts/LifeCyclePhase/LifeCyclePhase.js', () => ({
  Zero: 0,
  One: 1,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Eleven: 11,
  Twelve: 12,
  Thirteen: 13,
  Fourteen: 14,
  Fifteen: 15,
  Sixteen: 16,
}))

jest.unstable_mockModule('../src/parts/Location/Location.js', () => ({
  hydrate: mockLocationHydrate,
  initialize: mockLocationInitialize,
}))

jest.unstable_mockModule('../src/parts/Module/Module.js', () => ({
  load: mockModuleLoad,
}))

jest.unstable_mockModule('../src/parts/OpenInitialUri/OpenInitialUri.js', () => ({
  openInitialUri: mockOpenInitialUri,
}))

jest.unstable_mockModule('../src/parts/GetExtensionViews/GetExtensionViews.ts', () => ({
  getExtensionView: mockGetExtensionView,
}))

jest.unstable_mockModule('../src/parts/Performance/Performance.js', () => ({
  mark: jest.fn(),
  measure: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/PerformanceMarkerType/PerformanceMarkerType.js', () => ({}))

jest.unstable_mockModule('../src/parts/PlatformType/PlatformType.js', () => ({
  Web: 'web',
  Electron: 'electron',
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  hydrate: mockPreferencesHydrate,
  get: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/PreferencesState/PreferencesState.js', () => ({
  set: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/PromptMode/PromptMode.js', () => ({
  getPromptOptions: jest.fn(() => undefined),
  run: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/RecentlyOpened/RecentlyOpened.js', () => ({
  hydrate: mockRecentlyOpenedHydrate,
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  listen: mockRendererProcessListen,
  invoke: mockRendererProcessInvoke,
}))

jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => ({
  getSavedViewletState: mockSaveStateGet,
  hydrate: mockSaveStateHydrate,
}))

jest.unstable_mockModule('../src/parts/SessionReplay/SessionReplay.js', () => ({
  startRecording: jest.fn(async () => {}),
  replaySession: jest.fn(async () => {}),
}))

jest.unstable_mockModule('../src/parts/ShouldInitializeAuth/ShouldInitializeAuth.ts', () => ({
  shouldInitializeAuth: mockShouldInitializeAuth,
}))

jest.unstable_mockModule('../src/parts/StartupAuth/StartupAuth.js', () => ({
  initializeAuth: jest.fn(async () => undefined),
}))

jest.unstable_mockModule('../src/parts/UnhandledErrorHandling/UnhandledErrorHandling.js', () => ({
  handleUnhandledRejection: jest.fn(),
  handleUnhandledError: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({
  create: mockViewletManagerCreate,
  load: mockViewletManagerLoad,
}))

jest.unstable_mockModule('../src/parts/ViewletModule/ViewletModule.js', () => ({
  load: jest.fn(() => ''),
}))

jest.unstable_mockModule('../src/parts/ViewletModuleId/ViewletModuleId.js', () => ({
  ExtensionView: 'ExtensionView',
  Layout: 'Layout',
}))

jest.unstable_mockModule('../src/parts/ViewletModuleInternal/ViewletModuleInternal.js', () => ({
  registerAll: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ViewletModuleMap/ViewletModuleMap.js', () => ({
  map: {},
}))

jest.unstable_mockModule('../src/parts/WatchFilesForHotReload/WatchFilesForHotReload.js', () => ({
  watchFilesForHotReload: mockWatchFilesForHotReload,
  hydrate: jest.fn(async () => {}),
}))

jest.unstable_mockModule('../src/parts/WebSocketCapability/WebSocketCapability.js', () => ({
  initialize: mockWebSocketInitialize,
}))

jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => ({
  hydrate: mockWorkspaceHydrate,
  isTest: mockWorkspaceIsTest,
}))

jest.unstable_mockModule('../src/parts/WorkspaceFileWatcher/WorkspaceFileWatcher.js', () => ({
  hydrate: mockWorkspaceFileWatcherHydrate,
}))

const Workbench = await import('../src/parts/Workbench/Workbench.js')

beforeEach(() => {
  jest.clearAllMocks()
  mockInitData.mockResolvedValue({
    Config: {
      shouldLaunchMultipleWorkers: false,
      webSocketIssuer: undefined,
    },
    Layout: {
      bounds: {
        windowHeight: 800,
        windowWidth: 1200,
      },
    },
    Location: {
      href: 'lvce-oss://-/',
    },
  })
})

test('loads floating extension view when floating mode is valid', async () => {
  mockGetExtensionView.mockResolvedValue({ id: 'gpt-voice.views.default' })
  mockViewletManagerCreate.mockReturnValue({ uid: 42 })
  mockViewletManagerLoad.mockResolvedValue([])

  mockInitData.mockResolvedValueOnce({
    Config: {
      shouldLaunchMultipleWorkers: false,
      webSocketIssuer: undefined,
    },
    Layout: {
      bounds: {
        windowHeight: 800,
        windowWidth: 1200,
      },
    },
    Location: {
      href: 'lvce-oss://-/?floatingWindowMode=extensionView&floatingExtensionViewId=gpt-voice.views.default',
    },
  })

  await Workbench.startup('electron', '/tmp')

  expect(mockViewletManagerCreate).toHaveBeenCalledWith(
    expect.any(Function),
    'ExtensionView',
    0,
    'gpt-voice.views.default',
    0,
    0,
    0,
    0,
  )
  expect(mockViewletManagerLoad).toHaveBeenCalledWith(
    expect.objectContaining({
      disposed: false,
      uid: 12,
    }),
    false,
    false,
    expect.objectContaining({
      Location: {
        href: 'lvce-oss://-/?floatingWindowMode=extensionView&floatingExtensionViewId=gpt-voice.views.default',
      },
      restore: true,
    }),
  )
  expect(mockRendererProcessInvoke).toHaveBeenCalledWith('Viewlet.executeCommands', [['Viewlet.appendToBody', 12]])
  expect(mockOpenInitialUri).not.toHaveBeenCalled()
  expect(mockCleanUpWorkers).toHaveBeenCalledTimes(1)
  expect(mockViewletManagerCreate).toHaveBeenCalledTimes(1)
})

test('falls back to normal layout when floating extension view is missing', async () => {
  mockGetExtensionView.mockResolvedValue(null)
  mockViewletManagerLoad.mockResolvedValue([['Viewlet.createFunctionalRoot', 'Layout', 1, true]])

  mockInitData.mockResolvedValueOnce({
    Config: {
      shouldLaunchMultipleWorkers: false,
      webSocketIssuer: undefined,
    },
    Layout: {
      bounds: {
        windowHeight: 800,
        windowWidth: 1200,
      },
    },
    Location: {
      href: 'lvce-oss://-/?floatingWindowMode=extensionView&floatingExtensionViewId=invalid.view',
    },
  })

  await Workbench.startup('web', '/tmp')

  expect(mockViewletManagerCreate).toHaveBeenCalledWith(expect.any(Function), 'Layout', 0, '', 0, 0, 0, 0)
  expect(mockOpenInitialUri).toHaveBeenCalledWith(
    'lvce-oss://-/?floatingWindowMode=extensionView&floatingExtensionViewId=invalid.view',
  )
})
