import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchPtyHost from '../LaunchPtyHost/LaunchPtyHost.ts'
import * as PtyHostState from '../PtyHostState/PtyHostState.ts'

interface Generation {
  readonly connections: Set<number>
  readonly promise: Promise<any>
}
let current: Generation | undefined
let nextId = 0
const connections = new Map<number, Generation>()

const getGeneration = (method: any): Generation => {
  if (current) return current
  const generation: Generation = {
    connections: new Set(),
    promise: LaunchPtyHost.launchPtyHost(method),
  }
  current = generation
  PtyHostState.state.ptyHostPromise = generation.promise
  void generation.promise.then(
    (ipc) => {
      if (current === generation) PtyHostState.state.ipc = ipc
    },
    () => {
      if (current === generation) detach()
    },
  )
  return generation
}

const detach = (): void => {
  current = undefined
  PtyHostState.state.ipc = undefined
  PtyHostState.state.ptyHostPromise = undefined
}

export const getOrCreate = (method: any = IpcParentType.NodeForkedProcess): any => {
  return getGeneration(method).promise
}

export const acquire = (method: any): any => {
  const generation = getGeneration(method)
  const id = ++nextId
  generation.connections.add(id)
  connections.set(id, generation)
  return { id, promise: generation.promise }
}

export const release = (id: number): void => {
  const generation = connections.get(id)
  if (!generation) return
  connections.delete(id)
  generation.connections.delete(id)
  if (generation.connections.size) return
  if (current === generation) detach()
  void generation.promise.then((ipc) => ipc.dispose()).catch(() => {})
}

export const getCurrentInstance = (): any => PtyHostState.state.ipc

export const disposeAll = (): void => {
  const generation = current
  detach()
  if (!generation) return
  for (const id of generation.connections) connections.delete(id)
  generation.connections.clear()
  void generation.promise.then((ipc) => ipc.dispose()).catch(() => {})
}

export const invoke = (method: any, ...params: any): any => {
  return JsonRpc.invoke(PtyHostState.state.ipc, method, ...params)
}
