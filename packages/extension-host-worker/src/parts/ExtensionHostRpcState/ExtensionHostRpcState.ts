const rpcs = Object.create(null)

export const add = (id: string, rpc: any) => {
  rpcs[id] = rpc
}

export const remove = (id: string) => {
  delete rpcs[id]
}

export const get = (id: string) => {
  return rpcs[id]
}

export const getAll = () => {
  return rpcs
}
