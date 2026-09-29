# Application test harness

Feature e2e scenarios, fixtures, and scripts live in their owning repositories. `ownership.json` records the destinations. `scripts/check-e2e-ownership.mjs` rejects feature scenarios and scripts in this package, including new scenarios not yet listed in that map.

This package retains the application runner and its server-readiness unit tests. Owner integration workflows can install their scenarios into a disposable application checkout. Application packaging, server, and static-export checks remain in this repository.
