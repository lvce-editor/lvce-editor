import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import workers from '../Workers/Workers.json' with { type: 'json' }

const owners = new WeakMap()
const names = new Map()

export const registerViewlet = (create, workerId) => {
  owners.set(create, workerId)
}

export const registerWorker = (url, name) => {
  if (typeof url !== 'string' || typeof name !== 'string') {
    return
  }
  for (const worker of workers) {
    if (url.endsWith(worker.fileName) || url === GetConfiguredWorkerUrl.getConfiguredWorkerUrl(worker.settingName, '')) {
      names.set(worker.id, name)
    }
  }
}

export const getName = (factory, moduleId) => {
  const workerId = owners.get(factory.create) || (moduleId === 'Editor' ? 'editor' : undefined)
  if (!workerId) {
    return undefined
  }
  const name = names.get(workerId)
  if (!name) {
    throw new Error(`Component worker not found: ${workerId}`)
  }
  return name
}
