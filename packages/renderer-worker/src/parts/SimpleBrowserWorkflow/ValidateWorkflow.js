const characterKey = /^[a-z0-9]$/
const functionKey = /^f([1-9]|1[0-9]|2[0-4])$/
const modifierNames = { alt: 'alt', cmd: 'meta', command: 'meta', control: 'control', ctrl: 'control', meta: 'meta', shift: 'shift' }
const keyNames = {
  space: 'Space',
  enter: 'Enter',
  tab: 'Tab',
  escape: 'Escape',
  esc: 'Escape',
  backspace: 'Backspace',
  delete: 'Delete',
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
  home: 'Home',
  end: 'End',
  pageup: 'PageUp',
  pagedown: 'PageDown',
}

export const validateWorkflow = (workflows, id) => {
  if (typeof id !== 'string' || !id || !Array.isArray(workflows)) {
    throw new Error('Define simpleBrowser.workflows and supply a workflow id')
  }
  const matches = workflows.filter((workflow) => workflow?.id === id)
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one Simple Browser workflow with id ${id}`)
  }
  const { tasks } = matches[0]
  if (!Array.isArray(tasks) || tasks.length === 0 || tasks[0]?.type !== 'open-simple-browser-tab') {
    throw new Error('A workflow must start with an open-simple-browser-tab task')
  }
  return tasks.map((task) => {
    if (task?.type === 'open-simple-browser-tab') {
      if (typeof task.url !== 'string' || !task.url.trim()) {
        throw new Error('An open-simple-browser-tab task requires a URL')
      }
      const url = new URL(task.url.includes('://') ? task.url : `https://${task.url}`)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error('Workflow URLs must use HTTP or HTTPS')
      }
      return { type: task.type, url: url.href }
    }
    if (task?.type !== 'press-key' || typeof task.key !== 'string') {
      throw new Error('Unknown or invalid Simple Browser workflow task')
    }
    const parts = task.key.toLowerCase().split('+')
    const key = parts.pop()
    const modifiers = parts.map((modifier) => {
      if (!Object.hasOwn(modifierNames, modifier)) {
        throw new Error(`Unknown key modifier: ${modifier}`)
      }
      return modifierNames[modifier]
    })
    const keyCode = Object.hasOwn(keyNames, key) ? keyNames[key] : characterKey.test(key) || functionKey.test(key) ? key.toUpperCase() : undefined
    if (!keyCode) {
      throw new Error(`Unsupported workflow key: ${task.key}`)
    }
    return { type: task.type, keyCode, modifiers }
  })
}
