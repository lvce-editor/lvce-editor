export const handleDrop = async () => {
  console.log(['main drop'])
  const clipBoardText = await SharedProcess.invoke(
    /* ClipBoard.read */ 'ClipBoard.read'
  )
  console.log({ clipBoardText })
}
