import * as Command from '../Command/Command.js'
import * as Exit from '../Exit/Exit.js'
import * as Process from '../Process/Process.js'
import * as PromptTrace from '../PromptTrace/PromptTrace.js'

const promptFlag = '--prompt'
const promptWithValuePrefix = `${promptFlag}=`
const allowReadFlag = '--allow-read'
const allowWriteFlag = '--allow-write'
const backendUrlFlag = '--backend-url'
const unknownErrorCode = 'E_UNKNOWN'

const parseFlagValue = (argv, flag) => {
  const prefix = `${flag}=`
  for (let index = 1; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === flag) {
      return typeof argv[index + 1] === 'string' ? argv[index + 1] : ''
    }
    if (typeof argument === 'string' && argument.startsWith(prefix)) {
      return argument.slice(prefix.length)
    }
  }
  return undefined
}

export const parsePrompt = (argv) => {
  for (let index = 1; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === promptFlag) {
      return typeof argv[index + 1] === 'string' ? argv[index + 1] : ''
    }
    if (typeof argument === 'string' && argument.startsWith(promptWithValuePrefix)) {
      return argument.slice(promptWithValuePrefix.length)
    }
  }
  return undefined
}

export const getPrompt = async () => {
  const argv = await Process.getArgv()
  return parsePrompt(argv)
}

export const parsePromptOptions = (argv) => {
  const prompt = parsePrompt(argv)
  if (prompt === undefined) {
    return undefined
  }
  const allowReadRoot = parseFlagValue(argv, allowReadFlag)
  const allowWriteRoot = parseFlagValue(argv, allowWriteFlag)
  const backendUrl = parseFlagValue(argv, backendUrlFlag)
  return {
    ...(allowReadRoot !== undefined && { allowReadRoot }),
    ...(allowWriteRoot !== undefined && { allowWriteRoot }),
    ...(backendUrl !== undefined && { backendUrl }),
    prompt,
  }
}

export const getPromptOptions = async () => {
  const argv = await Process.getArgv()
  return parsePromptOptions(argv)
}

const getFileSystemAccess = ({ allowReadRoot, allowWriteRoot }) => {
  if (allowReadRoot === undefined && allowWriteRoot === undefined) {
    return undefined
  }
  if (allowReadRoot !== undefined && allowReadRoot !== '.') {
    throw new TypeError('--allow-read currently only supports the workspace root "."')
  }
  if (allowWriteRoot !== undefined && allowWriteRoot !== '.') {
    throw new TypeError('--allow-write currently only supports the workspace root "."')
  }
  return {
    allowRead: allowReadRoot === '.' || allowWriteRoot === '.',
    allowWrite: allowWriteRoot === '.',
    root: '.',
  }
}

const getFinalAssistantMessage = (task) => {
  if (!task || !Array.isArray(task.events)) {
    return ''
  }
  for (let index = task.events.length - 1; index >= 0; index--) {
    const event = task.events[index]
    if (event?.type === 'assistant-message' && typeof event.text === 'string') {
      return event.text
    }
  }
  return ''
}

const getErrorMessage = (error) => {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

const getErrorCode = (error) => {
  if (!error || typeof error !== 'object') {
    return unknownErrorCode
  }
  return typeof error.code === 'string' && error.code ? error.code : unknownErrorCode
}

const getAccessToken = (authState) => {
  if (typeof authState?.authAccessToken === 'string') {
    return authState.authAccessToken
  }
  return typeof authState?.accessToken === 'string' ? authState.accessToken : ''
}

const getCommandArguments = (prompt, fileSystemAccess, accessToken) => {
  if (accessToken) {
    return [prompt, undefined, fileSystemAccess, accessToken]
  }
  if (fileSystemAccess) {
    return [prompt, undefined, fileSystemAccess]
  }
  return [prompt]
}

export const run = async (promptOrOptions, authState) => {
  const options = typeof promptOrOptions === 'string' ? { prompt: promptOrOptions } : promptOrOptions
  const prompt = options?.prompt
  const accessToken = getAccessToken(authState)
  const id = PromptTrace.createId()
  const startedAt = new Date().toISOString()
  let errorCode = ''
  let errorMessage = ''
  let fileSystemAccess
  let result
  try {
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new TypeError('Prompt must be a non-empty string')
    }
    fileSystemAccess = getFileSystemAccess(options)
    const commandArguments = getCommandArguments(prompt, fileSystemAccess, accessToken)
    result = await Command.execute('ExtensionHost.executeCommand', 'chat2.runPrompt', ...commandArguments)
    if (result?.status !== 'completed') {
      throw new Error(result?.error || 'Chat task failed without an error message')
    }
    const finalMessage = getFinalAssistantMessage(result.task)
    if (finalMessage) {
      await Process.writeStdout(`${finalMessage}\n`)
    }
  } catch (error) {
    errorCode = typeof result?.errorCode === 'string' && result.errorCode ? result.errorCode : getErrorCode(error)
    errorMessage = getErrorMessage(error)
    await Process.writeStderr(`${errorMessage}\n`)
  }
  try {
    const trace = PromptTrace.create({
      error: errorMessage,
      errorCode,
      finishedAt: new Date().toISOString(),
      fileSystemAccess,
      id,
      prompt,
      result,
      startedAt,
    })
    const tracePath = await PromptTrace.write(trace)
    if (errorMessage) {
      await Process.writeStderr(`Trace: ${tracePath}\n`)
    }
  } catch (error) {
    errorCode ||= getErrorCode(error)
    errorMessage ||= getErrorMessage(error)
    await Process.writeStderr(`Failed to write agent trace: ${getErrorMessage(error)}\n`)
  }
  await Exit.exit(errorMessage ? 1 : 0)
}
