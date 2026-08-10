import * as LanguageServer from './LanguageServer.ts'

export const name = 'LanguageServer'

export const Commands = {
  complete: LanguageServer.complete,
  definition: LanguageServer.definition,
  diagnostic: LanguageServer.diagnostic,
  dispose: LanguageServer.dispose,
}
