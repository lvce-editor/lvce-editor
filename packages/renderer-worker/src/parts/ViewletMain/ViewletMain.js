import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.js'
import * as BackgroundTabs from '../BackgroundTabs/BackgroundTabs.js'
import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as LifeCyclePhase from '../LifeCyclePhase/LifeCyclePhase.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

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

const canBeRestored = (editor) => {
  return FileSystem.canBeRestored(editor.uri)
}

const getMainEditors = (state) => {
  if (!state) {
    return []
  }
  const { editors } = state
  if (!editors) {
    return []
  }
  // TODO check that type is string (else runtime error occurs and page is blank)
  return editors.filter(canBeRestored)
}

const hydrateLazy = async () => {
  // TODO this should be in extension host
  await Command.execute(
    /* EditorDiagnostics.hydrate */ 'EditorDiagnostics.hydrate'
  )
}

export const name = ViewletModuleId.Main

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

const getRestoredEditors = (savedState) => {
  if (Workspace.isTest()) {
    return []
  }
  const restoredEditors = getMainEditors(savedState)
  return restoredEditors
}

export const saveState = (state) => {
  const { editors } = state
  return { editors }
}

export const loadContent = (state, savedState) => {
  // TODO get restored editors from saved state
  const editors = getRestoredEditors(savedState)
  // @ts-ignore
  LifeCycle.once(LifeCyclePhase.Twelve, hydrateLazy)
  const activeIndex = editors.length > 0 ? 0 : -1
  return {
    ...state,
    editors,
    activeIndex,
  }
}

export const getChildren = (state) => {
  const { editors } = state
  if (editors.length === 0) {
    return []
  }
  const editor = editors[0]
  return [
    // {
    //   id: ViewletModuleId.MainTabs,
    // },
  ]
}

// TODO content loaded should return commands which
// get picked up by viewletlayout and sent to renderer process
export const contentLoaded = async (state) => {
  if (state.editors.length === 0) {
    return []
  }
  const editor = Arrays.last(state.editors)
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT
  const id = ViewletMap.getId(editor.uri)
  const tabLabel = Workspace.pathBaseName(editor.uri)
  const tabTitle = getTabTitle(editor.uri)
  const commands = [
    [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Main,
      /* method */ 'openViewlet',
      /* tabLabel */ tabLabel,
      /* tabTitle */ tabTitle,
    ],
  ]

  // // TODO race condition: Viewlet may have been resized before it has loaded
  // // @ts-ignore
  const extraCommands = await ViewletManager.load(
    {
      getModule: ViewletModule.load,
      id,
      // @ts-ignore
      parentId: ViewletModuleId.Main,
      uri: editor.uri,
      left,
      top,
      width,
      height,
      show: false,
      focus: false,
      type: 0,
      setBounds: false,
      visible: true,
    },
    /* focus */ false,
    /* restore */ true
  )
  commands.push(...extraCommands)
  commands.push(['Viewlet.appendViewlet', ViewletModuleId.Main, id])
  return commands
}

export const openUri = async (state, uri, focus = true) => {
  console.log('MAIN OPEN URI')
  Assert.object(state)
  Assert.string(uri)
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT
  const id = ViewletMap.getId(uri)

  for (const editor of state.editors) {
    if (editor.uri === uri) {
      console.log('found existing editor')
      // TODO if the editor is already open, nothing needs to be done
      const instance = ViewletManager.create(
        ViewletModule.load,
        id,
        ViewletModuleId.Main,
        uri,
        left,
        top,
        width,
        height
      )
      // @ts-ignore

      await ViewletManager.load(instance, focus)
      return state
    }
  }

  console.log('CREATE INSTANCE 2')
  const instance = ViewletManager.create(
    ViewletModule.load,
    id,
    ViewletModuleId.Main,
    uri,
    left,
    top,
    width,
    height
  )
  const oldActiveIndex = state.activeIndex
  const temporaryUri = `tmp://${Math.random()}`
  state.editors.push({ uri: temporaryUri })
  state.activeIndex = state.editors.length - 1
  const tabLabel = Workspace.pathBaseName(uri)
  const tabTitle = getTabTitle(uri)
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ ViewletModuleId.Main,
    /* method */ 'openViewlet',
    /* tabLabel */ tabLabel,
    /* tabTitle */ tabTitle,
    /* oldActiveIndex */ oldActiveIndex
  )
  // @ts-ignore
  await ViewletManager.load(instance, focus)
  if (!ViewletStates.hasInstance(id)) {
    return state
  }
  const actualUri = ViewletStates.getState(id).uri
  const index = state.editors.findIndex((editor) => editor.uri === temporaryUri)
  state.editors[index].uri = actualUri
  return state
}

