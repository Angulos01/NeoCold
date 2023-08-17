#define TINY_GSM_MODEM_SIM7000SSL
#define TINY_GSM_RX_BUFFER 1024  // Set RX buffer to 1Kb
#define SerialAT Serial1

#include <TinyGsmClient.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <SPI.h>
#include <Wire.h>
#include <BH1750.h>

//PINOUT Sensores
#define DHTTYPE DHT22
#define DHTPIN 15
const int mq135Pin = 39;
const int fotoresistorPin = 33;

//CHIP TELCEL 4G LTE
const char* apn = "internet.itelcel.com";
const char* gprsUser = "";
const char* gprsPass = "";

//Declare Broker
const char* NameBox = "NeoCold1";
const char* mqtt_broker = "broker.hivemq.com";
const int port = 1883;

//Declare Sensores
DHT dht(DHTPIN, DHTTYPE);

float temperature = 0.0;
float humidity = 0.0;
float lux = 0.0;
int mq135Value = 0;

//Set Delay
unsigned long previousMillis = 0;
unsigned long previousMillis_button = 0;
const long sampling_period = 10000;
const long sampling_periodBoton = 1000;

TinyGsm modem(SerialAT);
TinyGsmClient gsmClient(modem);
PubSubClient client(gsmClient);

//Declare Variables to CHIP 4G
#define uS_TO_S_FACTOR 1000000ULL  // Conversion factor for micro seconds to seconds
#define TIME_TO_SLEEP 60           // Time ESP32 will go to sleep (in seconds)

#define UART_BAUD 9600
#define PIN_DTR 25
#define PIN_TX 27
#define PIN_RX 26
#define PWR_PIN 4
#define GSM_PIN 1111
#define BAT_ADC 35

float mv = 0;
float speed_kph = 0;
float heading = 0;
float speed_mph = 0;
float altitude = 0;
float lat = 0;
float lon = 0;
char Lat[20];
char Lon[20];
char sendbuffer[120];
const char* Bat_value;
RTC_DATA_ATTR int bootCount = 0;
String thistime = "";


void setupGSM() {
  SerialAT.begin(115200, SERIAL_8N1, PIN_RX, PIN_TX);
  modem.init();
  delay(1000);
  pinMode(PWR_PIN, OUTPUT);
  digitalWrite(PWR_PIN, HIGH);
  delay(1000);
  digitalWrite(PWR_PIN, LOW);
  delay(3000);

  Serial.println("Initializing modem...");
  if (!modem.restart()) {
    Serial.println("Modem restart failed.");
  }
  //Encontrar Coordenadas para activar el GPS
  while (lat <= 0 || lon <= 0) {
    modem.sendAT("+SGPIO=0,4,1,1");
    if (modem.waitResponse(10000L) != 1) {
      Serial.println(" SGPIO=0,4,1,1 false ");
    }
    modem.enableGPS();
    Serial.print("Location....");
    Serial.print(modem.getGPS(&lat, &lon));
    if (modem.getGPS(&lat, &lon)) {
      Serial.println(" Located");
      break;
    } else {
      Serial.println(" Try again");
      lon = 1;
      lat = 1;     
      
    }
    delay(3000);
  }
  int i = 6;
  while (i) {
    Serial.println("Send AT");
    SerialAT.println("AT");
    if (SerialAT.available()) {
      String t = SerialAT.readString();
      Serial.println(t);
      break;
    }
    delay(1500);
    i--;
  }
  String modemInfo = modem.getModemInfo();
  Serial.print("Modem Info: ");
  Serial.println(modemInfo);

  modem.setPreferredMode(3);
  modem.gprsConnect(apn, gprsUser, gprsPass);
  Serial.println("Waiting for the network");
  if (!modem.waitForNetwork()) {
    Serial.println("Failed!!!");
    return;
  }
  Serial.println("Success");


  if (modem.isNetworkConnected()) {
    Serial.println("Network Connected");
  }

  Serial.print("Connecting to: ");
  Serial.println(apn);
  if (!modem.gprsConnect(apn, gprsUser, gprsPass)) {
    Serial.println("Fail...");
    delay(10000);
    return;
  }
  Serial.println("SUCCESSS");
  if (modem.isGprsConnected()) {
    Serial.println("GSM Connected");
  }
  String thistime = modem.getGSMDateTime(DATE_FULL).substring(0, 17);
  Serial.println(thistime);
}

