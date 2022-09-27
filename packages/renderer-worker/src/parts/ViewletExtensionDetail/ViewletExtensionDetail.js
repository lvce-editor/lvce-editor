import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as MarkDown from '../Markdown/Markdown.js'
import * as Path from '../Path/Path.js'
import * as SanitizeHtml from '../SanitizeHtml/SanitizeHtml.js'

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
  const readmeHtml = MarkDown.toHtml(readmeContent)
  const sanitzedReadmeHtml = await SanitizeHtml.sanitizeHtml(readmeHtml)
  console.log({ sanitzedReadmeHtml })
  return {
    ...state,
    name: id,
    sanitzedReadmeHtml,
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

const renderReadme = {
  isEqual(oldState, newState) {
    return oldState.sanitzedReadmeHtml === newState.sanitzedReadmeHtml
  },
  apply(pldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ExtensionDetail',
      /* method */ 'setReadmeHtml',
      /* html */ newState.sanitzedReadmeHtml,
    ]
  },
}

export const render = [renderName, renderReadme]
