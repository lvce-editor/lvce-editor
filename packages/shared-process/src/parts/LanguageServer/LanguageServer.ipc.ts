import * as LanguageServer from './LanguageServer.ts'

export const name = 'LanguageServer'

export const Commands = {
  complete: LanguageServer.complete,
  diagnostic: LanguageServer.diagnostic,
}
