# Built-in account access for extensions

Extensions use the existing `executeCommand` bridge to query the editor's built-in account registry:

- `Authentication.getAccounts` returns account summaries, including `id`, `active` and `signedIn`.
- `Authentication.getAccessToken(refresh = false)` returns the active account access token. Pass `true` to refresh it if needed.
- `Authentication.getBackendUrl` returns the authentication worker's configured backend. Obtain this before requesting a token, and compare it again before sending the token. Do not infer the token's backend from a changed preference.
- `Authentication.getAccountChangeState` returns `{ changing, generation }`. Reject new authorization while `changing` is true. Capture `generation` at the start of authorization and reject its result if that generation changed, even when the final account ID or token matches the initial identity.

These queries concern the editor's built-in account. Extension-provided authentication providers remain separate.

An extension that retains account-specific sessions declares an `accountLifecycle` contribution in its manifest:

```json
{
  "accountLifecycle": {
    "willChange": "example.releaseAccount",
    "didChange": "example.resumeAccount"
  },
  "commands": [
    { "id": "example.releaseAccount", "internal": true },
    { "id": "example.resumeAccount", "internal": true }
  ],
  "activation": ["onCommand:example.releaseAccount", "onCommand:example.resumeAccount"]
}
```

The editor awaits `willChange` before switching/removing an account, signing out, or signing into another account. This activates the extension even when its saved sessions were created in an earlier runtime. Dispose local connections and invalidate pending authorization before attempting network revocation. Keep cleanup available while account access is suspended, since identifying a saved session may require querying the old identity. Network failures must not prevent local cleanup.

The editor calls the same participants' `didChange` commands in `finally`, including when authentication fails. Operations can overlap: pair each suspend with one resume, and keep authorization suspended until every operation completes. The changing state and generation are maintained independently in the editor so missed notifications cannot make an old backend grant current. Disabled or incompatible extensions do not participate. Failed notifications or offline discovery do not prevent sign-out.

The legacy renderer Cloudflare bridge remains temporarily while the bundled remote-ssh extension migrates to these generic commands. Remove it after integrating the new extension release.
