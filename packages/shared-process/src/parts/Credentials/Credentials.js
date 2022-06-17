import keytar from 'keytar'
import VError from 'verror'

/**
 * @param {string} service
 * @param {string} account
 */
export const deletePassword = async (service, account) => {
  try {
    return await keytar.deletePassword(service, account)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to delete password from service ${service}`)
  }
}

/**
 * @param {string} service
 */
export const findCredentials = async (service) => {
  try {
    return keytar.findCredentials(service)
  } catch (error) {
    throw new VError(
      // @ts-ignore
      error,
      `Failed to find credentials from service ${service}`
    )
  }
}

/**
 * @param {string} service
 */
export const findPassword = async (service) => {
  try {
    return await keytar.findPassword(service)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to find password from service ${service}`)
  }
}

/**
 * @param {string} service
 * @param {string} account
 */
export const getPassword = async (service, account) => {
  try {
    return await keytar.getPassword(service, account)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to get password from service ${service}`)
  }
}

/**
 * @param {string} service
 * @param {string} account
 * @param {string} password
 */
export const setPassword = async (service, account, password) => {
  try {
    return await keytar.setPassword(service, account, password)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to set password for service ${service}`)
  }
}
