import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const latestIntents = new Map()

const getKey = (editorUid, kind) => `${editorUid}:${kind}`

const isCurrent = (request) => {
  const current = latestIntents.get(getKey(request.editorUid, request.kind))
  return current?.intentSequence === request.intentSequence && current?.instanceId === request.instanceId
}

const recordIntent = (request) => {
  const key = getKey(request.editorUid, request.kind)
  const current = latestIntents.get(key)
  if (current && current.intentSequence > request.intentSequence) {
    return false
  }
  latestIntents.set(key, {
    instanceId: request.instanceId,
    intentSequence: request.intentSequence,
  })
  return true
}

const dispose = async (rendererUid) => {
  await RendererProcess.invoke('Viewlet.sendMultiple', [['Viewlet.dispose', rendererUid]])
}

const orderCommands = (rendererUid, commands) => {
  const focusCommands = []
  const contentCommands = []
  for (const command of commands) {
    if (command[0] === 'Viewlet.focusSelector') {
      focusCommands.push(command)
    } else {
      contentCommands.push(command)
    }
  }
  return [
    ['Viewlet.createFunctionalRoot', 'FindWidget', rendererUid, true],
    ...contentCommands,
    ['Viewlet.appendToBody', rendererUid],
    ...focusCommands,
  ]
}

export const allocateRendererId = () => {
  return Id.create()
}

export const attach = async (request) => {
  if (!recordIntent(request)) {
    await dispose(request.rendererUid)
    return false
  }
  if (!isCurrent(request)) {
    await dispose(request.rendererUid)
    return false
  }
  const commands = orderCommands(request.rendererUid, request.commands)
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  if (!isCurrent(request)) {
    await dispose(request.rendererUid)
    return false
  }
  return true
}

export const remove = async (request) => {
  recordIntent(request)
  await dispose(request.rendererUid)
}

export const update = async (request) => {
  if (!isCurrent(request)) {
    return false
  }
  await RendererProcess.invoke('Viewlet.sendMultiple', request.commands)
  return isCurrent(request)
}

export const removeMany = async (requests) => {
  for (const request of requests) {
    recordIntent(request)
  }
  if (requests.length === 0) {
    return
  }
  await RendererProcess.invoke(
    'Viewlet.sendMultiple',
    requests.map((request) => ['Viewlet.dispose', request.rendererUid]),
  )
}

export const reset = () => {
  latestIntents.clear()
}
