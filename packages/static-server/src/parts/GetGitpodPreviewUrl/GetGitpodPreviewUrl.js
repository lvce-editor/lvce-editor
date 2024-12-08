export const getGitpodPreviewUrl = (port) => {
  const workspaceId = process.env.GITPOD_WORKSPACE_ID
  const cluster = process.env.GITPOD_WORKSPACE_CLUSTER_HOST
  const url = `https://${port}-${workspaceId}.${cluster}`
  return url
}