float readBattery(uint8_t pin) {
  int vref = 1100;
  uint16_t volt = analogRead(pin);
  float battery_voltage = ((float)volt / 4095.0) * 2.0 * 3.3 * (vref);
  return battery_voltage;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Setup started...");
  pinMode(DHTPIN, INPUT);
  pinMode(fotoresistorPin, OUTPUT);
  Wire.begin();
  setupGSM();
  dht.begin();
  client.setServer(mqtt_broker, port);
  client.setCallback(callback);
}

void loop() {
  if (modem.isGprsConnected()) {
    Serial.println("GSM Connected");
    delay(1000);
  } else {
    Serial.println("GSM Desconnected");
    setupGSM();
  }
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  unsigned long now = millis();
  if (now - previousMillis > sampling_period) {
    get_sensor_values();
    String JSON_msg = "{\"box\":\"";
    JSON_msg.concat(NameBox);
    JSON_msg.concat("\",\"time\":\"");
    JSON_msg.concat(thistime);
    JSON_msg.concat("\",\"temperatura_actual\":\"");
    JSON_msg.concat(temperature);
    JSON_msg.concat("\",\"humedad_actual\":\"");
    JSON_msg.concat(humidity);
    JSON_msg.concat("\",\"coint\":\"");
    JSON_msg.concat(mq135Value);
    JSON_msg.concat("\",\"luz_photores\":\"");
    JSON_msg.concat(lux);
    JSON_msg.concat("\",\"latitud\":\"");
    JSON_msg.concat(String(lat, 8));
    JSON_msg.concat("\",\"longitud\":\"");
    JSON_msg.concat(String(lon, 8));
    JSON_msg.concat("\",\"energia\":\"");
    JSON_msg.concat(mv);
    JSON_msg.concat("\"}");
    Serial.println(JSON_msg);
    if (sendMQTTMessage("/NeoCold/boxes", JSON_msg)) {
      Serial.println("Message sent successfully!");
    } else {
      Serial.println("Failed to send message...");
    }
    previousMillis = millis();
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("SIM7000Client")) {
      Serial.println("Connected!");
      //client.subscribe("/UTT/device"); and 
    } else {
      Serial.print("Failed, rc = ");
      Serial.print(client.state());
      Serial.println(". Trying again in 2 seconds.");
      delay(2000);
    }
  }
}

void get_sensor_values() {
    lux =  analogRead(fotoresistorPin);
    mq135Value = analogRead(mq135Pin);
    temperature = dht.readTemperature();
    humidity = dht.readHumidity();
    Serial.println(lux);
    Serial.println(mq135Value);
    Serial.println(temperature);
    Serial.println(humidity);
  //----Fecha
  thistime = modem.getGSMDateTime(DATE_FULL).substring(0,17);
  //---GPS
  modem.sendAT("+SGPIO=0,4,1,1");
  if (modem.waitResponse(10000L) != 1) {
    Serial.println(" SGPIO=0,4,1,1 false ");
  }
  modem.enableGPS();
  if (modem.getGPS(&lat, &lon)) {
    //Serial.println("Latitude: " + String(lat, 8) + "\tLongitude: " + String(lon, 8));
  }
  //---Energy
  mv = readBattery(BAT_ADC);
  Serial.println(mv);
  String TEMP = (String)mv;
  Bat_value = (char*)TEMP.c_str();
  Serial.println(Bat_value);
}

bool sendMQTTMessage(const char* topic, const String& message) {
  if (modem.isGprsConnected()) {
    client.connect("SIM7000Client");
    client.publish(topic, message.c_str());
    client.disconnect();
    return true;
  }
  return false;
}

void callback(char* topic, byte* payload, unsigned int length) {
  // Handle incoming MQTT messages if needed
}
