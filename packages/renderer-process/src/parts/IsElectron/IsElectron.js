export const isElectron = () => {
  return (
    // @ts-ignore
    window.myApi &&
    // @ts-ignore
    window.myApi.ipcConnect &&
    // @ts-ignore
    typeof window.myApi.ipcConnect === 'function'
  )
}
