import * as ExtensionInstallType from '../ExtensionInstallType/ExtensionInstallType.ts'

export const parseUrlGithub = (input: any): any => {
  const parts = input.split('/')
  const slashCount = parts.length
  if (slashCount === 5) {
    const user = parts[3]
    const repo = parts[4]
    return {
      options: {
        branch: 'HEAD',
        repo,
        user,
      },
      type: ExtensionInstallType.GithubRepository,
    }
  }
  if (slashCount === 7) {
    const user = parts[3]
    const repo = parts[4]
    const type = parts[5]
    const commit = parts[6]
    if (type === 'tree') {
      return {
        options: {
          branch: commit,
          repo,
          user,
        },
        type: ExtensionInstallType.GithubRepository,
      }
    }
    if (type === 'pull') {
      return {
        options: {
          message: 'Cannot download from Pull Request',
        },
        type: ExtensionInstallType.ParsingError,
      }
    }
  }

  if (input.includes('/releases/download')) {
    return {
      options: {
        url: input,
      },
      type: ExtensionInstallType.Url,
    }
  }
  return {
    options: {
      message: 'Failed to parse github url',
    },
    type: ExtensionInstallType.ParsingError,
  }
}
