export const readFile = (extensionHost, protocol, uri) => {
  return extensionHost.invoke('FileSystem.readFile', protocol, uri)
}

export const writeFile = (extensionHost, protocol, uri, content) => {
  return extensionHost.invoke('FileSystem.writeFile', protocol, uri, content)
}

export const readDirWithFileTypes = (extensionHost, protocol, uri) => {
  return extensionHost.invoke('FileSystem.readDirWithFileTypes', protocol, uri)
}

export const remove = (extensionHost, protocol, uri) => {
  return extensionHost.invoke('FileSystem.remove', protocol, uri)
}

export const rename = (extensionHost, protocol, oldUri, newUri) => {
  return extensionHost.invoke('FileSystem.rename', protocol, oldUri, newUri)
}

export const getPathSeparator = (extensionHost, protocol) => {
  return extensionHost.invoke('FileSystem.getPathSeparator', protocol)
}
