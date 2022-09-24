export const InstallType = {
  Url: 1,
  GithubRepository: 2,
  ParsingError: 3,
}

const parseUrlGithub = (input) => {
  const parts = input.split('/')
  const slashCount = parts.length
  if (slashCount === 5) {
    const user = parts[3]
    const repo = parts[4]
    return {
      type: InstallType.GithubRepository,
      options: {
        user,
        repo,
        branch: 'HEAD',
      },
    }
  }
  if (slashCount === 7) {
    const user = parts[3]
    const repo = parts[4]
    const type = parts[5]
    const commit = parts[6]
    if (type === 'tree') {
      return {
        type: InstallType.GithubRepository,
        options: {
          user,
          repo,
          branch: commit,
        },
      }
    }
    if (type === 'pull') {
      return {
        type: InstallType.ParsingError,
        options: {
          message: 'Cannot download from Pull Request',
        },
      }
    }
  }
  return {
    type: InstallType.ParsingError,
    options: {
      message: 'Failed to parse github url',
    },
  }
}

const parseUrl = (input) => {
  if (input.startsWith('https://github.com')) {
    return parseUrlGithub(input)
  }
  if (input.endsWith('.tar.br')) {
    return {
      type: InstallType.Url,
      options: {
        url: input,
      },
    }
  }
  return {
    type: InstallType.ParsingError,
    options: {
      message: 'Failed to parse url',
    },
  }
}

export const parse = (input) => {
  if (input.startsWith('https://')) {
    return parseUrl(input)
  }
  return {
    type: InstallType.ParsingError,
    options: {
      message: 'Failed to parse input',
    },
  }
}
