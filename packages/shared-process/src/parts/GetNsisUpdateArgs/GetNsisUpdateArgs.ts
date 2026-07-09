export const getNsisUpdateArgs = (): any => {
  const args: any[] = []
  args.push('--updated')
  args.push('/S')
  args.push('--force-run')
  return args
}
