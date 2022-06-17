// TODO this module should be called dom or dom utils

// TODO this module makes for weird code splitting chunks,
// maybe duplicate the code per file for better chunks

export const findIndex = ($Container, $Target) => {
  while ($Target && $Target.parentNode !== $Container) {
    $Target = $Target.parentNode
  }
  if (!$Target) {
    // console.log('no target to find', $Target, event.target)
    return -1
  }
  for (let i = 0; i < $Container.children.length; i++) {
    if ($Container.children[i] === $Target) {
      return i
    }
  }
  return -1
}