export const openBackgroundTab = async (state, initialUri, props) => {
  const id = ViewletMap.getId(initialUri)
  const tabLabel = 'Loading'
  const tabTitle = 'Loading'
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ ViewletModuleId.Main,
    /* method */ 'openViewlet',
    /* tabLabel */ tabLabel,
    /* tabTitle */ tabTitle,
    /* oldActiveIndex */ -1,
    /* background */ true
  )
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT
  const { title, uri } = await ViewletManager.backgroundLoad({
    getModule: ViewletModule.load,
    id,
    left,
    top,
    width,
    height,
    props,
  })

  state.editors.push({ uri })
  BackgroundTabs.add(uri, { uri, title, ...props })
  await RendererProcess.invoke('Viewlet.send', 'Main', 'updateTab', 1, title)
  // TODO update tab title with new title
  return state
}

export const save = () => {
  // TODO handle different types of editors / custom editors / webviews
  Command.execute(/* EditorSave.editorSave */ 'Editor.save')
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
  const { editors, activeIndex } = state
  if (activeIndex === -1) {
    return state
  }
  return closeEditor(state, activeIndex)
}

const getId = (editor) => {
  return ViewletMap.getId(editor.uri)
}

export const closeAllEditors = async (state) => {
  RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ ViewletModuleId.Main,
    /* method */ 'dispose'
  )
  const ids = state.editors.map(getId)
  state.editors = []
  state.focusedIndex = -1
  state.selectedIndex = -1
  // TODO should call dispose method, but only in renderer-worker
  for (const id of ids) {
    await ViewletStates.dispose(id)
  }
  return state
}

export const dispose = () => {}

export const closeEditor = async (state, index) => {
  console.log('close', index, 'of', state.editors)
  if (state.editors.length === 1) {
    console.log('close all')
    return closeAllEditors(state)
  }
  const top = state.top
  const left = state.left
  const width = state.width
  const height = state.height
  if (index === state.activeIndex) {
    const oldActiveIndex = state.activeIndex
    const oldEditor = state.editors[index]
    state.editors.splice(index, 1)
    const newActiveIndex = index === 0 ? index : index - 1
    const id = ViewletMap.getId(oldEditor.uri)
    Viewlet.dispose(id)
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
      /* Main.closeOneTab */ 'Main.closeOneTab',
      /* closeIndex */ oldActiveIndex,
      /* focusIndex */ newActiveIndex
    )
    return state
  }
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ ViewletModuleId.Main,
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
  return closeEditor(state.focusedIndex)
}

export const handleTabContextMenu = async (state, index, x, y) => {
  state.focusedIndex = index
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.Tab
  )
}

export const focusIndex = async (state, index) => {
  if (index === state.activeIndex) {
    return state
  }
  const oldActiveIndex = state.activeIndex
  state.activeIndex = index

  const editor = state.editors[index]
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT
  const id = ViewletMap.getId(editor.uri)

  const oldEditor = state.editors[oldActiveIndex]
  const oldId = ViewletMap.getId(oldEditor.uri)
  const oldInstance = ViewletStates.getInstance(oldId)

  const viewlet = ViewletManager.create(
    ViewletModule.load,
    id,
    ViewletModuleId.Main,
    editor.uri,
    left,
    top,
    width,
    height
  )

  // TODO race condition
  RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ ViewletModuleId.Main,
    /* method */ 'focusAnotherTab',
    /* unFocusIndex */ oldActiveIndex,
    /* focusIndex */ state.activeIndex
  )

  if (BackgroundTabs.has(editor.uri)) {
    console.log('has background true')
    const props = BackgroundTabs.get(editor.uri)
    // @ts-ignore
    await ViewletManager.load(viewlet, false, false, props)
  } else {
    console.log('has background false')
    // @ts-ignore
    await ViewletManager.load(viewlet)
  }

  if (oldInstance && oldInstance.factory.hide) {
    await oldInstance.factory.hide(oldInstance.state)
    console.log({ oldInstance })
    BackgroundTabs.add(oldInstance.state.uri, oldInstance.state)
  }
  return state
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
      /* id */ ViewletModuleId.Main,
      /* method */ 'closeOthers',
      /* keepIndex */ state.focusedIndex,
      /* focusIndex */ state.focusedIndex
    )
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Main,
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
      /* id */ ViewletModuleId.Main,
      /* method */ 'closeTabsRight',
      /* index */ state.focusedIndex
    )
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Main,
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
      /* id */ ViewletModuleId.Main,
      /* method */ 'closeTabsLeft',
      /* index */ state.focusedIndex
    )
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Main,
      /* method */ 'closeTabsLeft',
      /* index */ state.focusedIndex
    )
  }
  state.editors = state.editors.slice(state.focusedIndex)
  state.activeIndex = state.focusedIndex
}

export const resize = (state, dimensions) => {
  const { editors } = state
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
  const editor = editors[0]
  let commands = []
  if (editor) {
    const id = ViewletMap.getId(editor.uri)
    commands = Viewlet.resize(id, childDimensions)
  }
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands,
  }
}

export const hasFunctionalRender = true

export const render = []
