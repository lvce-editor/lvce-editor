# Static

Generate fully static html, css and javascript that can be hosted for free on GitHub Pages, Netlify, Vercel, etc.

The static frontend runs in an ordinary browser. To work on a remote machine,
run **Remote Server: Connect with Pairing URL** and paste a one-time URL from
its LVCE web gateway. Files, terminals, search, Git, and extensions that declare
remote Node processes then run through authenticated HTTPS and secure
WebSockets. GitHub Pages serves only the frontend assets.

Use **Remote Server: Connection Status** to inspect pairing and **Remote
Server: Disconnect** to revoke access. Reloading requires fresh pairing;
credentials are held only in memory. Unsaved text remains in the editor when a
connection ends. Verify the remote file before retrying an interrupted save.

See the [remote deployment guide](https://github.com/lvce-editor/remote-ssh#remote-browser-development-https)
for installation, Caddy with a valid HTTPS certificate, exact allowed origins,
pairing, and revocation. Both LVCE listeners stay on loopback. Pairing grants
access as the remote OS account; the selected workspace is not a sandbox.

Without a paired remote backend, browser filesystem and terminal access is
limited by browser APIs. Extensions requiring a local Node process cannot run;
UI and browser extension workers run locally.

## Build

```sh
npm run build:static
```

GitHub Pages exports the static site from the server build so it reuses the same built artifacts:

```sh
npm run build:server
PATH_PREFIX=/lvce-editor npm run export:pages
```

The Pages artifact is written to `packages/build/.tmp/pages-export/dist`.

## Try out

```sh
http-server .tmp/dist
```
