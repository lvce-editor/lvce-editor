import { expect, jest, test } from '@jest/globals'
import { unregisterAllServiceWorkers } from '../../../static/js/unregister-service-workers.js'

test('unregisters every service worker registration', async () => {
  const firstRegistration = {
    unregister: jest.fn(async () => true),
  }
  const secondRegistration = {
    unregister: jest.fn(async () => true),
  }
  const serviceWorkerContainer = {
    controller: null,
    getRegistrations: jest.fn(async () => [firstRegistration, secondRegistration]),
  }
  const reload = jest.fn()

  await unregisterAllServiceWorkers({ serviceWorkerContainer, reload })

  expect(firstRegistration.unregister).toHaveBeenCalledTimes(1)
  expect(secondRegistration.unregister).toHaveBeenCalledTimes(1)
  expect(reload).not.toHaveBeenCalled()
})

test('reloads after unregistering a service worker that controls the page', async () => {
  const registration = {
    unregister: jest.fn(async () => true),
  }
  const serviceWorkerContainer = {
    controller: {},
    getRegistrations: jest.fn(async () => [registration]),
  }
  const reload = jest.fn()

  await unregisterAllServiceWorkers({ serviceWorkerContainer, reload })

  expect(registration.unregister).toHaveBeenCalledTimes(1)
  expect(reload).toHaveBeenCalledTimes(1)
})

test('does not reload a controlled page when no registrations remain', async () => {
  const serviceWorkerContainer = {
    controller: {},
    getRegistrations: jest.fn(async () => []),
  }
  const reload = jest.fn()

  await unregisterAllServiceWorkers({ serviceWorkerContainer, reload })

  expect(reload).not.toHaveBeenCalled()
})
