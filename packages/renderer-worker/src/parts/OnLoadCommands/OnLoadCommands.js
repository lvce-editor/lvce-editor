import * as Ajax from '../Ajax/Ajax.js'
import * as Command from '../Command/Command.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const defaultDependencies = {
  executeCommand: Command.execute,
  getJson: Ajax.getJson,
}

export const getOnLoadCommands = async (assetDir, getJson = Ajax.getJson) => {
  const commands = await getJson(`${assetDir}/config/onLoadCommands.json`)
  if (!Array.isArray(commands)) {
    throw new TypeError('on-load commands must be an array')
  }
  return commands
}

export const executeOnLoadCommands = async (commands, executeCommand = Command.execute) => {
  for (const item of commands) {
    const { args = [], command } = item
    if (typeof command !== 'string') {
      throw new TypeError('on-load command must have a command string')
    }
    if (!Array.isArray(args)) {
      throw new TypeError(`on-load command arguments for ${command} must be an array`)
    }
    await executeCommand('ExtensionHost.executeCommand', command, ...args)
  }
}

export const run = async (assetDir, platform, dependencies = defaultDependencies) => {
  if (platform !== PlatformType.Web) {
    return
  }
  const commands = await getOnLoadCommands(assetDir, dependencies.getJson)
  await executeOnLoadCommands(commands, dependencies.executeCommand)
}
