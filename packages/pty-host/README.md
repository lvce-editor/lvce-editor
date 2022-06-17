# pty-host

Like in VSCode, the `pty-host` is NodeJS process that is used for spawning terminal processes (pty's).

It is a separate process, because the application should still

Even though pty's could be spawned from the shared-process, the application
will be more error tolerant with a separate pty-host process.
For example, when node-pty cannot be installed, or when there is a native exception, the application will still work (without terminals).
