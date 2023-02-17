const uidSymbol = Symbol('uid')

export const set = ($Element, uid) => {
  $Element[uidSymbol] = uid
}

export const get = ($Element) => {
  while ($Element) {
    if ($Element[uidSymbol]) {
      return $Element[uidSymbol]
    }
    $Element = $Element.parentNode
  }
}
