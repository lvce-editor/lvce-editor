type UriRename = readonly [oldUri: string, newUri: string]

export interface WorkspaceChanges {
  readonly changed?: readonly string[]
  readonly deleted?: readonly string[]
  readonly reloadContent?: boolean
  readonly renamed?: readonly UriRename[]
}

export type WorkspaceRefresh = WorkspaceChanges | readonly string[]
