import * as SimpleBrowser from './ViewletSimpleBrowser.js'

// prettier-ignore
export const Commands = {
  'SimpleBrowser.backward': SimpleBrowser.backward,
  'SimpleBrowser.forward': SimpleBrowser.forward,
  'SimpleBrowser.go': SimpleBrowser.go,
  'SimpleBrowser.handleInput': SimpleBrowser.handleInput,
  'SimpleBrowser.handleTitleUpdated': SimpleBrowser.handleTitleUpdated,
  'SimpleBrowser.handleWillNavigate': SimpleBrowser.handleWillNavigate,
  'SimpleBrowser.openDevtools': SimpleBrowser.openDevtools,
  'SimpleBrowser.reload': SimpleBrowser.reload,
}

export const css = '/css/parts/ViewletSimpleBrowser.css'

export * from './ViewletSimpleBrowser.js'
