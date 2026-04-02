# ESP32 Gate Counter Wiring

## Components

- ESP32 DevKit
- 2 x HC-SR04 ultrasonic sensor
- Jumper wires
- Stable 5V supply (recommended for sensors)

## Suggested pin mapping

- Sensor A trigger -> GPIO 5
- Sensor A echo -> GPIO 18
- Sensor B trigger -> GPIO 19
- Sensor B echo -> GPIO 21

## Placement

Place the two sensors in a line along walking direction at gate:

- Sensor A near outside
- Sensor B near inside

Direction logic:

- A then B -> entering (`in`)
- B then A -> exiting (`out`)

## Electrical notes

- HC-SR04 echo is 5V. Use a voltage divider/level shifter before ESP32 GPIO.
- Common ground between ESP32 and sensors is mandatory.
- Use short wires to reduce noise.
