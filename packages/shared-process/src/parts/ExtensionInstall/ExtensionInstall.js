import * as ExtensionInstallParseInput from '../ExtensionInstallParseInput/ExtensionInstallParseInput.js'

const getModule = (type) => {
  switch (type) {
    case ExtensionInstallParseInput.InstallType.GithubRepository:
      return import(
        '../ExtensionInstallFromGitHub/ExtensionInstallFromGitHub.js'
      )
    case ExtensionInstallParseInput.InstallType.Url:
      return import('../ExtensionInstallFromUrl/ExtensionInstallFromUrl.js')
    default:
      throw new Error('module not found')
  }
}

export const install = async (input) => {
  const parsed = ExtensionInstallParseInput.parse(input)
  if (parsed.type === ExtensionInstallParseInput.InstallType.ParsingError) {
    throw new Error(`Failed to parse input: ${parsed.options.message}`)
  }
  console.log({ parsed })
  const module = await getModule(parsed.type)
  // @ts-ignore
  await module.install(parsed.options)
}
