// files that should be in initial chunk
import * as M1 from '../src/parts/Css/Css.ipc.js'
import * as M2 from '../src/parts/Layout/Layout.ipc.js'
import * as M4 from '../src/parts/Editor/Editor.js'
import * as M5 from '../src/parts/Focus/Focus.js'
import * as M6 from '../src/parts/Viewlet/Viewlet.ipc.js'
import * as M7 from '../src/parts/KeyBindings/KeyBindings.ipc.js'
import * as M9 from '../src/parts/GlobalEventBus/GlobalEventBus.js'
import * as M14 from '../src/parts/Widget/Widget.js'
import * as M15 from '../src/parts/LocalStorage/LocalStorage.ipc.js'
import * as M18 from '../src/parts/Platform/Platform.js'
import * as M22 from '../src/parts/ServiceWorker/ServiceWorker.ipc.js'
import * as M26 from '../src/parts/Location/Location.ipc.js'
import * as M13 from './parts/OldMenu/Menu.js'
import * as M27 from './parts/Viewlet/ViewletActivityBar.js'
import * as M28 from './parts/Viewlet/ViewletStatusBar.js'
import * as M29 from './parts/Viewlet/ViewletTitleBar.js'
import * as M30 from './parts/Window/Window.ipc.js'
import * as RendererWorker from './parts/RendererWorker/RendererWorker.js'
import * as Platform from './parts/Platform/Platform.js'

// hack so that rollup doesn't tree-shake out these modules
globalThis.M = [
  M1,
  M2,
  M4,
  M5,
  M6,
  M7,
  M9,
  M13,
  M14,
  M15,
  M18,
  M22,
  M26,
  M27,
  M28,
  M29,
  M30,
]

const handleError = (error) => {
  console.info(`[renderer-process] Unhandled Error: ${error}`)
  alert(error)
}

const handleUnhandledRejection = (event) => {
  console.info(`[renderer-process] Unhandled Rejection: ${event.reason}`)
  alert(event.reason)
}

const main = async () => {
  onerror = handleError
  onunhandledrejection = handleUnhandledRejection

  if (Platform.platform === 'web') {
    // disable prompt to download app as pwa
    // @ts-ignore
    window.onbeforeinstallprompt = (event) => {
      event.preventDefault()
    }
  }
  // TODO this is discovered very late
  await RendererWorker.hydrate()
  dispatchEvent(new CustomEvent('code/ready'))
  // TODO avoid creating global variables
  globalThis.__codeLoaded = true
}

main()

// 1. invoke shared process to read file
// 2. display file
// 3. optimize

// DEBUG

// globalThis.Panel = Panel
// globalThis.Context = Context
// globalThis.StatusBar = StatusBar
// globalThis.ViewService = ViewService
// globalThis.SideBar = SideBar
// globalThis.FileSystem = FileSystem

export const send = RendererWorker.send
