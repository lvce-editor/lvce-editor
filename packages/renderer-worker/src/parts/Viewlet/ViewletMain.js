import * as Command from '../Command/Command.js'
import * as Languages from '../Languages/Languages.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Viewlet from './Viewlet.js'
import * as Assert from '../Assert/Assert.js'

const COLUMN_WIDTH = 9 // TODO compute this automatically once

// interface Editor {
//  readonly uri: string
//  readonly type: string
// }

// interface EditorLazy {
//  readonly type: 'lazy'
// }

// interface EditorText extends Editor {
//   readonly textDocument: TextDocument
//   readonly type: 'text'
// }

// interface EditorIframe extends Editor {
//  readonly srcdoc: string
//  readonly type: 'iframe'
// }

// interface EditorImage extends Editor {
//   readonly src: string
//   readonly type: 'image'
// }

// interface EditorVideo extends Editor {
//   readonly src: string
//   readonly type: 'video'
// }

const getMainEditor = (state) => {
  if (
    !state ||
    !state.instances ||
    !state.instances.EditorText ||
    !state.instances.EditorText.state
  ) {
    return undefined
  }
  // TODO check that type is string (else runtime error occurs and page is blank)
  return state.instances.EditorText.state
}

const restoreEditors = async (state) => {
  // // TODO have mapping that loads custom editor module on demand
  // // file:// -> import text editor
  // // perf://startup-performance -> show startup performance
  // // perf://memory-usage -> show memory usage
  // // svg://my-file.svg -> show svg
  // // image://my-image.png -> show image
  // // video://my-video.png -> show video
  // // also editor title can be shown while content is still loading
  // if (restoredEditor.uri.startsWith('perf://')) {
  //   Command.execute(/* Developer.openPerf */ 820)
  //   return
  // }
  await openUri(state, restoredEditor.uri)
}

const handleTokenizeChange = (languageId) => {
  const instances = Viewlet.state.instances
  if (instances.EditorText) {
    const instance = instances.EditorText
  }
  // for (const editor of state.editors) {
  //   if (editor.languageId === languageId) {
  //     Editor.handleTokenizeChange(editor)
  //   }
  // }
}

const hydrateLazy = async () => {
  // TODO main should not know about languages
  await Languages.hydrate()
  // TODO this should be in extension host
  await Command.execute(
    /* EditorDiagnostics.hydrate */ 'EditorDiagnostics.hydrate'
  )
}

export const name = 'Main'

export const create = (id, uri, left, top, width, height) => {
  return {
    editors: [],
    activeIndex: -1,
    focusedIndex: -1,
    left,
    top,
    width,
    height,
  }
}

// const showEditor = async (uri, languageId, content) => {
//   if (state.activeEditor) {
//     // TODO duplicate code in if/else
//     // state.editors = [state.activeEditor]
//     // Editor.replaceOne(state.activeEditor, uri, languageId, content)
//     // TODO replace editor
//   } else {
//     // state.activeEditor = Editor.create(1, uri, languageId, content)
//     // state.editors = [state.activeEditor]
//     // Editor.openOne(state.activeEditor)
//     // TODO create editor group and new editor
//   }

//   // TODO send type of editor
//   // 1 normal
//   // 2 side by side (settings.json, git diff, preview)
//   // 3 image
//   // 4 video
//   // 5 iframe (maybe 3/4 could also be iframe)
//   // Editor.initialSync(state.activeEditor)

//   // TODO use idlecallback maybe (after 350ms or something)
//   // TODO maybe use indexeddb instead
//   // TODO store all open editors
//   // await Command.execute(/* LocalStorage.setJson */ 6901, 'Main.editors', [uri])
// }

// TODO there is also openEditor function

const getTabTitle = (uri) => {
  const homeDir = Workspace.getHomeDir()
  // TODO tree shake this out in web
  if (homeDir && uri.startsWith(homeDir)) {
    return `~${uri.slice(homeDir.length)}`
  }
  return uri
}

const findEditorWithUri = (editors, uri) => {
  for (const [i, editor] of editors.entries()) {
    if (editor.uri === uri) {
      return i
    }
  }
  return -1
}

const TAB_HEIGHT = 35
const id = 'EditorText'

