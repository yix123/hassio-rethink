# Personal Rethink HAOS add-on

Private copy of the Rethink add-on with editable application source.
See [UPSTREAM.md](UPSTREAM.md) for provenance and the update workflow.

## Installation

Add this repository to the HAOS app store using repository-scoped read-only GitHub credentials. Install **rethink – LG ThinQ Local Server**, then start it.

The add-on discovers the existing Mosquitto service through Supervisor. Leave MQTT options empty for automatic configuration, or specify a URL, username and password for an external broker.

DNS must direct `common.lgthinq.com` and `rethink.lgthinq.com` to the HAOS host. Provision the appliance separately using the included source's setup tool. Installation alone does not provision a fridge or guarantee model support.

## Development

Edit `rethink/source/` for application changes and `rethink/` for packaging. Increment `version` in `rethink/config.yaml`, update the changelog, commit and push. Refresh the HAOS app store and install the update.

Credentials belong in HAOS options, never in Git. The authenticated repository URL may appear in Supervisor logs; use a token limited to reading this repository.
