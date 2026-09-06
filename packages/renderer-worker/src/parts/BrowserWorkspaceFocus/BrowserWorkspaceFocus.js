const targets = new Map()
const browserFocusTimes = new Map()

export const record = (applicationId, uid, moduleId) => {
  if (moduleId === 'SimpleBrowser') browserFocusTimes.set(uid, Date.now())
  if (['Editor', 'EditorText', 'Terminal', 'TerminalTabs'].includes(moduleId)) {
    targets.set(applicationId, uid)
  }
}

export const get = (applicationId) => targets.get(applicationId)

export const getBrowserFocusTime = (uid) => browserFocusTimes.get(uid) || 0
export const removeBrowser = (uid) => browserFocusTimes.delete(uid)
