import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const getKeyOptions = (rawKey) => {
  if (rawKey.includes('+')) {
    const parts = rawKey.split('+')
    let ctrlKey = false
    let altKey = false
    let spaceKey = false
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
  return { key: rawKey }
}

export const press = async (key) => {
  const keyOptions = getKeyOptions(key)
  const options = {
    cancelable: true,
    bubbles: true,
    ...keyOptions,
  }
  await RendererProcess.invoke(
    'TestFrameWork.performKeyBoardAction',
    'press',
    options
  )
}
