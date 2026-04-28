#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// =====================
// User configuration
// =====================
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
// If ESP8266 is connected to a Windows mobile hotspot, backend is usually 192.168.137.1
const char* BACKEND_URL = "http://192.168.137.1:4000/update-count";

// NodeMCU pin map (ESP8266)
// IR sensor digital output: D5 (GPIO14)
// PIR sensor digital output: D6 (GPIO12)
// HC-SR04 TRIG: D1 (GPIO5)
// HC-SR04 ECHO: D2 (GPIO4) -> use voltage divider to 3.3V max
const int IR_PIN = D5;
const int PIR_PIN = D6;
const int ULTRASONIC_TRIG_PIN = D1;
const int ULTRASONIC_ECHO_PIN = D2;

// Detection tuning
const float ULTRASONIC_TRIGGER_DISTANCE_CM = 80.0;
const unsigned long EVENT_COOLDOWN_MS = 2200;
const unsigned long SENSOR_CONFIRM_WINDOW_MS = 1200;
const unsigned long WIFI_CONNECT_TIMEOUT_MS = 20000;
const unsigned long SENSOR_DEBUG_INTERVAL_MS = 1000;

// Adjust these if your modules use opposite logic levels.
const bool IR_ACTIVE_LOW = true;
const bool PIR_ACTIVE_HIGH = true;

int currentCount = 0;
unsigned long lastCountEventMs = 0;

// State for edge detection and confirmation window
bool previousIrState = HIGH;
unsigned long irBreakStartedMs = 0;
bool waitingForConfirmation = false;
unsigned long lastSensorDebugMs = 0;

const char* wifiStatusText(wl_status_t status) {
  switch (status) {
    case WL_IDLE_STATUS:
      return "IDLE";
    case WL_NO_SSID_AVAIL:
      return "NO_SSID_AVAIL";
    case WL_SCAN_COMPLETED:
      return "SCAN_COMPLETED";
    case WL_CONNECTED:
      return "CONNECTED";
    case WL_CONNECT_FAILED:
      return "CONNECT_FAILED";
    case WL_CONNECTION_LOST:
      return "CONNECTION_LOST";
    case WL_DISCONNECTED:
      return "DISCONNECTED";
    default:
      return "UNKNOWN";
  }
}

float readDistanceCm() {
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);

  long duration = pulseIn(ULTRASONIC_ECHO_PIN, HIGH, 30000);
  if (duration == 0) {
    return 999.0;
  }

  return (duration * 0.0343) / 2.0;
}

bool ultrasonicTriggered() {
  float d = readDistanceCm();
  return d > 0 && d < ULTRASONIC_TRIGGER_DISTANCE_CM;
}

bool pirTriggered() {
  bool raw = digitalRead(PIR_PIN) == HIGH;
  return PIR_ACTIVE_HIGH ? raw : !raw;
}

// For most IR obstacle modules: LOW means beam blocked/object detected.
bool irBeamBroken() {
  bool raw = digitalRead(IR_PIN) == LOW;
  return IR_ACTIVE_LOW ? raw : !raw;
}

bool connectWifi() {
  if (WiFi.status() == WL_CONNECTED) {
    return true;
  }

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long startedAt = millis();
  Serial.print("Connecting to WiFi SSID: ");
  Serial.println(WIFI_SSID);

  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - startedAt > WIFI_CONNECT_TIMEOUT_MS) {
      wl_status_t status = WiFi.status();
      Serial.print("WiFi connect timeout. Status: ");
      Serial.println(wifiStatusText(status));
      return false;
    }

    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("WiFi connected. IP: ");
  Serial.println(WiFi.localIP());
  return true;
}

bool postCountToBackend(int countValue) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("POST skipped: WiFi not connected.");
    return false;
  }

  WiFiClient client;
  HTTPClient http;

  if (!http.begin(client, BACKEND_URL)) {
    Serial.println("HTTP begin failed (invalid URL or client state).");
    return false;
  }

  http.setTimeout(5000);
  http.addHeader("Content-Type", "application/json");
  String payload = "{\"count\":" + String(countValue) + "}";

  int statusCode = http.POST(payload);
  String response = statusCode > 0 ? http.getString() : "";
  http.end();

  Serial.print("POST /update-count status: ");
  Serial.println(statusCode);
  if (statusCode < 0) {
    Serial.print("HTTP error: ");
    Serial.println(HTTPClient::errorToString(statusCode));
  }
  if (response.length() > 0) {
    Serial.print("Response: ");
    Serial.println(response);
  }

  return statusCode >= 200 && statusCode < 300;
}

void handlePeopleCounting() {
  unsigned long now = millis();
  bool irNow = irBeamBroken();

  if (now - lastSensorDebugMs >= SENSOR_DEBUG_INTERVAL_MS) {
    float distance = readDistanceCm();
    bool pir = pirTriggered();
    Serial.print("Sensors -> IR:");
    Serial.print(irNow ? "BLOCKED" : "CLEAR");
    Serial.print(" PIR:");
    Serial.print(pir ? "MOTION" : "NO_MOTION");
    Serial.print(" ULTRA_CM:");
    Serial.println(distance, 1);
    lastSensorDebugMs = now;
  }

  // Start a short confirmation window when IR changes from clear -> blocked.
  if (!previousIrState && irNow) {
    irBreakStartedMs = now;
    waitingForConfirmation = true;
  }

  previousIrState = irNow;

  if (!waitingForConfirmation) {
    return;
  }

  if (now - lastCountEventMs < EVENT_COOLDOWN_MS) {
    return;
  }

  if (now - irBreakStartedMs > SENSOR_CONFIRM_WINDOW_MS) {
    waitingForConfirmation = false;
    return;
  }

  // Confirm person only when at least one more sensor agrees.
  bool pir = pirTriggered();
  bool ultra = ultrasonicTriggered();

  if (pir || ultra) {
    currentCount += 1;
    lastCountEventMs = now;
    waitingForConfirmation = false;

    Serial.print("Person detected. Count: ");
    Serial.println(currentCount);

    bool ok = postCountToBackend(currentCount);
    if (!ok) {
      Serial.println("Failed to post count. Will retry on next detection.");
    }
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(IR_PIN, INPUT_PULLUP);
  pinMode(PIR_PIN, INPUT);
  pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
  pinMode(ULTRASONIC_ECHO_PIN, INPUT);

  connectWifi();

  Serial.println("ESP8266 people counter started.");
  Serial.println("Note: random symbols at boot are normal ESP8266 ROM logs at 74880 baud.");
}

void loop() {
  connectWifi();
  handlePeopleCounting();
  delay(40);
}
