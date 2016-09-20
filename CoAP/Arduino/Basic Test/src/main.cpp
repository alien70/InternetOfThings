#include "Arduino.h"
#include <SPI.h>
#include <Dhcp.h>
#include <Dns.h>
#include <Ethernet.h>
#include <EthernetUdp.h>
#include "coap.h"

// Unique identifier of the device
byte _mac[] = { 0x90, 0xA2, 0xDA, 0x0E, 0xA1, 0x30 };

EthernetUDP udp;
Coap coap(udp);

bool LedState;

void PrintIPAddress();

void callback_light(CoapPacket &packet, IPAddress ip, int port);

void callback_response(CoapPacket &packet, IPAddress ip, int port);

void InitCoAP(/* arguments */) {
  coap.server(callback_light, "light");

  coap.response(callback_response);

  coap.start();
}

void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);

  if(Ethernet.begin(_mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    return;
  }

  PrintIPAddress();

  LedState = false;

  InitCoAP();
}

void loop(/* arguments */) {
  digitalWrite(13, (LedState) ? HIGH : LOW);
  delay(1000);
  coap.loop();
}

void callback_light(CoapPacket &packet, IPAddress ip, int port) {
  Serial.println("[Light] ON/OFF");
  char p[packet.payloadlen + 1];
  memcpy(p, packet.payload, packet.payloadlen);
  p[packet.payloadlen] = NULL;

  String message(p);
  if(message.equals("0")) {
    LedState = false;
    coap.sendResponse(ip, port, packet.messageid, "0");
  } else if(message.equals("1")) {
    LedState = true;
    coap.sendResponse(ip, port, packet.messageid, "1");
  }
}

void callback_response(CoapPacket &packet, IPAddress ip, int port) {
  Serial.println("[CoAP Response got]");
  char p[packet.payloadlen + 1];
  memcpy(p, packet.payload, packet.payloadlen);
  p[packet.payloadlen] = NULL;

  Serial.println(p);
}

void PrintIPAddress() {
  Serial.println("IP Address is: ");
  IPAddress ip = Ethernet.localIP();
  for(unsigned int i = 0; i < 4; i++){
    Serial.print(ip[i], DEC);
    if(i < 3)
      Serial.print(".");
  }
  Serial.println();
}
