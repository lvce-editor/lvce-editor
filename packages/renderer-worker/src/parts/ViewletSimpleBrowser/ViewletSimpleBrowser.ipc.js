import * as SimpleBrowser from './ViewletSimpleBrowser.js'

// prettier-ignore
export const Commands = {
  'SimpleBrowser.go': SimpleBrowser.go,
  'SimpleBrowser.handleInput': SimpleBrowser.handleInput,
  'SimpleBrowser.openDevtools': SimpleBrowser.openDevtools,
  'SimpleBrowser.reload': SimpleBrowser.reload,
  'SimpleBrowser.forward': SimpleBrowser.forward,
  'SimpleBrowser.backward': SimpleBrowser.backward,
}

export * from './ViewletSimpleBrowser.js'
