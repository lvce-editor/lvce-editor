import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as Assert from '../Assert/Assert.js'
import { CancelationError } from '../Errors/CancelationError.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

export const modules = Object.create(null)

const ViewletState = {
  Default: 0,
  ModuleLoaded: 1,
  ContentLoaded: 2,
  RendererProcessViewletLoaded: 3,
  ContentRendered: 4,
  Appended: 5,
}

export const getModule = (id) => {
  console.assert(typeof id === 'string')
  switch (id) {
    // TODO use numeric identifier instead
    case 'Explorer':
      return import('../Viewlet/ViewletExplorer.js')
    case 'Run and Debug':
      return import('../Viewlet/ViewletRunAndDebug.js')
    case 'Search':
      return import('../Viewlet/ViewletSearch.js')
    case 'Source Control':
      return import('../Viewlet/ViewletSourceControl.js')
    case 'Terminal':
      return import('../Viewlet/ViewletTerminal.js')
    case 'Debug Console':
      return import('../Viewlet/ViewletDebugConsole.js')
    case 'Extensions':
      return import('../Viewlet/ViewletExtensions.js')
    case 'Output':
      return import('../Viewlet/ViewletOutput.js')
    case 'Problems':
      return import('../Viewlet/ViewletProblems.js')
    case 'Noop':
      return import('../Viewlet/ViewletNoop.js')
    case 'EditorText':
      return import('../Viewlet/ViewletEditorText.js')
    case 'EditorPlainText':
      return import('../Viewlet/ViewletEditorPlainText.js')
    case 'EditorImage':
      return import('../Viewlet/ViewletEditorImage.js')
    case 'Clock':
      return import('../Viewlet/ViewletClock.js')
    case 'ActivityBar':
      return import('../Viewlet/ViewletActivityBar.js')
    case 'Panel':
      return import('../Viewlet/ViewletPanel.js')
    case 'SideBar':
      return import('../Viewlet/ViewletSideBar.js')
    case 'TitleBar':
      return import('../Viewlet/ViewletTitleBar.js')
    case 'StatusBar':
      return import('../Viewlet/ViewletStatusBar.js')
    case 'Main':
      return import('../Viewlet/ViewletMain.js')
    case 'EditorCompletion':
      return import('../Viewlet/ViewletEditorCompletion.js')
    case 'References':
      return import('../Viewlet/ViewletReferences.js')
    case 'Implementations':
      return import('../Viewlet/ViewletImplementations.js')
    default:
      // TODO use ErrorHandling.handleError instead
      throw new Error(`unknown viewlet: "${id}", ${id === 'Output'}`)
  }
}

/**
 *
 * @param {()=>any} getModule
 * @returns
 */
export const create = (
  getModule,
  id,
  parentId,
  uri,
  left,
  top,
  width,
  height
) => {
  Assert.fn(getModule)
  Assert.string(id)
  Assert.string(parentId)
  Assert.string(uri)
  Assert.number(left)
  Assert.number(top)
  Assert.number(width)
  Assert.number(height)
  return {
    type: 0,
    getModule,
    id,
    parentId,
    uri,
    left,
    top,
    width,
    height,
  }
}

// TODO add lots of unit tests for this
/**
 *
 * @param {{getModule:()=>any, type:number, id:string, disposed:boolean }} viewlet
 * @returns
 */
