if ('serviceWorker' in navigator) {
  const serviceWorkerUrl = new URL('../../extension-file-system-service-worker.js', import.meta.url)
  navigator.serviceWorker.register(serviceWorkerUrl).catch((error) => {
    console.warn('Failed to register extension file system service worker', error)
  })
}
