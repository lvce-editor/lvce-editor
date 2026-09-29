import * as ComponentStateWorker from '../ComponentStateWorker/ComponentStateWorker.js'
import * as DirentType from '../DirentType/DirentType.js'

export const name = 'ComponentState'

export const readFile = (uri) => ComponentStateWorker.invoke('ComponentState.readFile', uri)

export const writeFile = (uri, content) => ComponentStateWorker.invoke('ComponentState.writeFile', uri, content)

export const readDirWithFileTypes = (uri) => ComponentStateWorker.invoke('ComponentState.readDirWithFileTypes', uri)

export const exists = (uri) => ComponentStateWorker.invoke('ComponentState.exists', uri)

export const stat = async (uri) => ({
  exists: await exists(uri),
  type: DirentType.File,
})

export const isReadonly = (uri) => ComponentStateWorker.invoke('ComponentState.isReadonly', uri)

export const canBeRestored = true

export const rename = async () => {
  throw new Error('Renaming component state is not allowed')
}

export const remove = async () => {
  throw new Error('Removing component state is not allowed')
}

export const mkdir = async () => {
  throw new Error('Creating component state directories is not allowed')
}
