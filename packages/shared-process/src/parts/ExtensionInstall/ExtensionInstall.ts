import * as ExtensionInstallParseInput from '../ExtensionInstallParseInput/ExtensionInstallParseInput.ts'
import * as ExtensionInstallType from '../ExtensionInstallType/ExtensionInstallType.ts'

const getModule = (type: any): any => {
  switch (type) {
    case ExtensionInstallType.GithubRepository:
      return import('../ExtensionInstallFromGitHub/ExtensionInstallFromGitHub.ts')
    case ExtensionInstallType.Url:
      return import('../ExtensionInstallFromUrl/ExtensionInstallFromUrl.ts')
    case ExtensionInstallType.File:
      return import('../ExtensionInstallFromFile/ExtensionInstallFromFile.ts')
    default:
      throw new Error('module not found')
  }
}

export const install = async (input: any): Promise<any> => {
  const parsed = ExtensionInstallParseInput.parse(input)
  if (parsed.type === ExtensionInstallType.ParsingError) {
    throw new Error(`Cannot install ${input}: ${parsed.options.message}`)
  }
  const module = await getModule(parsed.type)
  // @ts-ignore
  await module.install(parsed.options)
}
