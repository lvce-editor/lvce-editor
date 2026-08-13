import * as LanguageServer from './LanguageServer.ts'

export const name = 'LanguageServer'

export const Commands = {
  codeAction: LanguageServer.codeAction,
  complete: LanguageServer.complete,
  definition: LanguageServer.definition,
  diagnostic: LanguageServer.diagnostic,
  dispose: LanguageServer.dispose,
  format: LanguageServer.format,
  references: LanguageServer.references,
}
