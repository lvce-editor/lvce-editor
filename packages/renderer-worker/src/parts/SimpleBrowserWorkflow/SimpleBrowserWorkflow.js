import * as Command from '../Command/Command.js'
import * as EmbedsWorker from '../EmbedsWorker/EmbedsWorker.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import { validateWorkflow } from './ValidateWorkflow.js'
import { waitForBrowserFrame } from './WaitForBrowserFrame.js'

let running = false

export const executeWorkflow = async (id) => {
  const tasks = validateWorkflow(Preferences.get('simpleBrowser.workflows'), id)
  if (running) {
    throw new Error('A Simple Browser workflow is already running')
  }
  running = true
  try {
    let instance
    let browserViewId
    for (const task of tasks) {
      if (task.type === 'open-simple-browser-tab') {
        await Command.execute('Layout.showPreview', 'simple-browser://')
        await Command.execute('SimpleBrowser.createNewTab', false, true)
        instance = ViewletStates.getInstance('SimpleBrowser')
        browserViewId = instance?.state.browserViewId
        if (!browserViewId) {
          throw new Error('Simple Browser requires an Electron browser tab')
        }
        await EmbedsWorker.invoke('ElectronWebContentsView.navigate', browserViewId, task.url)
        await waitForBrowserFrame(browserViewId)
      } else {
        if (ViewletStates.getByUid(instance.state.uid) !== instance || instance.state.browserViewId !== browserViewId) {
          throw new Error('The workflow browser tab was closed or changed')
        }
        await EmbedsWorker.invoke('ElectronWebContentsView.pressKey', browserViewId, task.keyCode, task.modifiers)
      }
    }
  } finally {
    running = false
  }
}

export const openHistory = async () => {
  let browser = ViewletStates.getInstance('SimpleBrowser')
  if (!browser) {
    await Command.execute('Layout.showPreview', 'simple-browser://')
    browser = ViewletStates.getInstance('SimpleBrowser')
  }
  if (!browser) {
    throw new Error('Simple Browser is not available')
  }
  await Viewlet.executeViewletCommand(browser.state.uid, 'openHistory')
}

executeWorkflow.requiresInstance = false
