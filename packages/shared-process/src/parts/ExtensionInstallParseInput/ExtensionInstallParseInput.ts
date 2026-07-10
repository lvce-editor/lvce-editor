import * as ExtensionInstallType from '../ExtensionInstallType/ExtensionInstallType.ts'
import * as ParseUrlGithub from '../ParseUrlGithub/ParseUrlGithub.ts'
import * as Path from '../Path/Path.ts'

const parseUrl = (input: any): any => {
  if (input.startsWith('https://github.com')) {
    return ParseUrlGithub.parseUrlGithub(input)
  }
  if (input.endsWith('.tar.br')) {
    return {
      options: {
        url: input,
      },
      type: ExtensionInstallType.Url,
    }
  }
  return {
    options: {
      message: 'Failed to parse url',
    },
    type: ExtensionInstallType.ParsingError,
  }
}

const parseFile = (input: any): any => {
  return {
    options: {
      path: input,
    },
    type: ExtensionInstallType.File,
  }
}

export const parse = (input: any): any => {
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
    options: {
      message: 'Failed to parse input',
    },
    type: ExtensionInstallType.ParsingError,
  }
}
