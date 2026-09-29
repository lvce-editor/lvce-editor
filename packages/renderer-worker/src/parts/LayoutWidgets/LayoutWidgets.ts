import * as ViewletLayoutRenderDom from '../ViewletLayout/ViewletLayoutRenderDom.ts'
import type { LayoutState, WidgetReference } from '../ViewletLayout/LayoutState.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'

const setWidgetsCommand = 'Viewlet.setWidgets'

const getLayoutForUid = (uid: number): any => {
  const applicationId = ApplicationRegistry.getOwner(uid)
  if (applicationId !== undefined) {
    return ViewletStates.getInstance(ApplicationRegistry.get(applicationId).layoutUid)
  }
  return ViewletStates.getValues().find(
    (instance) => instance.moduleId === ViewletModuleId.Layout && ApplicationRegistry.getOwner(instance.state.uid) === undefined,
  )
}

const getWidgets = (state: LayoutState, parentUid: number): readonly number[] => {
  return (state.widgetReferences || []).filter((widget) => widget.parentUid === parentUid).map((widget) => widget.uid)
}

const arraysEqual = (a: readonly number[], b: readonly number[]): boolean => {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

const widgetReferencesEqual = (a: readonly WidgetReference[] = [], b: readonly WidgetReference[] = []): boolean => {
  return a.length === b.length && a.every((value, index) => value.parentUid === b[index].parentUid && value.uid === b[index].uid)
}

const collectDescendants = (state: LayoutState, parentUid: number, result: number[], retainedUids?: ReadonlySet<number>): void => {
  for (const widget of state.widgetReferences || []) {
    if (widget.parentUid === parentUid && !result.includes(widget.uid) && !retainedUids?.has(widget.uid)) {
      result.push(widget.uid)
      collectDescendants(state, widget.uid, result, retainedUids)
    }
  }
}

export const setWidgets = (
  state: LayoutState,
  parentUid: number,
  revision: number,
  widgetUids: readonly number[],
): { readonly accepted: boolean; readonly newState: LayoutState; readonly removedUids: readonly number[] } => {
  const previousRevision = state.widgetRevisions?.[parentUid] ?? -1
  const previousWidgets = getWidgets(state, parentUid)
  if (revision < previousRevision || (revision === previousRevision && !arraysEqual(previousWidgets, widgetUids))) {
    return {
      accepted: false,
      newState: state,
      removedUids: [],
    }
  }
  if (revision === previousRevision) {
    return {
      accepted: true,
      newState: state,
      removedUids: [],
    }
  }
  const nextWidgetSet = new Set(widgetUids)
  const directlyRemovedUids = previousWidgets.filter((uid) => !nextWidgetSet.has(uid))
  const removedUids: number[] = []
  for (const uid of directlyRemovedUids) {
    removedUids.push(uid)
    collectDescendants(state, uid, removedUids, nextWidgetSet)
  }
  const removedSet = new Set(removedUids)
  const widgetReferences: WidgetReference[] = (state.widgetReferences || []).filter(
    (widget) => widget.parentUid !== parentUid && !removedSet.has(widget.parentUid) && !removedSet.has(widget.uid),
  )
  for (const uid of widgetUids) {
    widgetReferences.push({ parentUid, uid })
  }
  return {
    accepted: true,
    newState: {
      ...state,
      widgetReferences,
      widgetRevisions: {
        ...state.widgetRevisions,
        [parentUid]: revision,
      },
    },
    removedUids,
  }
}

export const removeWidgets = (state: LayoutState, parentUid: number): { readonly newState: LayoutState; readonly removedUids: readonly number[] } => {
  const removedUids: number[] = []
  collectDescendants(state, parentUid, removedUids)
  const removedSet = new Set(removedUids)
  removedSet.add(parentUid)
  return {
    newState: {
      ...state,
      widgetReferences: (state.widgetReferences || []).filter((widget) => !removedSet.has(widget.parentUid) && !removedSet.has(widget.uid)),
      widgetRevisions: {
        ...state.widgetRevisions,
        [parentUid]: Number.MAX_SAFE_INTEGER,
      },
    },
    removedUids,
  }
}

const isFocusCommand = (command: readonly any[]): boolean => {
  return typeof command[0] === 'string' && command[0].toLowerCase().includes('focus')
}

const getCommandUid = (command: readonly any[]): number | undefined => {
  if (command[0] === 'Viewlet.create' || command[0] === 'Viewlet.createFunctionalRoot') {
    return command[2]
  }
  if (typeof command[1] === 'number') {
    return command[1]
  }
  return undefined
}

const disposeWidgetInstance = (uid: number): void => {
  const instance = ViewletStates.getInstance(uid)
  if (instance?.factory?.dispose) {
    void instance.factory.dispose(instance.state)
  }
  ViewletStates.remove(uid)
  if (instance?.moduleId && ViewletStates.getInstance(instance.moduleId) === instance) {
    ViewletStates.remove(instance.moduleId)
  }
  ApplicationRegistry.release(uid)
}

const updateLayout = (oldState: LayoutState, newState: LayoutState): any[] => {
  if (oldState === newState) {
    return []
  }
  const layout = ViewletStates.getInstance(oldState.uid)
  layout.state = newState
  layout.renderedState = newState
  if (
    widgetReferencesEqual(oldState.widgetReferences, newState.widgetReferences) &&
    oldState.mountedViewletsBySource === newState.mountedViewletsBySource
  ) {
    return []
  }
  return ViewletLayoutRenderDom.renderDom(oldState, newState)
}

const reconcileForLayout = (commands: readonly (readonly any[])[], declarations: readonly (readonly any[])[], layout: any): any[] => {
  const declarationSet = new Set(declarations)
  const oldLayoutState: LayoutState = layout.state
  let newLayoutState = oldLayoutState
  const removedUids: number[] = []
  const orphanUids = new Set<number>()
  const acceptedDeclaredUids = new Set<number>()
  const staleCommandUids = new Set<number>()
  const staleOrphanUids = new Set<number>()

  for (const declaration of declarations) {
    const [, parentUid, revision, widgetUids] = declaration
    const result = setWidgets(newLayoutState, parentUid, revision, widgetUids)
    if (result.accepted) {
      if (newLayoutState.applicationId !== undefined) {
        for (const uid of widgetUids) {
          ApplicationRegistry.own(newLayoutState.applicationId, uid)
        }
      }
      newLayoutState = result.newState
      removedUids.push(...result.removedUids)
      for (const uid of widgetUids) {
        acceptedDeclaredUids.add(uid)
      }
      continue
    }
    const registeredUids = new Set((newLayoutState.widgetReferences || []).map((widget) => widget.uid))
    for (const uid of widgetUids) {
      staleCommandUids.add(uid)
      if (!registeredUids.has(uid)) {
        staleOrphanUids.add(uid)
      }
    }
  }

  for (const uid of acceptedDeclaredUids) {
    staleCommandUids.delete(uid)
    staleOrphanUids.delete(uid)
  }
  const finalRegisteredUids = new Set((newLayoutState.widgetReferences || []).map((widget) => widget.uid))
  for (const uid of finalRegisteredUids) {
    staleOrphanUids.delete(uid)
  }

  for (const command of commands) {
    if ((command[0] === 'Viewlet.create' || command[0] === 'Viewlet.createFunctionalRoot') && staleOrphanUids.has(command[2])) {
      orphanUids.add(command[2])
    }
  }

  const regularCommands = commands.filter((command) => {
    if (declarationSet.has(command)) {
      return false
    }
    const uid = getCommandUid(command)
    return typeof uid !== 'number' || !staleCommandUids.has(uid)
  })
  const focusCommands = regularCommands.filter(isFocusCommand)
  const contentCommands = regularCommands.filter((command) => !isFocusCommand(command) && command[0] !== 'Viewlet.dispose')
  const existingDisposeCommands = regularCommands.filter((command) => command[0] === 'Viewlet.dispose')
  const layoutCommands = updateLayout(oldLayoutState, newLayoutState)
  const uidsToDispose = [...new Set([...removedUids, ...orphanUids])].filter((uid) => !finalRegisteredUids.has(uid))
  for (const uid of uidsToDispose) {
    disposeWidgetInstance(uid)
  }
  const disposeCommands = uidsToDispose.map((uid) => ['Viewlet.dispose', uid])
  return [...contentCommands, ...layoutCommands, ...existingDisposeCommands, ...disposeCommands, ...focusCommands]
}

export const reconcile = (commands: readonly (readonly any[])[]): any[] => {
  const declarationsByLayout = new Map<any, (readonly any[])[]>()
  const declaredLayouts = new Map<number, number>()
  const parents = new Map<number, number>()
  for (const command of commands) {
    if (command[0] === setWidgetsCommand) {
      for (const uid of command[3]) {
        parents.set(uid, command[1])
      }
    }
  }
  const resolveLayout = (uid: number): any => {
    const visited = new Set<number>()
    while (ApplicationRegistry.getOwner(uid) === undefined && parents.has(uid)) {
      if (visited.has(uid)) {
        throw new Error(`Cyclic widget ownership: ${uid}`)
      }
      visited.add(uid)
      uid = parents.get(uid)!
    }
    return getLayoutForUid(uid)
  }
  for (const command of commands) {
    if (command[0] !== setWidgetsCommand) {
      continue
    }
    const layout = resolveLayout(command[1])
    if (!layout) {
      continue
    }
    for (const uid of command[3]) {
      const owner = ApplicationRegistry.getOwner(uid)
      if (owner !== undefined && owner !== layout.state.applicationId) {
        throw new Error(`Component ${uid} already belongs to application ${owner}`)
      }
      const declaredLayout = declaredLayouts.get(uid)
      if (declaredLayout !== undefined && declaredLayout !== layout.state.uid) {
        throw new Error(`Component ${uid} is declared by multiple applications`)
      }
      declaredLayouts.set(uid, layout.state.uid)
    }
    const declarations = declarationsByLayout.get(layout) || []
    declarations.push(command)
    declarationsByLayout.set(layout, declarations)
  }
  let result = [...commands]
  for (const [layout, declarations] of declarationsByLayout) {
    result = reconcileForLayout(result, declarations, layout)
  }
  return result.filter((command) => command[0] !== setWidgetsCommand)
}

export const removeOwnedWidgets = (parentUid: number): any[] => {
  const layout = getLayoutForUid(parentUid)
  if (!layout) {
    return []
  }
  const oldState: LayoutState = layout.state
  const { newState, removedUids } = removeWidgets(oldState, parentUid)
  const commands: (readonly any[])[] = [...updateLayout(oldState, newState)]
  for (const uid of removedUids) {
    disposeWidgetInstance(uid)
    commands.push(['Viewlet.dispose', uid])
  }
  return commands
}

export const removeWidget = (uid: number): any[] => {
  const layout = getLayoutForUid(uid)
  if (!layout) {
    return [['Viewlet.dispose', uid]]
  }
  const oldState: LayoutState = layout.state
  const widget = (oldState.widgetReferences || []).find((reference) => reference.uid === uid)
  if (!widget) {
    disposeWidgetInstance(uid)
    return [['Viewlet.dispose', uid]]
  }
  const widgetUids = getWidgets(oldState, widget.parentUid).filter((widgetUid) => widgetUid !== uid)
  const revision = (oldState.widgetRevisions?.[widget.parentUid] ?? -1) + 1
  const { newState, removedUids } = setWidgets(oldState, widget.parentUid, revision, widgetUids)
  const commands = [...updateLayout(oldState, newState)]
  for (const removedUid of removedUids) {
    disposeWidgetInstance(removedUid)
    commands.push(['Viewlet.dispose', removedUid])
  }
  return commands
}

export const declareWidget = (parentUid: number, uid: number, commands: readonly (readonly any[])[]): any[] => {
  const layout = getLayoutForUid(parentUid)
  if (!layout) {
    return [...commands]
  }
  const revision = (layout.state.widgetRevisions?.[parentUid] ?? -1) + 1
  return reconcile([...commands, [setWidgetsCommand, parentUid, revision, [uid]]])
}
