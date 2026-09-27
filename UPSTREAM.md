# Upstream sources

Add-on packaging: https://github.com/oirad/hassio-rethink
Base commit: 2cf14e7c5afbfe943201dc073f1c3fd1bf306d63

Application: https://github.com/anszom/rethink
Source snapshot: 2e681a69077511d36f4bfdfa4679c3c2a83b8f0a
The application source snapshot is tracked under rethink/source/.
The Dockerfile builds this copy without downloading another Git repository.

## Make changes

1. Edit rethink/source/ for application changes, or rethink/ for packaging changes.
2. Bump version in rethink/config.yaml and update rethink/CHANGELOG.md.
3. Commit and push to the repository.
4. Refresh the HAOS store and install the offered update.

Keep credentials in HAOS options, never in this repository.
Upstream snapshots can be updated deliberately; preserve local changes when merging.
