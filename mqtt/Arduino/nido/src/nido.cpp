#include "nido.h"
#include "Arduino.h"
#include <string.h>
#include <SPI.h>

Nido::Nido() {
  pinMode(13, OUTPUT);
}

Nido::Nido(EthernetClass& ethernet, Client& client, const char* server, const int port) {
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
    int len = strlen("TRUE");
    bool retained = true;
    Serial.println(buffer);

    this->_mqttClient->publish(buffer, (byte*)"TRUE", len, retained);

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
  return this->_mqttClient->loop();
}

void Nido::OnMessageArrived(char* topic, byte* payload, unsigned int len) {
  char buffer[100];
  sprintf(buffer, "Message arrived [%s]", topic);
  Serial.println(buffer);
  Serial.println();

  strncpy(buffer, (char*) payload, len);
  buffer[len] = '\0';

  Serial.println(buffer);
  if(strcmp(buffer, "true") == 0) {
    digitalWrite(13, HIGH);
    Serial.println("HIGH");
  } else {
      digitalWrite(13, LOW);
      Serial.println("LOW");
  }

  Serial.println();
}
