# Changelog

## 1.0.14

- Add a read-only fridge setpoint sensor using aligned payload field 6 and the related fridge Celsius mapping.

## 1.0.13

- Align freezer setpoint decoding across both status packet formats using payload field 5.

## 1.0.12

- Replace the experimental fridge door mapping with aligned payload field 56: zero is closed, any nonzero value is open.
- Account for the different payload starts in both observed status packet formats.

## 1.0.9

- Include application source in this repository so changes can be built directly by HAOS.
- Remove obsolete build-time patches; upstream already includes the model alias and ingress fixes.
- Install locked dependencies with npm ci.
- Use Node.js 22.
- Make MQTT connection and credentials configurable; generate JSON with jq.
- Discover the existing MQTT service through Supervisor when no URL is supplied.
