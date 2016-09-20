#ifndef __NIDO_H__
#define __NIDO_H__

#include "typedefs.h"

#include <Ethernet.h>
#include <PubSubClient.h>

class Nido {
private:
  byte _mac[6];
  char* _uid;
  EthernetClass *_ethernet;
  Client *_client;
  PubSubClient* _mqttClient;
  char * _server;
  int _port;
  float _setPoint;
  unsigned long _time;

  const char* onlineTopic = "/nido/online";
  const char* ledTopic = "/nido/led";
  const char* readingTopic = "/nido/reading";
  const char* temperatureSetpointTopic = "/nido/temperatureSetpoint";

public:
  Nido();
  Nido(EthernetClass&, Client&, const char *, const int);

public:
  void Init(const byte*);
  bool Loop();

private:
    void PrintMacAddress();
    void PrintIPAddress();

    void InitMqtt();

    static void OnMessageArrived(char *, byte *, unsigned int);
};



#endif /* end of include guard:  */
