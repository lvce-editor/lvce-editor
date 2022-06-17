const querySelector = (element) => {
  if (element === 'window') {
    return window
  }
  return document.querySelector(element)
}

const getResult = (element, operation, selector, text) => {
  const $Element = querySelector(element)
  if (!$Element) {
    return false
  }
  switch (operation) {
    case 'contains': {
      const child = $Element.querySelector(selector)
      if (text) {
        if (!child) {
          return false
        }
        return child.textContent === text
      }
      return Boolean(child)
    }
    case 'not.contains': {
      const child = $Element.querySelector(selector)
      return !child
    }
    case 'isVisible': {
      return !$Element.hidden
    }
    case 'not.isVisible': {
      return $Element.hidden || $Element.classList.contains('Hidden')
    }
    case 'isFocused': {
      return $Element === document.activeElement
    }
    default:
      return false
  }
}

const retryCount = 3

const sleep = () =>
  new Promise((resolve) => setTimeout(() => resolve(false), 1300))

const listeners = []

const observeCallback = () => {
  let listener
  while ((listener = listeners.shift())) {
    listener()
  }
}

const observer = new MutationObserver(observeCallback)
observer.observe(document.body, {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
})
// observer.pa

// const sleep =
const waitForMutation = async () => {
  await Promise.race([
    new Promise((resolve) => listeners.push(resolve)),
    sleep(),
  ])
}

const getResultWithRetries = async (element, operation, selector, text) => {
  for (let i = 0; i < retryCount; i++) {
    const result = getResult(element, operation, selector, text)
    if (result) {
      return result
    }
    await waitForMutation()
  }
  return false
}

export const check = async (element, operation, selector, text) => {
  const result = await getResultWithRetries(element, operation, selector, text)
  if (!result) {
    throw new Error(
      `operation failed: ${element} ${operation} ${selector} ${text}`
    )
  }
  return result
}

const getDomOperationResult = (element, operation, ...args) => {
  const $Element = querySelector(element)
  if (!$Element) {
    return false
  }
  switch (operation) {
    case 'click':
      $Element.click()
      return true
    case 'pointerdown':
      $Element.dispatchEvent(new PointerEvent('pointerdown', {}))
      return true
    case 'pointermove':
      $Element.dispatchEvent(new PointerEvent('pointermove', args[0]))
      return true
    case 'pointerup':
      $Element.dispatchEvent(new PointerEvent('pointerup', args[0]))
      return true
    case 'setValue':
      $Element.value = args[0]
      return true
    case 'focus':
      $Element.focus()
      return true
    default:
      return false
  }
}

export const domOperation = async (element, operation, ...args) => {
  const result = getDomOperationResult(element, operation, ...args)
  if (!result) {
    throw new Error(`operation failed: ${element} ${operation}`)
  }
  return result
}

const getKeyboardOperationResult = async (key) => {
  window.dispatchEvent(new KeyboardEvent('keydown', key))
  return true
}

export const keyboardOperation = (key) => {
  const result = getKeyboardOperationResult(key)
  return result
}
