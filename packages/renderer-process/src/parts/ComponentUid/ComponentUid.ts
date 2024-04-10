const uidSymbol = Symbol('uid')

export const set = ($Element, uid) => {
  $Element[uidSymbol] = uid
}

const getUidTarget = ($Element) => {
  while ($Element) {
    if ($Element[uidSymbol]) {
      return $Element
    }
    $Element = $Element.parentNode
  }
  return undefined
}

export const get = ($Element) => {
  const $Target = getUidTarget($Element)
  return $Target[uidSymbol]
}

export const fromEvent = (event) => {
  const { target, currentTarget } = event
  return get(currentTarget || target)
}
