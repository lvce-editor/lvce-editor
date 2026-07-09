export const getNsisUpdateArgs = () => {
  const args = []
  args.push('--updated')
  args.push('/S')
  args.push('--force-run')
  return args
}
