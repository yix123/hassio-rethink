#!/bin/bash
set -euo pipefail
umask 077
mkdir -p /data/state
jq '{
  hostname: .hostname,
  homeassistant: {
    mqtt_url: .mqtt_url,
    mqtt_user: .mqtt_user,
    mqtt_pass: .mqtt_password,
    discovery_prefix: "homeassistant",
    rethink_prefix: "rethink"
  },
  ca_key_file: "/data/ca.key",
  ca_cert_file: "/data/ca.cert",
  https_port: 443,
  mqtts_port: 8885,
  mqtt_port: 1885,
  thinq1_https_port: 46030,
  thinq1_port: 47878,
  management_port: 44401,
  bridge: {storage_path: "/data/state"},
  log: ["status", "incoming", "HTTPS", "publish", "MGMT"]
}' /data/options.json > /data/config.json

echo "[rethink] Starting local server"
exec node /app/dist/rethink-cloud.js /data/config.json
