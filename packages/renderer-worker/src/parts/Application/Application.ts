import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as Command from '../Command/Command.js'
import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export interface ApplicationOptions {
  readonly height: number
  readonly href: string
  readonly id: string
  readonly rootId: string
  readonly width: number
  readonly workspacePath: string
  readonly workspaceUri: string
}

const disposals = new Map<string, Promise<void>>()

const initialize = async (options: ApplicationOptions, layoutUid: number): Promise<number> => {
  const commands = await ViewletManager.load(
    {
      applicationId: options.id,
      getModule: ViewletModule.load,
      id: ViewletModuleId.Layout,
      type: 0,
      uid: layoutUid,
      uri: '',
      show: false,
      focus: false,
    },
    false,
    false,
    {
      Layout: { bounds: { windowWidth: options.width, windowHeight: options.height } },
      restore: false,
    },
  )
  const initialCommands = commands.filter((command) => command[0] !== 'Viewlet.setDom2')
  initialCommands.push(['Viewlet.appendToRoot', layoutUid, options.rootId])
  initialCommands.push(['Viewlet.setBounds', layoutUid, 0, 0, options.width, options.height])
  await RendererProcess.invoke('Viewlet.executeCommands', initialCommands)
  for (const part of ['Main', 'SideBar', 'SecondarySideBar', 'Panel', 'ActivityBar', 'StatusBar', 'TitleBar']) {
    await ViewletManager.executeForApplication(options.id, `Layout.load${part}IfVisible`)
  }
  return layoutUid
}

// Internal host entry point; normal workbench startup still owns its existing layout.
export const create = async (options: ApplicationOptions): Promise<number> => {
  if (!options.rootId || !Number.isFinite(options.width) || !Number.isFinite(options.height) || options.width <= 0 || options.height <= 0) {
    throw new Error('Invalid application root or dimensions')
  }
  const layoutUid = Id.create()
  ApplicationRegistry.create({
    id: options.id,
    layoutUid,
    href: options.href,
    workspacePath: options.workspacePath,
    workspaceUri: options.workspaceUri,
  })
  try {
    return await ApplicationRegistry.track(options.id, () => initialize(options, layoutUid))
  } catch (error) {
    try {
      await dispose(options.id)
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], `Failed to create application ${options.id}`)
    }
    throw error
  }
}

export const execute = (applicationId: string, command: string, ...args: readonly any[]): Promise<any> => {
  const application = ApplicationRegistry.assertOpen(applicationId)
  switch (command) {
    case 'Workspace.getUri':
    case 'Workspace.getWorkspaceUri':
      return Promise.resolve(application.workspaceUri)
    case 'Workspace.getPath':
    case 'Workspace.getWorkspacePath':
      return Promise.resolve(application.workspacePath)
    case 'Layout.getHref':
      return Promise.resolve(application.href)
    case 'Preferences.get':
    case 'Preferences.update':
      return Promise.resolve(Command.execute(command, ...args))
    default:
      return ApplicationRegistry.track(applicationId, () => ViewletManager.executeForApplication(applicationId, command, ...args))
  }
}

export const executeForView = (uid: number, command: string, ...args: readonly any[]): Promise<any> => {
  const applicationId = ApplicationRegistry.getOwner(uid)
  if (applicationId === undefined) {
    if (!ViewletStates.getByUid(uid)) {
      return Promise.reject(new Error(`Component not found: ${uid}`))
    }
    return Promise.resolve(Command.execute(command, ...args))
  }
  return execute(applicationId, command, ...args)
}

export const resize = (applicationId: string, width: number, height: number): Promise<void> => {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error('Invalid application dimensions')
  }
  return ApplicationRegistry.track(applicationId, async () => {
    const { layoutUid } = ApplicationRegistry.get(applicationId)
    await execute(applicationId, 'Layout.handleResize', width, height)
    await RendererProcess.invoke('Viewlet.setBounds', layoutUid, 0, 0, width, height)
  })
}

const disposeApplication = async (applicationId: string): Promise<void> => {
  ApplicationRegistry.close(applicationId)
  await ApplicationRegistry.waitForOperations(applicationId)
  const errors: unknown[] = []
  for (const uid of [...ApplicationRegistry.getUids(applicationId)].reverse()) {
    try {
      if (ViewletStates.getByUid(uid)) {
        await Viewlet.dispose(uid)
      } else {
        await RendererProcess.invoke('Viewlet.dispose', uid)
      }
    } catch (error) {
      errors.push(error)
      ViewletStates.remove(uid)
    }
  }
  ApplicationRegistry.remove(applicationId)
  if (errors.length > 0) {
    throw new AggregateError(errors, `Failed to dispose application ${applicationId}`)
  }
}

export const dispose = (applicationId: string): Promise<void> => {
  const existing = disposals.get(applicationId)
  if (existing) {
    return existing
  }
  const operation = disposeApplication(applicationId)
  disposals.set(applicationId, operation)
  const result = operation.finally(() => disposals.delete(applicationId))
  disposals.set(applicationId, result)
  return result
}
