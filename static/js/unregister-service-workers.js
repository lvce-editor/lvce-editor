export const unregisterAllServiceWorkers = async ({ serviceWorkerContainer, reload }) => {
  const isControlled = Boolean(serviceWorkerContainer.controller)
  const registrations = await serviceWorkerContainer.getRegistrations()
  if (registrations.length === 0) {
    return
  }
  await Promise.all(registrations.map((registration) => registration.unregister()))
  if (isControlled) {
    reload()
  }
}

const serviceWorkerContainer = globalThis.navigator?.serviceWorker
if (serviceWorkerContainer) {
  try {
    await unregisterAllServiceWorkers({
      serviceWorkerContainer,
      reload: () => globalThis.location.reload(),
    })
  } catch (error) {
    console.warn('Failed to unregister service workers', error)
  }
}
