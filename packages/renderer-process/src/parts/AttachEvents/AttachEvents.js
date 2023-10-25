export const attachEvents = ($Node, eventMap) => {
  for (const [key, value] of Object.entries(eventMap)) {
    $Node.addEventListener(key, value)
  }
}
