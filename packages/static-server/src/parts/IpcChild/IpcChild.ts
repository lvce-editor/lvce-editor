import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

interface ListenOptions {
  readonly method: number
  readonly [key: string]: unknown
}

export const listen = async ({ method, ...params }: ListenOptions) => {
  const create = IpcChildModule.getModule(method)
  // @ts-ignore
  const rpc = await create(params)
  return rpc
}
