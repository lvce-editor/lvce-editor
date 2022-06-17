// based on https://github.com/conwnet/github1s/blob/master/extensions/github1s/src/interfaces/github-api-rest.ts

import * as Command from '../Command/Command.js'

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
  return Command.execute(/* Ajax.getJson */ 270, /* url */ githubUrl)
}

export const readFile = (owner, repo, path) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  return Command.execute(/* Ajax.getJson */ 270, /* url */ url)
}

export const readGitHubDirectory = (owner, repo, ref, path) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${ref}${encodeFilePath(
    path
  ).replace(/^\//, ':')}`
  return Command.execute(/* Ajax.getJson */ 270, /* url */ url)
}
