import * as Platform from '../Platform/Platform.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js'
import * as Path from '../Path/Path.js'
import * as FileSystem from '../FileSystem/FileSystem.js'

export const name = 'ExtensionDetail'

export const create = (id, uri) => {
  return {
    name: '',
    uri,
  }
}

const loadReadmeContent = async (path) => {
  const readmeUrl = Path.join('/', path, 'README.md')
  const readmeContent = await FileSystem.readFile(readmeUrl)
  return readmeContent
}

// TODO when there are multiple extension with the same id,
// probably need to pass extension location from extensions viewlet
export const loadContent = async (state) => {
  const { uri } = state
  const id = uri.slice('extension-detail://'.length)
  const extension = await ExtensionManagement.getExtension(id)
  const readmeContent = await loadReadmeContent(extension.path)
  console.log({ readmeContent })
  // const extensionsPath = Platform.getExtensionsPath()
  // const builtinExtensionsPath = Platform.getBuiltinExtensionsPath()

  console.log({ state })
  return {
    ...state,
    name: id,
  }
}

export const hasFunctionalRender = true

const renderName = {
  isEqual(oldState, newState) {
    return oldState.name === newState.name
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ExtensionDetail',
      /* method */ 'setName',
      /* name */ newState.name,
    ]
  },
}

export const render = [renderName]
