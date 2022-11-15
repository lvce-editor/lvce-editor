const supportsServiceWorker = () => {
  return 'serviceWorker' in navigator
}

const handleUpdateFound = () => {
  // console.info('[service-worker] update found')
}

const handleControllerChange = () => {
  // console.info('[service-worker] controller changed - reloading page')
  location.reload()
}

export const register = async (url, scope) => {
  if (!supportsServiceWorker()) {
    return
  }
  const registration = await navigator.serviceWorker.register(url, {
    scope,
    type: 'module',
    updateViaCache: 'all',
  })
  registration.onupdatefound = handleUpdateFound
  navigator.serviceWorker.oncontrollerchange = handleControllerChange
}

const uninstallRegistration = async (registration) => {
  await registration.unregister()
}

export const uninstall = async () => {
  if (!supportsServiceWorker()) {
    return
  }
  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.all(registrations.map(uninstallRegistration))
}

export const connect = async (port) => {
  await new Promise((resolve) => {
    navigator.serviceWorker.controller.postMessage(
      { jsonrpc: '2.0', method: 'ServiceWorker.connect', params: [port] },
      [port]
    )
  })
}
