import { jest } from '@jest/globals'

// TODO actual keytar tests are failing in ci due to dbus error
// would be better to have tests using actual keytar

const serviceName = `Test 123`

jest.unstable_mockModule('keytar', () => {
  return {
    default: {
      deletePassword: jest.fn(() => {
        throw new Error('not implemented')
      }),
      findCredentials: jest.fn(() => {
        throw new Error('not implemented')
      }),
      findPassword: jest.fn(() => {
        throw new Error('not implemented')
      }),
      getPassword: jest.fn(() => {
        throw new Error('not implemented')
      }),
      setPassword: jest.fn(() => {
        throw new Error('not implemented')
      }),
    },
  }
})

const KeyTar = await import('keytar')
const Credentials = await import('../src/parts/Credentials/Credentials.js')

test('deletePassword', async () => {
  // @ts-ignore
  KeyTar.default.deletePassword.mockImplementation(() => {})
  await Credentials.deletePassword(serviceName, 'foo')
  expect(KeyTar.default.deletePassword).toHaveBeenCalledTimes(1)
  expect(KeyTar.default.deletePassword).toHaveBeenCalledWith(serviceName, 'foo')
})

test('deletePassword - error', async () => {
  // @ts-ignore
  KeyTar.default.deletePassword.mockImplementation(() => {
    throw new Error('"dbus-launch" (No such file or directory)')
  })

  await expect(
    Credentials.deletePassword(serviceName, 'foo')
  ).rejects.toThrowError(
    new Error(
      `Failed to delete password from service ${serviceName}: "dbus-launch" (No such file or directory)`
    )
  )
})

test('findCredentials', async () => {
  // @ts-ignore
  KeyTar.default.findCredentials.mockImplementation(() => {
    return [{ account: 'abc', password: 'abc' }]
  })
  expect(await Credentials.findCredentials(serviceName)).toEqual([
    {
      account: 'abc',
      password: 'abc',
    },
  ])
})

test('findCredentials - error', async () => {
  // @ts-ignore
  KeyTar.default.findCredentials.mockImplementation(() => {
    throw new Error('"dbus-launch" (No such file or directory)')
  })
  await expect(Credentials.findCredentials(serviceName)).rejects.toThrowError(
    new Error(
      `Failed to find credentials from service ${serviceName}: "dbus-launch" (No such file or directory)`
    )
  )
})

test('findPassword', async () => {
  // @ts-ignore
  KeyTar.default.findPassword.mockImplementation(() => {
    return 'bar'
  })
  expect(await Credentials.findPassword(serviceName)).toBe('bar')
})

test('findPassword - error', async () => {
  // @ts-ignore
  KeyTar.default.findPassword.mockImplementation(() => {
    throw new Error('"dbus-launch" (No such file or directory)')
  })
  await expect(Credentials.findPassword(serviceName)).rejects.toThrowError(
    new Error(
      `Failed to find password from service ${serviceName}: "dbus-launch" (No such file or directory)`
    )
  )
})

test('getPassword', async () => {
  // @ts-ignore
  KeyTar.default.getPassword.mockImplementation(() => {
    return 'bar'
  })
  expect(await Credentials.getPassword(serviceName, 'foo')).toBe('bar')
})

test('getPassword - error', async () => {
  // @ts-ignore
  KeyTar.default.getPassword.mockImplementation(() => {
    throw new Error('"dbus-launch" (No such file or directory)')
  })
  await expect(
    Credentials.getPassword(serviceName, 'foo')
  ).rejects.toThrowError(
    new Error(
      `Failed to get password from service ${serviceName}: "dbus-launch" (No such file or directory)`
    )
  )
})

test('setPassword', async () => {
  // @ts-ignore
  KeyTar.default.setPassword.mockImplementation(() => {})
  await Credentials.setPassword(serviceName, 'foo', 'bar')
  expect(KeyTar.default.setPassword).toHaveBeenCalledTimes(1)
  expect(KeyTar.default.setPassword).toHaveBeenCalledWith(
    serviceName,
    'foo',
    'bar'
  )
})

test('setPassword - error', async () => {
  // @ts-ignore
  KeyTar.default.setPassword.mockImplementation(() => {
    throw new Error('"dbus-launch" (No such file or directory)')
  })
  await expect(
    Credentials.setPassword(serviceName, 'foo', 'bar')
  ).rejects.toThrowError(
    new Error(
      `Failed to set password for service ${serviceName}: "dbus-launch" (No such file or directory)`
    )
  )
})
