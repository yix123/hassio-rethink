# Changelog

## 1.0.9

- Include application source in this repository so changes can be built directly by HAOS.
- Remove obsolete build-time patches; upstream already includes the model alias and ingress fixes.
- Install locked dependencies with npm ci.
- Use Node.js 22.
- Make MQTT connection and credentials configurable; generate JSON with jq.
- Discover the existing MQTT service through Supervisor when no URL is supplied.
