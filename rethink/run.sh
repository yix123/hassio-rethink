#!/bin/bash
set -euo pipefail
umask 077
mkdir -p /data/state
# An explicit MQTT URL overrides Supervisor discovery.
MQTT_SERVICE=$(mktemp)
trap 'rm -f "$MQTT_SERVICE"' EXIT
printf '{}\n' > "$MQTT_SERVICE"
if [ -z "$(jq -r '.mqtt_url // empty' /data/options.json)" ]; then
  curl --fail --silent --show-error --connect-timeout 10 --max-time 30 \
    -H "Authorization: Bearer ${SUPERVISOR_TOKEN:?Missing Supervisor token}" \
    http://supervisor/services/mqtt > "$MQTT_SERVICE"
  jq -e '.result == "ok" and (.data.host | type == "string") and (.data.port | type == "number")' \
    "$MQTT_SERVICE" > /dev/null
fi
jq --slurpfile service "$MQTT_SERVICE" '{
  hostname: .hostname,
  homeassistant: {
    mqtt_url: (if (.mqtt_url // "") != "" then .mqtt_url else
      (($service[0].data | if .ssl then "mqtts" else "mqtt" end) + "://" +
       $service[0].data.host + ":" + ($service[0].data.port | tostring)) end),
    mqtt_user: (if (.mqtt_url // "") != "" then .mqtt_user else $service[0].data.username end),
    mqtt_pass: (if (.mqtt_url // "") != "" then .mqtt_password else $service[0].data.password end),
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

rm -f "$MQTT_SERVICE"
trap - EXIT
echo "[rethink] Starting local server"
exec node /app/dist/rethink-cloud.js /data/config.json
