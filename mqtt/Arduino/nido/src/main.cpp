#include "Arduino.h"
#include "nido.h"

// Unique identifier of the device
byte mac[] = { 0x90, 0xA2, 0xDA, 0x0E, 0xA1, 0x30 };

const char* server = "broker.hivemq.com";
const int port = 1883;

EthernetClient ethernetClient;
Nido nest(Ethernet, ethernetClient, server, port);

void setup(/* arguments */) {
  nest.Init(mac);
}

void loop(/* arguments */) {  
  nest.Loop();
}
