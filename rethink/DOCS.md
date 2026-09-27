# Rethink – LG ThinQ Local Server

## Install

1. Install and start the Mosquitto broker add-on and configure the Home Assistant MQTT integration.
2. Add `https://github.com/yix123/hassio-rethink` to the HAOS app store repositories.
3. Install **rethink – LG ThinQ Local Server** from **Rethink personal add-ons**.
4. Start it and open its Web UI.

This repository is public; no GitHub token is needed.

## Configuration

| Option | Default | Purpose |
| --- | --- | --- |
| `hostname` | `rethink.lgthinq.com` | DNS hostname used by appliances to reach Rethink. |
| `mqtt_url` | Empty | Discover the broker through Supervisor. Supply a URL to use another broker. |
| `mqtt_user` | Empty | Username for an explicitly configured MQTT URL. |
| `mqtt_password` | Empty | Password for an explicitly configured MQTT URL. |

Automatic discovery supplies the broker credentials. Keep credentials in HAOS options; do not commit them to Git.

## DNS and provisioning

Your DNS server must resolve `common.lgthinq.com` and `rethink.lgthinq.com` to the HAOS host's IP address with a nonzero TTL. An existing DNS server such as Synology DNS Server can provide these records.

Provisioning is a separate step using a Wi-Fi capable computer and `rethink/source/rethink-setup.ts`. Install its dependencies before joining the appliance's setup network. Follow the upstream setup instructions and the appliance's instructions for entering Wi-Fi setup mode. Fridge compatibility must be established from the actual model and device logs; installing this add-on alone does not establish support.

## Ports and persistent data

The add-on uses host networking: HTTPS 443, device MQTTS 8885, device MQTT 1885, ThinQ1 HTTPS 46030, and ThinQ1 TLS 47878. These are distinct from the Home Assistant MQTT broker connection.

The management interface uses port 44401 and is also accessible through HAOS ingress. There is no `direct_access` toggle in this version.

Certificates, device state, and generated configuration are stored in the persistent `/data` directory.

## Updates and troubleshooting

Application code is included under `rethink/source/`. Edit it, increment the version in `rethink/config.yaml`, update the changelog, and push. Refresh the HAOS app store to pick up a new version.

If startup fails, inspect the add-on logs for MQTT service errors or port conflicts. If a device does not connect, confirm both DNS records from the appliance network. If a device connects without entities, inspect its reported model and supported handlers before adding model-specific changes.
