const registry: Record<number, readonly any[]> = Object.create(null)

export const add = (uid: number, mouseActions: readonly any[]) => {
  registry[uid] = mouseActions
}

export const get = (uid: number, button: number, modifiers: any) => {
  const items = registry[uid]
  for (const item of items) {
    if (item.button === button && item.modifiers.ctrl === modifiers.ctrl && item.modifiers.shift === modifiers.shift) {
      return item.command
    }
  }
  return ''
}
