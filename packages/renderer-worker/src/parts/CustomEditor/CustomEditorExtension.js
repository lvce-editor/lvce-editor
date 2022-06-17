export const protocol = 'extension://'

export const name = 'Extension'

export const retainContextWhenHidden = true

export const create = (uri) => {
  const id = uri.slice(protocol.length)
  const [authorShort, extensionShort] = id.split('.')
  const html = `<p>${authorShort}</p><p>${extensionShort}</p>`
  return {
    html,
  }
}
