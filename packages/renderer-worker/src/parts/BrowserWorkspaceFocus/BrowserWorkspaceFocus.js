const targets = new Map()

export const record = (applicationId, uid, moduleId) => {
  if (['Editor', 'EditorText', 'Terminal', 'TerminalTabs'].includes(moduleId)) {
    targets.set(applicationId, uid)
  }
}

export const get = (applicationId) => targets.get(applicationId)
