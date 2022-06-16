import { createWriteStream, mkdirSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import * as Platform from '../Platform/Platform.js'
import * as Assert from '../Assert/Assert.js'

export const state = {
  /**
   * @type {string[]}
   */
  outputChannels: [],
}

/**
 * @deprecated
 * @returns
 */
export const createOutputChannel = async ({ id }) => {
  // state.outputChannels.push(id)
  // const outPath = join(Platform.getLogsDir(), 'extensions', `${id}.txt`)
  // await mkdir(dirname(outPath), { recursive: true })
  // console.log({ outPath })
  // const writeStream = createWriteStream(outPath)
  return {
    append() {
      // TODO
    },
  }
}

const getOutputChannelInfo = (outputChannel) => {
  return {
    id: outputChannel.id,
    path: outputChannel.path,
  }
}

export const getOutputChannels = () => {
  return state.outputChannels.map(getOutputChannelInfo)
}

export const registerOutputChannel = (outputChannel) => {
  Assert.string(outputChannel.id)
  Assert.object(outputChannel.emitter)
  state.outputChannels.push(outputChannel)

  // TODO does log file even need to be written to file or could it be stored in memory
  // (probably not a good idea to store it in memory if it gets large)
  // and that would kinda be a memory leak

  // TODO create log file lazily
  const id = outputChannel.id
  const outPath = join(Platform.getLogsDir(), 'extensions', `${id}.txt`)
  // TODO find another way
  outputChannel.path = outPath
  // TODO don't use mkdirSync here
  mkdirSync(dirname(outPath), { recursive: true })
  console.log({ outPath })
  const writeStream = createWriteStream(outPath)

  const handleData = (data) => {
    // TODO when data is not of type string, extension host shouldn't crash
    Assert.string(data)
    writeStream.write(data)
  }
  outputChannel.emitter.addListener('data', handleData)
}
