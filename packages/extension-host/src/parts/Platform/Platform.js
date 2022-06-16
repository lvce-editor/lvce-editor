export const state = {
  getLogsDir() {
    return process.env.LOGS_DIR || '/tmp'
  },
}

export const getLogsDir = () => {
  return state.getLogsDir()
}
