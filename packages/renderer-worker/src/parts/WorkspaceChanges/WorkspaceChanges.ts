export type UriRename = readonly [oldUri: string, newUri: string]

export interface WorkspaceChanges {
  readonly deleted?: readonly string[]
  readonly renamed?: readonly UriRename[]
}

export type WorkspaceRefresh = WorkspaceChanges | readonly string[]
