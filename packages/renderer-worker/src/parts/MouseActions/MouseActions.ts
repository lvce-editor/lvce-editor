const registry: Record<number, readonly any[]> = Object.create(null)

export const add = (uid: number, mouseActions: readonly any[]) => {
  registry[uid] = mouseActions
}

const matchesMouseAction = (item: any, button: number, modifiers: any) => {
  return item.button === button && Boolean(item.modifiers.ctrl) === modifiers.ctrl && Boolean(item.modifiers.shift) === modifiers.shift
}

export const get = (uid: number, button: number, modifiers: any) => {
  const items = registry[uid]
  for (const item of items) {
    if (matchesMouseAction(item, button, modifiers)) {
      return item.command
    }
  }
  return ''
}
