import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const readText = async () => {
  let text
  try {
    // @ts-ignore
    text = await navigator.clipboard.readText()
  } catch (error) {
    // @ts-ignore
    if (error.message === 'Read permission denied.') {
      console.warn(
        'Failed to paste text: The Browser disallowed reading from clipboard'
      )
    } else if (
      // @ts-ignore
      error.message === 'navigator.clipboard.readText is not a function'
    ) {
      console.warn(
        'Failed to paste text: The Clipboard Api is not available in Firefox'
      )
    } else {
      console.warn(error)
    }
    return
  }
  return text
}

export const writeText = async (path) => {
  try {
    // @ts-ignore
    await navigator.clipboard.writeText(path)
  } catch (error) {
    console.warn(error)
  }
}

export const writeNativeFiles = (type, files) => {
  return SharedProcess.invoke(
    /* command */ 'ClipBoard.writeFiles',
    /* type */ type,
    /* files */ files
  )
}

export const readNativeFiles = () => {
  return SharedProcess.invoke(/* command */ 'ClipBoard.readFiles')
}