const getRestoredEditors = async () => {
  const savedState = await Command.execute(
    /* LocalStorage.getJson */ 'LocalStorage.getJson',
    /* key */ 'stateToSave'
  )
  const restoredEditor = getMainEditor(savedState)
  if (!restoredEditor) {
    return []
  }
  return [restoredEditor]
}

export const loadContent = async (state) => {
  const editors = await getRestoredEditors()
  LifeCycle.once(LifeCycle.PHASE_TWELVE, hydrateLazy)
  return {
    ...state,
    editors,
  }
}

export const contentLoaded = async (state) => {
  if (state.editors.length === 0) {
    return
  }
  const editor = state.editors[0]
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT
  const instance = ViewletManager.create(
    ViewletManager.getModule,
    id,
    'Main',
    editor.uri,
    left,
    top,
    width,
    height
  )
  const tabLabel = Workspace.pathBaseName(editor.uri)
  const tabTitle = getTabTitle(editor.uri)
  RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'Main',
    /* method */ 'openViewlet',
    /* id */ id,
    /* tabLabel */ tabLabel,
    /* tabTitle */ tabTitle
  )
  // TODO race condition: Viewlet may have been resized before it has loaded
  await ViewletManager.load(instance)
}

export const openUri = async (state, uri) => {
  Assert.object(state)
  Assert.string(uri)
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT

  for (const editor of state.editors) {
    if (editor.uri === uri) {
      const instance = ViewletManager.create(
        ViewletManager.getModule,
        id,
        'Main',
        uri,
        left,
        top,
        width,
        height
      )
      await ViewletManager.load(instance)
      return
    }
  }
  const instance = ViewletManager.create(
    ViewletManager.getModule,
    id,
    'Main',
    uri,
    left,
    top,
    width,
    height
  )
  const oldActiveIndex = state.activeIndex
  state.editors.push({ uri })
  state.activeIndex = state.editors.length - 1
  const tabLabel = Workspace.pathBaseName(uri)
  const tabTitle = getTabTitle(uri)
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'Main',
    /* method */ 'openViewlet',
    /* id */ id,
    /* tabLabel */ tabLabel,
    /* tabTitle */ tabTitle,
    /* oldActiveIndex */ oldActiveIndex
  )
  return ViewletManager.load(instance)
}

export const save = () => {
  // TODO handle different types of editors / custom editors / webviews
  Command.execute(/* EditorSave.editorSave */ 378)
}

// const getEditor = (uri) => {
//   const protocol = 'file://' + uri.slice(0, 0)
//   switch (protocol) {
//     case 'file://':
//       // TODO open normal editor
//       break
//     case 'performance://monitor':
//       return import('../EditorPerformance.js')
//     case 'performance://startup':
//       return import('../EditorPerformanceStartup.js')
//     default:
//       // ask extension host for custom editor
//       break
//   }
// }

export const openEditorWithType = async (file) => {
  // TODO resolve custom editors from extension host
  // then open extension host custom editor or normal editor
}

export const saveWithoutFormatting = async () => {
  console.warn('not implemented')
}

export const handleDrop = async () => {
  console.log(['main drop'])
  const clipBoardText = await SharedProcess.invoke(
    /* ClipBoard.read */ 'ClipBoard.read'
  )
  console.log({ clipBoardText })
}

export const closeActiveEditor = (state) => {
  if (!state.activeEditor) {
  }
}

export const closeAllEditors = (state) => {
  RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'Main',
    /* method */ 'dispose'
  )
  state.editors = []
  state.focusedIndex = -1
  state.selectedIndex = -1
  // TODO should call dispose method, but only in renderer-worker
  delete Viewlet.state.instances.EditorText
}

export const dispose = () => {}

