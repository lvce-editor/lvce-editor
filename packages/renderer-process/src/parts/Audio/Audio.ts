export const play = async (src) => {
  const audio = new Audio(src)
  await audio.play()
}
