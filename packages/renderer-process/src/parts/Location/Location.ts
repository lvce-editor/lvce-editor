export const getOrigin = () => {
  return location.origin
}

export const getPathName = () => {
  return location.pathname
}

export const getHref = () => {
  return location.href
}

// TODO should do nothing if it is already at this path
export const setPathName = (pathName) => {
  const currentPathName = getPathName()
  if (currentPathName === pathName) {
    return
  }
  // @ts-ignore
  history.pushState(null, null, pathName)
}

export const hydrate = () => {
  // addEventListener('popstate', handlePopState)
}
