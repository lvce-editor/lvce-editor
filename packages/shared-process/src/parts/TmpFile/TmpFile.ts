import { file, dir } from 'tmp-promise'

export const getTmpFile = async () => {
  const { path } = await file({
    prefix: 'lvce-extension-',
  })
  return path
}

export const getTmpDir = async () => {
  const { path } = await dir({
    prefix: 'lvce-extension-',
  })
  return path
}
