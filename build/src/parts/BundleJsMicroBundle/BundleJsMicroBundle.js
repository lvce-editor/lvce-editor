import microbundle from 'microbundle'

export const bundleJs = async ({
  cwd,
  from,
  platform,
  minify = false,
  codeSplitting = false,
}) => {
  console.log({ cwd, from })
  const result = await microbundle({
    cwd,
    sourcemap: true,
    format: 'modern',
    input: [from],
    entry: from,
    entries: [from],
    output: 'dist',
    target: 'esnext',
  })
  console.log(result)
}
