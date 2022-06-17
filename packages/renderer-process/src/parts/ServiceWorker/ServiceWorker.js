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

export const register = async (url) => {
  if (!supportsServiceWorker()) {
    return
  }
  const registration = await navigator.serviceWorker.register(url, {
    scope: '/',
    type: 'module',
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
