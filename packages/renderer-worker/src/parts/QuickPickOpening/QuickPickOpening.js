const pending = new Set()

export const isOpening = (applicationId) => {
  for (const request of pending) {
    if (applicationId === undefined || request.applicationId === applicationId) return true
  }
  return false
}

export const run = async (applicationId, callback) => {
  const request = { applicationId }
  pending.add(request)
  try {
    return await callback()
  } finally {
    pending.delete(request)
  }
}
