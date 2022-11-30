// based on https://github.com/conwnet/github1s/blob/master/extensions/github1s/src/interfaces/github-api-rest.ts

import * as Ajax from '../Ajax/Ajax.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as Platform from '../Platform/Platform.js'

const encodeFilePath = (filePath) => {
  return filePath
    .split(PathSeparatorType.Slash)
    .map((segment) => encodeURIComponent(segment))
    .join(PathSeparatorType.Slash)
}

export const readGitHubFile = async (owner, repo, fileSha) => {
  return 'Not implemented'
}

export const readGithubFileWithUrl = (githubUrl) => {
  return Ajax.getJson(githubUrl)
}

export const readFile = (owner, repo, path) => {
  const githubApiUrl = Platform.getGithubApiUrl()
  const url = `${githubApiUrl}/repos/${owner}/${repo}/contents/${path}`
  return Ajax.getJson(url)
}

export const readGitHubDirectory = (owner, repo, ref, path) => {
  const githubApiUrl = Platform.getGithubApiUrl()
  const url = `${githubApiUrl}/repos/${owner}/${repo}/git/trees/${ref}${encodeFilePath(
    path
  ).replace(/^\//, ':')}`
  return Ajax.getJson(url)
}
