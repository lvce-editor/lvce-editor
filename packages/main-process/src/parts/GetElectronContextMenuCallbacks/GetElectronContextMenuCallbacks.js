import * as Promises from '../Promises/Promises.js'

export const getElectronCallbacks = () => {
  const { resolve, promise } = Promises.withResolvers()
  const handleClick = (menuItem) => {
    resolve({
      type: 'click',
      data: menuItem,
    })
  }
  const handleClose = () => {
    resolve({
      type: 'close',
      data: undefined,
    })
  }
  return {
    handleClick,
    handleClose,
    promise,
  }
}
