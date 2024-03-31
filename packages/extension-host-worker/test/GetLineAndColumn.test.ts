import { expect, test } from '@jest/globals'
import * as GetLineAndColumn from '../src/parts/GetLineAndColumn/GetLineAndColumn.ts'

test('getLineAndColumn - empty string', () => {
  const text = ''
  const start = 0
  const end = 0
  expect(GetLineAndColumn.getLineAndColumn(text, start, end)).toEqual({ line: 0, column: 0 })
})

test('getLineAndColumn', () => {
  const text =
    "import * as DevtoolsCommandType from '../DevtoolsCommandType/DevtoolsCommandType.ts'\nimport { DevtoolsProtocolError } from '../DevtoolsProtocolError/DevtoolsProtocolError.ts'\nimport * as UnwrapDevtoolsEvaluateResult from '../UnwrapDevtoolsEvaluateResult/UnwrapDevtoolsEvaluateResult.ts'\n\n/**\n *\n * @param {{expression:string, contextId?:string, generatePreview?:boolean, returnByValue?:boolean, uniqueContextId?:string, allowUnsafeEvalBlockedByCSP?:boolean, arguments?:any[], awaitPromise?:boolean, replMode?:boolean}} options\n * @returns\n */\nexport const evaluate = async (rpc, options) => {\n  const rawResult = await rpc.invoke(DevtoolsCommandType.RuntimeEvaluate, options)\n  if ('error' in rawResult) {\n    throw new DevtoolsProtocolError(rawResult.error.message)\n  }\n  if ('exceptionDetails' in rawResult.result) {\n    throw new DevtoolsProtocolError(rawResult.result.exceptionDetails.exception.description)\n  }\n  if (rawResult.result.result.subtype === 'error') {\n    throw new DevtoolsProtocolError(rawResult.result.result.description)\n  }\n  const result = UnwrapDevtoolsEvaluateResult.unwrapResult(rawResult)\n  return result\n}\n/**\n *\n * @param {{functionDeclaration:string, objectId?:string, arguments?:any[], uniqueContextId?:string, executionContextId?:number, awaitPromise?:boolean, returnByValue?:boolean}} options\n * @returns\n */\nexport const callFunctionOn = async (rpc, options) => {\n  const rawResult = await rpc.invoke(DevtoolsCommandType.RuntimeCallFunctionOn, options)\n  if ('error' in rawResult) {\n    throw new DevtoolsProtocolError(rawResult.error.message)\n  }\n  if ('exceptionDetails' in rawResult.result) {\n    throw new DevtoolsProtocolError(rawResult.result.exceptionDetails.exception.description)\n  }\n  if (rawResult.result.result.subtype === 'error') {\n    throw new DevtoolsProtocolError(rawResult.result.result.description)\n  }\n  const result = UnwrapDevtoolsEvaluateResult.unwrapResult(rawResult)\n  return result\n}\n\n/**\n *\n * @param {{objectId: string, ownProperties?:boolean, generatePreview?:boolean}} options\n * @returns\n */\nexport const getProperties = async (rpc, options) => {\n  const rawResult = await rpc.invoke(DevtoolsCommandType.RuntimeGetProperties, options)\n  const result = UnwrapDevtoolsEvaluateResult.unwrapResult(rawResult)\n  return result\n}\n\n/**\n */\nexport const enable = async (rpc) => {\n  const rawResult = await rpc.invoke(DevtoolsCommandType.RuntimeEnable)\n  if ('error' in rawResult) {\n    throw new DevtoolsProtocolError(rawResult.error.message)\n  }\n}\n\nexport const runIfWaitingForDebugger = async (rpc) => {\n  const rawResult = await rpc.invoke(DevtoolsCommandType.RuntimeRunIfWaitingForDebugger)\n  if ('error' in rawResult) {\n    throw new DevtoolsProtocolError(rawResult.error.message)\n  }\n}\n"
  const start = 221
  const end = 286
  expect(GetLineAndColumn.getLineAndColumn(text, start, end)).toEqual({ line: 3, column: 0 })
})