export const closeEditor = async (state, index) => {
  if (state.editors.length === 1) {
    closeAllEditors(state)
    return
  }
  const top = state.top
  const left = state.left
  const width = state.width
  const height = state.height
  if (index === state.activeIndex) {
    const oldActiveIndex = state.activeIndex
    state.editors.splice(index, 1)
    const newActiveIndex = index === 0 ? index : index - 1
    Viewlet.dispose('EditorText')
    state.activeIndex = newActiveIndex
    state.focusedIndex = newActiveIndex
    // const instance = Viewlet.create(id, 'uri', left, top, width, height)
    // TODO ideally content would load synchronously and there would be one layout and one paint for opening the new tab
    // except in the case where the content takes long (>100ms) to load, then it should show the tab
    // and for the content a loading spinner or (preferred) a progress bar
    // that it replaced with the actual content once it has been loaded
    // await instance.factory.refresh(instance.state, {
    //   uri: previousEditor.uri,
    //   top: instance.state.top,
    //   left: instance.state.left,
    //   height: instance.state.height,
    //   columnWidth: COLUMN_WIDTH,
    // })
    await RendererProcess.invoke(
      /* Main.closeOneTab */ 2164,
      /* closeIndex */ oldActiveIndex,
      /* focusIndex */ newActiveIndex
    )
    return
  }
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'Main',
    /* method */ 'closeOneTabOnly',
    /* closeIndex */ index
  )
  state.editors.splice(index, 1)
  if (index < state.activeIndex) {
    state.activeIndex--
  }
  state.focusedIndex = state.activeIndex

  // TODO just close the tab
}

export const closeFocusedTab = (state) => {
  closeEditor(state.focusedIndex)
}

export const handleTabContextMenu = async (state, index, x, y) => {
  state.focusedIndex = index
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ 'tab'
  )
}

export const focusIndex = (state, index) => {
  if (index === state.activeIndex) {
    console.log('index', index, ' is already active index')
    return
  }
  const oldActiveIndex = state.activeIndex
  state.activeIndex = index

  const editor = state.editors[index]
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT

  const viewlet = ViewletManager.create(
    ViewletManager.getModule,
    id,
    'Main',
    editor.uri,
    left,
    top,
    width,
    height
  )

  // TODO race condition
  RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'Main',
    /* method */ 'focusAnotherTab',
    /* unFocusIndex */ oldActiveIndex,
    /* focusIndex */ state.activeIndex
  )
  return ViewletManager.load(viewlet)
}

export const focusFirst = (state) => {
  return focusIndex(state, 0)
}

export const focusLast = (state) => {
  return focusIndex(state, state.editors.length - 1)
}

export const focusPrevious = (state) => {
  const previousIndex =
    state.activeIndex === 0 ? state.editors.length - 1 : state.activeIndex - 1
  return focusIndex(state, previousIndex)
}

export const focusNext = (state) => {
  const nextIndex =
    state.activeIndex === state.editors.length - 1 ? 0 : state.activeIndex + 1
  return focusIndex(state, nextIndex)
}

export const handleTabClick = (state, index) => {
  console.log('focus index', index)
  return focusIndex(state, index)
}

export const closeOthers = async (state) => {
  if (state.focusedIndex === state.activeIndex) {
    // view is kept the same, only tabs are closed
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Main',
      /* method */ 'closeOthers',
      /* keepIndex */ state.focusedIndex,
      /* focusIndex */ state.focusedIndex
    )
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Main',
      /* method */ 'closeOthers',
      /* keepIndex */ state.focusedIndex,
      /* focusIndex */ state.focusedIndex
    )
  }
  state.editors = [state.editors[state.focusedIndex]]
  state.activeIndex = 0
  state.focusedIndex = 0
}

export const closeTabsRight = async (state) => {
  if (state.focusedIndex >= state.activeIndex) {
    // view is kept the same, only tabs are closed
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Main',
      /* method */ 'closeTabsRight',
      /* index */ state.focusedIndex
    )
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Main',
      /* method */ 'closeTabsRight',
      /* index */ state.focusedIndex
    )
  }
  state.editors = state.editors.slice(0, state.focusedIndex + 1)
  state.activeIndex = state.focusedIndex
}

export const closeTabsLeft = async (state) => {
  if (state.focusedIndex <= state.activeIndex) {
    // view is kept the same, only tabs are closed
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Main',
      /* method */ 'closeTabsLeft',
      /* index */ state.focusedIndex
    )
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Main',
      /* method */ 'closeTabsLeft',
      /* index */ state.focusedIndex
    )
  }
  state.editors = state.editors.slice(state.focusedIndex)
  state.activeIndex = state.focusedIndex
}

export const resize = (state, dimensions) => {
  const top = dimensions.top + TAB_HEIGHT
  const left = dimensions.left
  const width = dimensions.width
  const height = dimensions.height - TAB_HEIGHT
  const childDimensions = {
    top,
    left,
    width,
    height,
  }
  const commands = Viewlet.resize('EditorText', childDimensions)
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands,
  }
}
