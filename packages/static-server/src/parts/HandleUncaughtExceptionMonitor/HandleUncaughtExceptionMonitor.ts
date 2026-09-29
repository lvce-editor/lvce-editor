export const handleUncaughtExceptionMonitor = (error: Error): void => {
  console.error(`[static-server] uncaught exception ${error}`)
}
