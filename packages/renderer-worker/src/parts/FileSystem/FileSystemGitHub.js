// based on https://github.com/conwnet/github1s/blob/master/extensions/github1s/src/interfaces/github-api-rest.ts

import * as GitHubRestApi from '../GitHubRestApi/GitHubRestApi.js'
import * as Command from '../Command/Command.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as GitHubDirentType from '../GitHubDirentType/GitHubDirentType.js'
import * as DirentType from '../DirentType/DirentType.js'

export const name = 'GitHub'

export const state = {
  cache: Object.create(null),
}

const getGitHubFile = async (path) => {
  const parts = path.split(PathSeparatorType.Slash)
  const [owner, repo, ...rest] = parts
  const relativePath = rest.join(PathSeparatorType.Slash) // TODO many times split/join a bit unnecessary
  const githubFile = await GitHubRestApi.readFile(owner, repo, relativePath)
  // TODO what if it is not a file but a folder?
  return githubFile
}

export const readFile = async (path) => {
  const githubFile = await getGitHubFile(path)
  if (githubFile.encoding !== 'base64') {
    throw new Error('unsupported encoding')
  }
  return Command.execute(
    /* Base64.decode */ 'Base64.decode',
    /* encoded */ githubFile.content
  )
}

const getType = (githubType) => {
  switch (githubType) {
    case GitHubDirentType.Tree:
      return DirentType.Directory
    case GitHubDirentType.Blob:
      return DirentType.File
    default:
      return DirentType.Unknown
  }
}

const toDirent = (githubDirent) => {
  return {
    name: githubDirent.path,
    type: getType(githubDirent.type),
  }
}

const toDirents = (githubResponse) => {
  return githubResponse.tree.map(toDirent)
}

export const readDirWithFileTypes = async (path) => {
  const parts = path.split(PathSeparatorType.Slash)
  const [owner, repo, ...rest] = parts
  const relativePath =
    PathSeparatorType.Slash + rest.join(PathSeparatorType.Slash) // TODO many times split/join a bit unnecessary
  // TODO handle reading real directory
  const githubDirents = await GitHubRestApi.readGitHubDirectory(
    owner,
    repo,
    'HEAD',
    relativePath
  )
  state.cache[path] = githubDirents
  const dirents = toDirents(githubDirents)
  return dirents
}

export const getBlobUrl = async (path) => {
  const githubFile = await getGitHubFile(path)
  return githubFile.download_url
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}
