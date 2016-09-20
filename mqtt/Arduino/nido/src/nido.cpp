#include "nido.h"
#include "Arduino.h"
#include <string.h>
#include <SPI.h>
#include <ArduinoJson.h>

Nido::Nido() {
  pinMode(13, OUTPUT);

  _time = millis();

}

Nido::Nido(EthernetClass& ethernet, Client& client, const char* server, const int port) {
  Nido();

  _ethernet = &ethernet;
  _client = &client;
  _mqttClient = new PubSubClient(*_client);

  size_t len = strlen(server);
  _server = new char[len];
  strcpy(_server, server);

  _port = port;
}

void Nido::Init(const byte* mac) {
  memcpy(_mac, mac, sizeof(_mac));

  this->_uid = new char[29];
  sprintf(this->_uid, "%#02x-%#02x-%#02x-%#02x-%#02x-%#02x"
    , _mac[0], _mac[1], _mac[2]
    , _mac[3], _mac[4], _mac[5]);

  digitalWrite(13, HIGH);

  Serial.begin(9600);
  while (!Serial) {
    ;
  }

  PrintMacAddress();

  if(_ethernet->begin(_mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    return;
  }

  PrintIPAddress();

  InitMqtt();

  randomSeed(analogRead(0));

  _setPoint = 25.0;
}

void Nido::PrintMacAddress() {
  Serial.println("NEST MAC Address is: ");
  Serial.println(this->_uid);
  Serial.println();
}

void Nido::PrintIPAddress() {
  Serial.println("NEST IP Address is: ");
  IPAddress ip = _ethernet->localIP();
  for(unsigned int i = 0; i < 4; i++){
    Serial.print(ip[i], DEC);
    if(i < 3)
      Serial.print(".");
  }
  Serial.println();
}

void Nido::InitMqtt() {
  char buffer[100];
  sprintf(buffer, "Connecting to %s:%d", this->_server, this->_port);
  Serial.println(buffer);

  this->_mqttClient->setServer(this->_server, this->_port);

  // Connecting
  if(this->_mqttClient->connect(this->_uid)) {
    Serial.println("Connected");

    // Publishing OnLine Status
    sprintf(buffer, "%s%s", this->_uid, this->onlineTopic);
    int len = strlen("true");
    bool retained = true;
    Serial.println(buffer);

    this->_mqttClient->publish(buffer, (byte*)"true", len, retained);

    // Subscribe ledTopic
    this->_mqttClient->setCallback(Nido::OnMessageArrived);

    sprintf(buffer, "%s%s", this->_uid, this->ledTopic);
    Serial.println(buffer);
    this->_mqttClient->subscribe(buffer);

  } else {
    Serial.println("Failed to connect");
  }
}

bool Nido::Loop() {

  unsigned long t = millis();
  if((t - _time) > 6000) {
    _time = t;
    char buffer[100];
    sprintf(buffer, "time: %d", (int)_time);
    Serial.println(buffer);

    char topic[100], payload[MQTT_MAX_TRANSFER_SIZE];
    sprintf(topic, "%s%s", this->_uid, this->readingTopic);
    //String topic = String(this->_uid) + String(this->readingTopic);
    //String payload;
    long low = 10*(this->_setPoint - 1), high = 10*(this->_setPoint + 1);
    float t = ((float) random(low, high)) / 10.0;
    float h = ((float) random(400, 600)) / 10.0;

    sprintf(payload, "{\"temperature\": %f, \"humidity\": %f}", t, h);

    //sprintf(payload, "ciao");
    Serial.println(topic);
    Serial.println(payload);
    Serial.println(String(strlen(payload)));
    this->_mqttClient->publish(topic, (byte*) payload, strlen(payload));
    //this->_mqttClient->publish(topic, "payload");

  }

  return this->_mqttClient->loop();
}

void Nido::OnMessageArrived(char* topic, byte* payload, unsigned int len) {
  char buffer[100], pl[10];

  strncpy(pl, (char*) payload, len);
  pl[len] = '\0';

  sprintf(buffer, "Message arrived [%s]: %s", topic, pl);
  Serial.println(buffer);

  if(strcmp(pl, "true") == 0) {
    digitalWrite(13, HIGH);
  } else {
      digitalWrite(13, LOW);
  }

}
