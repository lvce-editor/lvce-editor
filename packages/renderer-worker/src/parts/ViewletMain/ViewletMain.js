import * as Arrays from '../Arrays/Arrays.js'
import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as LifeCyclePhase from '../LifeCyclePhase/LifeCyclePhase.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletTabs from '../ViewletTabs/ViewletTabs.js'
import * as Workspace from '../Workspace/Workspace.js'

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
  // @ts-ignore
  await openUri(state, restoredEditor.uri)
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
    backgroundTabs: [],
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

export const save = () => {
  // TODO call save method of focused editor
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

export const closeActiveEditor = (state) => {
  if (!state.activeEditor) {
  }
}

const getId = (editor) => {
  return ViewletMap.getId(editor.uri)
}

export const dispose = () => {}

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

export const render = [...ViewletTabs.render]
