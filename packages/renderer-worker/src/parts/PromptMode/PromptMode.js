import * as Command from '../Command/Command.js'
import * as Exit from '../Exit/Exit.js'
import * as Process from '../Process/Process.js'

const promptFlag = '--prompt'
const promptWithValuePrefix = `${promptFlag}=`

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

export const run = async (prompt) => {
  try {
    if (!prompt.trim()) {
      throw new TypeError('Prompt must be a non-empty string')
    }
    await Command.execute('ExtensionHost.executeCommand', 'chat2.createSession')
    const task = await Command.execute('ExtensionHost.executeCommand', 'chat2.sendMessage', prompt)
    const finalMessage = getFinalAssistantMessage(task)
    if (finalMessage) {
      await Process.writeStdout(`${finalMessage}\n`)
    }
    await Exit.exit(0)
  } catch (error) {
    await Process.writeStderr(`${getErrorMessage(error)}\n`)
    await Exit.exit(1)
  }
}
