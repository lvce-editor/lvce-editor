import workers from '../Workers/Workers.json' with { type: 'json' }

const requiredMethods = ['create', 'loadContent', 'diff', 'render']
const parameterSources = new Set(['argument', 'context', 'literal', 'result', 'state'])

const validateParameter = (workerId, lifecycleName, parameter) => {
  if (!parameter || typeof parameter !== 'object') {
    throw new TypeError(`invalid ${workerId} viewlet ${lifecycleName} parameter`)
  }
  if (!parameterSources.has(parameter.source)) {
    throw new TypeError(`invalid ${workerId} viewlet ${lifecycleName} parameter source: ${parameter.source}`)
  }
  if (parameter.source !== 'literal' && typeof parameter.name !== 'string') {
    throw new TypeError(`missing ${workerId} viewlet ${lifecycleName} parameter name`)
  }
  if (parameter.spread !== undefined && typeof parameter.spread !== 'boolean') {
    throw new TypeError(`invalid ${workerId} viewlet ${lifecycleName} parameter spread`)
  }
}

const validateMethod = (workerId, lifecycleName, method) => {
  if (!method || typeof method.name !== 'string' || !method.name) {
    throw new TypeError(`missing ${workerId} viewlet ${lifecycleName} method`)
  }
  if (!Array.isArray(method.parameters)) {
    throw new TypeError(`missing ${workerId} viewlet ${lifecycleName} parameters`)
  }
  for (const parameter of method.parameters) {
    validateParameter(workerId, lifecycleName, parameter)
  }
}

export const validateWorkerViewletConfig = (workerId, viewlet) => {
  if (!viewlet || typeof viewlet !== 'object') {
    throw new TypeError(`viewlet configuration not found: ${workerId}`)
  }
  if (typeof viewlet.name !== 'string' || !viewlet.name) {
    throw new TypeError(`missing ${workerId} viewlet name`)
  }
  if (!viewlet.state || (viewlet.state.idKey !== 'id' && viewlet.state.idKey !== 'uid')) {
    throw new TypeError(`invalid ${workerId} viewlet state idKey`)
  }
  for (const option of ['commandReturnStateWhenCommandsEmpty', 'commandSkipRenderWhenDiffEmpty']) {
    if (viewlet[option] !== undefined && typeof viewlet[option] !== 'boolean') {
      throw new TypeError(`invalid ${workerId} viewlet ${option}`)
    }
  }
  if (viewlet.workspaceChangeEvent !== undefined && typeof viewlet.workspaceChangeEvent !== 'string') {
    throw new TypeError(`invalid ${workerId} viewlet workspaceChangeEvent`)
  }
  if (viewlet.workspaceChangeEventPrepend !== undefined && typeof viewlet.workspaceChangeEventPrepend !== 'boolean') {
    throw new TypeError(`invalid ${workerId} viewlet workspaceChangeEventPrepend`)
  }
  for (const lifecycleName of requiredMethods) {
    validateMethod(workerId, lifecycleName, viewlet.methods?.[lifecycleName])
  }
  for (const [lifecycleName, method] of Object.entries(viewlet.methods || {})) {
    validateMethod(workerId, lifecycleName, method)
  }
  for (const output of viewlet.outputs || []) {
    if (!output || typeof output.stateField !== 'string' || !output.stateField) {
      throw new TypeError(`invalid ${workerId} viewlet output`)
    }
    if (output.hotReload !== undefined && typeof output.hotReload !== 'boolean') {
      throw new TypeError(`invalid ${workerId} viewlet output hotReload`)
    }
    validateMethod(workerId, `output ${output.stateField}`, output.method)
  }
  for (const command of viewlet.extraCommands || []) {
    if (!command || typeof command.name !== 'string' || typeof command.method !== 'string' || !viewlet.methods?.[command.method]) {
      throw new TypeError(`invalid ${workerId} viewlet extra command`)
    }
  }
  return viewlet
}

export const getWorkerViewletConfig = (workerId) => {
  const worker = workers.find((candidate) => candidate.id === workerId)
  if (!worker) {
    throw new Error(`worker not found: ${workerId}`)
  }
  return validateWorkerViewletConfig(workerId, worker.viewlet)
}
