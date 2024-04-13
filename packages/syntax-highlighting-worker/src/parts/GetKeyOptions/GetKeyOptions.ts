export const getKeyOptions = (rawKey: string) => {
  if (rawKey.includes('+')) {
    const parts = rawKey.split('+')
    let ctrlKey = false
    let altKey = false
    let key = ''
    for (const part of parts) {
      switch (part) {
        case 'Control':
          ctrlKey = true
          break
        case 'Space':
          key = ' '
          break
        case 'Alt':
          altKey = true
          break
        default:
          key = part
          break
      }
    }
    return {
      key,
      ctrlKey,
      altKey,
    }
  }
  return {
    key: rawKey,
    ctrlKey: false,
    altKey: false,
  }
}
