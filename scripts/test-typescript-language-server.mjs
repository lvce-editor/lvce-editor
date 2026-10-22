import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  codeAction,
  complete,
  definition,
  diagnostic,
  dispose,
  disposeAll,
  documentSymbols,
  feature,
  references,
} from '../packages/shared-process/src/parts/LanguageServer/LanguageServer.ts'

const temporary = await mkdtemp(join(tmpdir(), 'lvce-ts7-lsp-test-'))
const uri = process.env.LVCE_TYPESCRIPT_SERVER_PATH
  ? pathToFileURL(resolve(process.env.LVCE_TYPESCRIPT_SERVER_PATH)).href
  : 'lvce-language-server:typescript'
const documentUri = pathToFileURL(join(temporary, 'main.ts')).href
const text = 'export function greet(name: string) { return name.toUpperCase() }\nconst value: string = 123\ngreet("hello")\n'
await writeFile(join(temporary, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true }, include: ['*.ts'] }))
await writeFile(join(temporary, 'main.ts'), text)
await writeFile(join(temporary, 'other.ts'), 'import { greet } from "./main";\ngreet("world");\n')
const options = {
  argv: ['--lsp', '--stdio'],
  extensionId: 'typescript-test',
  id: 'typescript-test',
  rootUri: pathToFileURL(temporary).href,
  textDocument: { languageId: 'typescript', text, uri: documentUri },
  uri,
}
try {
  const errors = await diagnostic(options)
  assert(
    errors.some((item) => item.code === 2322),
    'expected type mismatch diagnostic',
  )
  const fixed = text.replace('= 123', '= "valid"')
  assert(
    !(await diagnostic({ ...options, textDocument: { ...options.textDocument, text: fixed } })).some((item) => item.code === 2322),
    'diagnostics must update after edits',
  )
  const completions = await complete({
    ...options,
    offset: 61,
    textDocument: { ...options.textDocument, text: 'const greeting = "hello";\ngreeting.' },
  })
  assert(
    completions.some((item) => item.label === 'toUpperCase'),
    'native string method completions',
  )
  const hover = await feature({ ...options, method: 'hover', offset: 17 })
  assert(hover?.contents, 'native hover')
  const target = await definition({ ...options, offset: text.lastIndexOf('greet') + 1 })
  assert(Array.isArray(target) ? target.length > 0 : target, 'native definition')
  const symbols = await documentSymbols(options)
  assert(
    symbols.some((item) => item.name === 'greet'),
    'native document symbols',
  )
  const refs = await references({ ...options, offset: text.indexOf('greet') + 1 })
  assert(refs.length >= 2, 'project references include another document')
  const prepared = await feature({ ...options, method: 'prepareRename', offset: text.indexOf('greet') + 1 })
  assert(prepared, 'native prepare rename')
  const renamed = await feature({ ...options, method: 'rename', newName: 'hello', offset: text.indexOf('greet') + 1 })
  assert(renamed?.changes || renamed?.documentChanges, 'native workspace rename edits')
  const signatureText = text + 'greet('
  const signature = await feature({
    ...options,
    method: 'signatureHelp',
    offset: signatureText.length,
    textDocument: { ...options.textDocument, text: signatureText },
  })
  assert(signature?.signatures?.length, 'native signature help')
  const actions = await codeAction({ ...options, offset: text.indexOf('123') })
  assert(Array.isArray(actions), 'native code actions')
  dispose('typescript-test')
  assert(
    (await diagnostic(options)).some((item) => item.code === 2322),
    'server restarts after disposal',
  )
  console.log(
    'Verified real TS7: completions, diagnostic edits, hover, definition, symbols, project references, rename, signature help, code actions and restart',
  )
} finally {
  disposeAll()
  await rm(temporary, { force: true, recursive: true })
}
