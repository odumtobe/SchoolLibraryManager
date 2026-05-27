# TODO

- [x] Fix `createLibrarian` crash: replace Mongoose `pre('save')` hook signature to eliminate `TypeError: next is not a function`.
- [x] Restart server and retry librarian creation endpoint.
- [x] Fix librarian-by-id route path (was conflicting due to `/api/librarian` being a fixed POST route under `/api` mounting).
- [ ] Any remaining route issues for librarian CRUD; verify PUT/DELETE paths match expected client URLs.
