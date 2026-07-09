import * as ExtensionInstallType from '../ExtensionInstallType/ExtensionInstallType.ts'
import * as Path from '../Path/Path.ts'
import * as ParseUrlGithub from '../ParseUrlGithub/ParseUrlGithub.ts'

const parseUrl = (input) => {
  if (input.startsWith('https://github.com')) {
    return ParseUrlGithub.parseUrlGithub(input)
  }
  if (input.endsWith('.tar.br')) {
    return {
      type: ExtensionInstallType.Url,
      options: {
        url: input,
      },
    }
  }
  return {
    type: ExtensionInstallType.ParsingError,
    options: {
      message: 'Failed to parse url',
    },
  }
}

const parseFile = (input) => {
  return {
    type: ExtensionInstallType.File,
    options: {
      path: input,
    },
  }
}

export const parse = (input) => {
  if (input.startsWith('https://')) {
    return parseUrl(input)
  }
  if (input.startsWith('.')) {
    return parseFile(input)
  }
  if (Path.isAbsolute(input)) {
    return parseFile(input)
  }
  return {
    type: ExtensionInstallType.ParsingError,
    options: {
      message: 'Failed to parse input',
    },
  }
}
