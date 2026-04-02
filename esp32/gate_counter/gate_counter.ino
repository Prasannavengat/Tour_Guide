#include <WiFi.h>
#include <HTTPClient.h>

// =====================
// User configuration
// =====================
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* BACKEND_URL = "http://192.168.1.100:4000/api/sensor/events";

const char* SITE_ID = "site-temple-view";
const char* GATE_ID = "gate-1";

// Ultrasonic pins (HC-SR04)
const int TRIG_A = 5;
const int ECHO_A = 18;
const int TRIG_B = 19;
const int ECHO_B = 21;

// Trigger threshold in cm to detect a person
const float TRIGGER_DISTANCE_CM = 70.0;

// Timing windows
const unsigned long SENSOR_PAIR_WINDOW_MS = 1200;
const unsigned long EVENT_COOLDOWN_MS = 1000;

unsigned long lastEventTime = 0;
unsigned long firstTriggerTime = 0;
char firstSensor = '\0';

float readDistanceCm(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 25000);
  if (duration == 0) return 999.0;

  return duration * 0.0343 / 2.0;
}

bool sensorTriggered(float distanceCm) {
  return distanceCm > 0 && distanceCm < TRIGGER_DISTANCE_CM;
}

void sendCrossingEvent(const char* direction) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Skipping event.");
    return;
  }

  HTTPClient http;
  http.begin(BACKEND_URL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"siteId\":\"" + String(SITE_ID) + "\",";
  payload += "\"gateId\":\"" + String(GATE_ID) + "\",";
  payload += "\"direction\":\"" + String(direction) + "\"";
  payload += "}";

  int code = http.POST(payload);
  Serial.print("Event ");
  Serial.print(direction);
  Serial.print(" sent. HTTP: ");
  Serial.println(code);

  if (code > 0) {
    String response = http.getString();
    Serial.println(response);
  }

  http.end();
}

void connectWifi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_A, OUTPUT);
  pinMode(ECHO_A, INPUT);
  pinMode(TRIG_B, OUTPUT);
  pinMode(ECHO_B, INPUT);

  connectWifi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWifi();
  }

  unsigned long now = millis();
  if (now - lastEventTime < EVENT_COOLDOWN_MS) {
    delay(40);
    return;
  }

  float dA = readDistanceCm(TRIG_A, ECHO_A);
  float dB = readDistanceCm(TRIG_B, ECHO_B);

  bool a = sensorTriggered(dA);
  bool b = sensorTriggered(dB);

  if (firstSensor == '\0') {
    if (a) {
      firstSensor = 'A';
      firstTriggerTime = now;
    } else if (b) {
      firstSensor = 'B';
      firstTriggerTime = now;
    }
  } else {
    if (now - firstTriggerTime > SENSOR_PAIR_WINDOW_MS) {
      firstSensor = '\0';
    } else {
      if (firstSensor == 'A' && b) {
        sendCrossingEvent("in");
        lastEventTime = now;
        firstSensor = '\0';
      } else if (firstSensor == 'B' && a) {
        sendCrossingEvent("out");
        lastEventTime = now;
        firstSensor = '\0';
      }
    }
  }

  delay(60);
}
