// based on https://github.com/conwnet/github1s/blob/master/extensions/github1s/src/interfaces/github-api-rest.ts

import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'

const encodeFilePath = (filePath) => {
  return filePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

export const readGitHubFile = async (owner, repo, fileSha) => {
  return 'Not implemented'
}

export const readGithubFileWithUrl = (githubUrl) => {
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ githubUrl)
}

export const readFile = (owner, repo, path) => {
  const githubApiUrl = Platform.getGithubApiUrl()
  const url = `${githubApiUrl}/repos/${owner}/${repo}/contents/${path}`
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}

export const readGitHubDirectory = (owner, repo, ref, path) => {
  const githubApiUrl = Platform.getGithubApiUrl()
  const url = `${githubApiUrl}/repos/${owner}/${repo}/git/trees/${ref}${encodeFilePath(
    path
  ).replace(/^\//, ':')}`
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}
