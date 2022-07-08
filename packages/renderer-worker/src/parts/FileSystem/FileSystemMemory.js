export const state = {
  files: Object.create(null),
}

const getDirent = (uri) => {
  return state.files[uri]
}

export const readFile = (uri) => {
  const dirent = getDirent(uri)
  if (!dirent) {
    throw new Error('File not found')
  }
  if (dirent.type !== 'file') {
    throw new Error('file is a directory')
  }
  return dirent.content
}

export const writeFile = (uri, content) => {
  const dirent = getDirent(uri)
  if (dirent) {
    dirent.content = content
  } else {
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

    state.files[uri] = {
      type: 'file',
      content,
    }
  }
}

export const getPathSeparator = () => {
  return '/'
}

export const readDirWithFileTypes = (uri) => {
  const dirents = []
  for (const [key, value] of Object.entries(state.files)) {
    if (key.startsWith(uri)) {
      if (
        value.type === 'directory' &&
        key.slice(0, -1).indexOf('/', uri.length) === -1 &&
        key !== `${uri}/` &&
        key !== uri
      ) {
        dirents.push({
          type: value.type,
          name: key.slice(uri.length, -1),
        })
      } else if (
        value.type === 'file' &&
        key.indexOf('/', uri.length + 1) === -1
      ) {
        dirents.push({
          type: value.type,
          name: key.slice(uri.length + 1),
        })
      }
    }
  }
  return dirents
}
