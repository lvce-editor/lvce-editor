export const name = 'Memory'

export const state = {
  files: Object.create(null),
}

const getDirent = (uri) => {
  return state.files[uri]
}

export const readFile = (uri) => {
  const dirent = getDirent(uri)
  if (!dirent) {
    throw new Error(`File not found: ${uri}`)
  }
  if (dirent.type !== 'file') {
    throw new Error('file is a directory')
  }
  return dirent.content
}

const ensureParentDir = (uri) => {
  let startIndex = 0
  let endIndex = uri.indexOf('/')
  while (endIndex >= 0) {
    const part = uri.slice(startIndex, endIndex + 1)
    state.files[part] = {
      type: 'directory',
      content: '',
    }
    endIndex = uri.indexOf('/', endIndex + 1)
  }
}

export const writeFile = (uri, content) => {
  const dirent = getDirent(uri)
  if (dirent) {
    dirent.content = content
  } else {
    ensureParentDir(uri)
    state.files[uri] = {
      type: 'file',
      content,
    }
  }
}

export const mkdir = (uri) => {
  if (!uri.endsWith('/')) {
    uri += '/'
  }
  ensureParentDir(uri)
  state.files[uri] = {
    type: 'directory',
    content: '',
  }
}

export const getPathSeparator = () => {
  return '/'
}

export const remove = (uri) => {
  const toDelete = []
  for (const key of Object.keys(state.files)) {
    if (key.startsWith(uri)) {
      toDelete.push(key)
    }
  }
  for (const key of toDelete) {
    delete state.files[key]
  }
}

export const readDirWithFileTypes = (uri) => {
  if (!uri.endsWith('/')) {
    uri += '/'
  }
  const dirents = []
  for (const [key, value] of Object.entries(state.files)) {
    if (key.startsWith(uri)) {
      switch (value.type) {
        case 'directory':
          if (
            key.slice(0, -1).indexOf('/', uri.length) === -1 &&
            key !== `${uri}/` &&
            key !== uri
          ) {
            dirents.push({
              type: value.type,
              name: key.slice(uri.length, -1),
            })
          }
          break
        case 'file':
          if (key.indexOf('/', uri.length + 1) === -1) {
            dirents.push({
              type: value.type,
              name: key.slice(uri.length),
            })
          }

          break
        default:
          break
      }
    }
  }
  return dirents
}
