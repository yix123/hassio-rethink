import HADevice from './base'
import { Device as Thinq2Device } from '../thinq2/device'
import { type Connection, type DeviceDiscovery } from '../homeassistant'
import { type Metadata } from '../thinq'
import { allowExtendedType } from '@/util/casting'
import AABBDevice from './aabb_device'

// Preliminary support for the user's LG refrigerator, ThinQ model 2REF11EIDG__4.
// This model sends a long 0xFF-escaped AABB envelope, not the 10EB/10EC status blocks
// used by the other 2REF handlers. Offsets below are in the packet as captured on wire
// (AA is byte 0); AABBDevice strips the first two and last two bytes before this class
// receives the buffer, so subtract two when indexing `buf`.
//
// Observed freezer setpoint: wire byte 21 was 0x05 at -17 C and 0x07 at -18 C.
// The related 2REF profile's freezer conversion fits both observations:
//   C = -(raw + 29) / 2.
//
// Door is tentative: wire byte 68 was 0x01 before and just after the marked open action,
// then changed to 0x02 about six seconds into the open interval. The close marker had no
// later long status frame, so 0x02 => open is a working hypothesis, not a verified mapping.
// The 0x0A variant is accepted for the setpoint only; its door offset is not established.
const FRAME_CLASS = 0x10
const FRAME_ENVELOPE = 0x0a
const STATUS_VARIANTS = [0x0a, 0x0b]
const DOOR_VARIANT = 0x0b
const FREEZER_SETPOINT_OFFSET = 19 // wire byte 21
const DOOR_STATE_OFFSET = 66 // wire byte 68

const FREEZER_RAW_MIN = 1
const FREEZER_RAW_MAX = 17
const DOOR_OPEN_CANDIDATE = 0x02

export default class Device extends AABBDevice {
    readonly deviceConfig: DeviceDiscovery

    constructor(HA: Connection, thinq: Thinq2Device, meta: Metadata) {
        super(HA, thinq)
        this.deviceConfig = HADevice.config(meta, { name: 'LG Fridge' })
        this.setConfig(
            allowExtendedType({
                ...this.deviceConfig,
                components: {
                    freezer_setpoint: {
                        platform: 'sensor',
                        device_class: 'temperature',
                        unit_of_measurement: '°C',
                        unique_id: '$deviceid-freezer_setpoint',
                        state_topic: '$this/freezer_setpoint',
                        name: 'Freezer setpoint',
                    },
                    door: {
                        platform: 'binary_sensor',
                        device_class: 'door',
                        unique_id: '$deviceid-door',
                        state_topic: '$this/door',
                        name: 'Fridge door (experimental)',
                    },
                },
            }),
        )
    }

    processAABB(buf: Buffer) {
        // Raw frames use AA FF 10 0A 02 0A/0B. The 0x0A and 0x0B variants have
        // slightly different lengths, but the observed freezer value stays at the
        // same offset. Only the 0x0B variant has a correlated candidate door byte.
        if (
            buf.length <= DOOR_STATE_OFFSET ||
            buf[0] !== FRAME_CLASS ||
            buf[1] !== FRAME_ENVELOPE ||
            buf[2] !== 0x02 ||
            !STATUS_VARIANTS.includes(buf[3])
        ) {
            return
        }

        const freezerRaw = buf[FREEZER_SETPOINT_OFFSET]
        // Match 2REF11EBIVPC4's raw-to-Celsius formula for every value in the supported
        // raw range. Even values decode to half-degree setpoints.
        if (freezerRaw >= FREEZER_RAW_MIN && freezerRaw <= FREEZER_RAW_MAX) {
            this.publishProperty('freezer_setpoint', -(freezerRaw + 29) / 2)
        }

        if (buf[3] === DOOR_VARIANT) {
            const doorRaw = buf[DOOR_STATE_OFFSET]
            if (doorRaw === 0x00 || doorRaw === 0x01 || doorRaw === DOOR_OPEN_CANDIDATE) {
                this.publishProperty('door', doorRaw === DOOR_OPEN_CANDIDATE ? 'ON' : 'OFF')
            }
        }
    }
}
