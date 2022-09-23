const getModule = (argv0) => {
  switch (argv0) {
    case 'install':
      return import('../CliInstall/CliInstall.js')
    case 'list':
      return import('../CliList/CliList.js')
    default:
      throw new Error('command not found')
  }
}

export const handleCliArgs = async (argv, console, process) => {
  const argv0 = argv[0]
  const module = await getModule(argv0)
  // console.log('handle cli args')
  try {
    await module.handleCliArgs(argv, console, process)
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}