export const load = async (viewlet, focus = false) => {
  // console.time(`load/${viewlet.id}`)
  if (viewlet.type !== 0) {
    console.log('viewlet must be empty')
    throw new Error('viewlet must be empty')
  }
  let state = ViewletState.Default
  let module
  try {
    viewlet.type = 1
    if (viewlet.disposed) {
      return
    }

    module = await viewlet.getModule(viewlet.id)
    if (viewlet.disposed) {
      return
    }
    state = ViewletState.ModuleLoaded
    const viewletState = module.create(
      viewlet.id,
      viewlet.uri,
      viewlet.left,
      viewlet.top,
      viewlet.width,
      viewlet.height
    )

    const oldVersion =
      viewletState.version === undefined ? undefined : ++viewletState.version
    let newState = await module.loadContent(viewletState)
    if (viewletState.version !== oldVersion) {
      newState = viewletState
      console.log('version mismatch')
      // TODO not sure if Object.assign is a good idea
      // Object.assign(viewletState, newState)
    }
    if (viewlet.disposed) {
      return
    }
    state = ViewletState.ContentLoaded

    await RendererProcess.invoke(
      /* Viewlet.load */ 'Viewlet.load',
      /* id */ viewlet.id
    )
    if (viewlet.disposed) {
      // TODO unload the module from renderer process
      return
    }
    // TODO race condition: viewlet state may have been updated again in the mean time
    state = ViewletState.RendererProcessViewletLoaded

    outer: if (module.shouldApplyNewState) {
      for (let i = 0; i < 2; i++) {
        if (module.shouldApplyNewState(newState)) {
          Viewlet.state.instances[viewlet.id] = {
            state: newState,
            factory: module,
          }
          break outer
        }
        newState = await module.loadContent(viewletState)
      }
      throw new Error('viewlet could not be updated')
    } else {
      Viewlet.state.instances[viewlet.id] = {
        state: newState,
        factory: module,
      }
    }

    if (viewletState !== newState) {
      await module.contentLoaded(newState)
    }

    if (module.hasFunctionalRender) {
      const commands = module.render(viewletState, newState)
      await RendererProcess.invoke(
        /* Viewlet.sendMultiple */ 'Viewlet.sendMultiple',
        /* commands */ commands
      )
    }

    if (module.contentLoadedEffects) {
      module.contentLoadedEffects(newState)
    }
    if (viewlet.disposed) {
      // TODO unload the module from renderer process
      return
    }
    state = ViewletState.ContentRendered
    if (viewlet.parentId) {
      await RendererProcess.invoke(
        /* Viewlet.append */ 'Viewlet.appendViewlet',
        /* parentId */ viewlet.parentId,
        /* id */ viewlet.id,
        /* focus */ focus
      )
    }
    state = ViewletState.Appended

    // TODO race condition
    // outer: if (module.shouldApplyNewState) {
    //   for (let i = 0; i < 2; i++) {
    //     if (module.shouldApplyNewState(newState)) {
    //       Viewlet.state.instances[viewlet.id] = {
    //         state: newState,
    //         factory: module,
    //       }
    //       break outer
    //     }
    //     newState = await module.loadContent(viewletState)
    //   }
    //   throw new Error('viewlet could not be updated')
    // }

    if (module.events) {
      // TODO remove event listeners when viewlet is disposed
      for (const [key, value] of Object.entries(module.events)) {
        const handleUpdate = async () => {
          const instance = Viewlet.state.instances[viewlet.id]
          const newState = await value(instance.state)
          if (!module.shouldApplyNewState(newState)) {
            console.log('[viewlet manager] return', newState)

            return
          }
          const commands = module.render(instance.state, newState)
          instance.state = newState
          await RendererProcess.invoke(
            /* Viewlet.sendMultiple */ 'Viewlet.sendMultiple',
            /* commands */ commands
          )
        }
        GlobalEventBus.addListener(key, handleUpdate)
      }
    }

    if (viewlet.disposed) {
      // TODO unload the module from renderer process
      return
    }
  } catch (error) {
    if (error && error instanceof CancelationError) {
      return
    }
    viewlet.type = 4
    console.error(error)
    try {
      if (module && module.handleError) {
        return await module.handleError(error)
      }
      if (state < ViewletState.RendererProcessViewletLoaded) {
        await RendererProcess.invoke(
          /* Viewlet.load */ 'Viewlet.load',
          /* id */ viewlet.id
        )
      }
      if (state < ViewletState.Appended && viewlet.parentId) {
        await RendererProcess.invoke(
          /* Viewlet.append */ 'Viewlet.appendViewlet',
          /* parentId */ viewlet.parentId,
          /* id */ viewlet.id
        )
      }
      console.log({ error })
      await RendererProcess.invoke(
        /* viewlet.handleError */ 'Viewlet.handleError',
        /* id */ viewlet.id,
        /* parentId */ viewlet.parentId,
        /* message */ `${error}`
      )
    } catch (error) {
      console.error(error)
      // this is really bad
      // probably can only show an alert at this point
    }
  }
  // console.timeEnd(`load/${viewlet.id}`)
}

export const dispose = async (id) => {
  state[id].disposed = true
  delete Viewlet.state.instances[id]
  delete state[id]
  await RendererProcess.invoke(
    /* Viewlet.dispose */ 'Viewlet.dispose',
    /* id */ id
  )
}

export const mutate = async (id, fn) => {
  // TODO handle race conditions here
  const viewletState = state[id]
  await fn(state)
}
