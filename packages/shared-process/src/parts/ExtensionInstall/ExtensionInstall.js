import * as ExtensionInstallParseInput from '../ExtensionInstallParseInput/ExtensionInstallParseInput.js'
import * as ExtensionInstallType from '../ExtensionInstallType/ExtensionInstallType.js'

const getModule = (type) => {
  switch (type) {
    case ExtensionInstallType.GithubRepository:
      return import(
        '../ExtensionInstallFromGitHub/ExtensionInstallFromGitHub.js'
      )
    case ExtensionInstallType.Url:
      return import('../ExtensionInstallFromUrl/ExtensionInstallFromUrl.js')
    case ExtensionInstallType.File:
      return import('../ExtensionInstallFromFile/ExtensionInstallFromFile.js')
    default:
      throw new Error('module not found')
  }
}

export const install = async (input) => {
  const parsed = ExtensionInstallParseInput.parse(input)
  if (parsed.type === ExtensionInstallType.ParsingError) {
    throw new Error(`Cannot install ${input}: ${parsed.options.message}`)
  }
  const module = await getModule(parsed.type)
  // @ts-ignore
  await module.install(parsed.options)
}
