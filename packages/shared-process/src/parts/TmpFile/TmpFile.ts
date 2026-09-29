import { file, dir } from 'tmp-promise'

export const getTmpFile = async (): Promise<any> => {
  const { path } = await file({
    prefix: 'lvce-extension-',
  })
  return path
}

export const getTmpDir = async (): Promise<any> => {
  const { path } = await dir({
    prefix: 'lvce-extension-',
  })
  return path
}
