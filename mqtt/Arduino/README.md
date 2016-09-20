# Real world test #
Finalmente siamo arrivati al momento in cui tenteremo di togliere parte della simulazione dai nostri test. A tal fine torna utile un [Arduino Due](https://www.arduino.cc/en/Main/ArduinoBoardDue)
che riposava nel cassetto da troppo tempo.

<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/arduino/Arduino_DUE.jpg?raw=true" width="60%" alt="Arduino DUE">
    <p>Arduino Due</p>
</div>

L'approccio ufficiale per la programmazione di questo *giocattolo*, passa per l'utilizzo dell'IDE ufficiale scaricabile dal [link](https://www.arduino.cc/en/Main/Software).

<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/arduino/Arduino%20Splash.png?raw=true" width="30%" alt="Arduino IDE Splash">
    <br/>
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/arduino/Arduino_IDE.png?raw=true" width="60%" alt="Arduino IDE">
    <p>Arduino IDE</p>
</div>

Sebbene l'IDE ufficiale sia un ottimo strumento per far approcciare chi non ha grandi esperienze di programmazione al mondo del [DIY](https://it.wikipedia.org/wiki/DIY), per la realizzazione di questo esempio, utilizzeremo [Atom](https://atom.io/),
un ottimo editor di testo disponibile gratuitamente per i maggiori sistemi operativi, unitamente al plugin [PlatformIO](http://platformio.org/)

<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/arduino/Atom_Platform_IO.png?raw=true" width="60%" alt="PlatformIO IDE">
    <p>PlatformIO IDE</p>
</div>

Iniziamo con la creazione di un nuovo progetto per la piattaforma sulla quale intendiamo sviluppare il progetto.

<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/arduino/Platform_IO_Initialize_PRoject.png?raw=true" width="60%" alt="Initialize Arduino project">
    <p>Initialize Arduino Project</p>
</div>

Al termine del processo di inizialiazzazione, avremo un progetto vuoto

<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/arduino/PlatformIO_NewProject.png?raw=true" width="60%" alt="New Arduino project">
    <p>New Arduino Project</p>
</div>

Creiamo, nella cartella *src* del progetto, un file di nome *main.cpp*, con il seguente contenuto:

```cpp
#include "Arduino.h"

void setup(/* arguments */) {
  /* code */
}

void loop(/* arguments */) {
  /* code */
}
```
Non avendo a disposizione la sensoristica necessaria per la misura della temperatura e dell'umidità relativa ambientale 
(per esempi un [DHT11 o DHT22](https://cdn-learn.adafruit.com/downloads/pdf/dht.pdf)) da collegare al nostro arduino, realizzeremo una variante del classico *blink.h*,
ovvero dello sketch di esempio nel quale un led viene fatto lampeggiare.
<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/arduino/dht-11.png?raw=true" width="20%" alt="New Arduino project">
    <p>DHT 11</p>
</div>
La nostra variant comanderà lo stato del led con un comando *pubblicato* via mqtt.

## Connessione ad internet ##
Iniziamo a modellare il nostro dispositivo creando la classe **Nido**, mediante i files
*nido.h*

```cpp
#ifndef __NIDO_H__
#define __NIDO_H__

#include "typedefs.h"

#include <Ethernet.h>

class Nido {

public:
  Nido();

  void Init(const byte*, EthernetClass&);

private:
  byte _mac[6];
  EthernetClass _ethernet;

  void PrintMacAddress();
  void PrintIPAddress();
};

#endif /* end of include guard:  */
```
e la relativa implementazione:
```cpp
#include "nido.h"
#include "Arduino.h"
#include <string.h>
#include <SPI.h>

Nido::Nido() {
  pinMode(13, OUTPUT);
}

void Nido::Init(const byte* mac, EthernetClass& ethernet) {
  memcpy(_mac, mac, sizeof(_mac));

  digitalWrite(13, LOW);

  Serial.begin(9600);
  while (!Serial) {
    ;
  }

  PrintMacAddress();
  _ethernet = ethernet;

  if(_ethernet.begin(_mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    return;
  }

  PrintIPAddress();
}

void Nido::PrintMacAddress() {
  Serial.println("NEST MAC Address is: ");
  for(unsigned int i = 0; i < sizeof(_mac); i++) {
      Serial.print(_mac[i], HEX);
      if(i < sizeof(_mac) - 1)
        Serial.print("-");
  }
  Serial.println();
}

void Nido::PrintIPAddress() {
  Serial.println("NEST IP Address is: ");
  IPAddress ip = _ethernet.localIP();
  for(unsigned int i = 0; i < 4; i++){
    Serial.print(ip[i], DEC);
    if(i < 3)
      Serial.print(".");
  }
  Serial.println();
}
```
Dichiariamo un'istanza della nostra classe nel file *main.cpp*, e nel metodo *setup()* invochiamo il metodo *Init()*, passando, come parametri, il mac address associato allo shield Ethernet, ed un reference all'istanza della classe *EthernetClass* globale.
```cpp
...

Nido nest;

void setup(/* arguments */) {
  nest.Init(mac, Ethernet);                                                                                           
}
...
```
Per verificare il funzionamento di questo primo step, compiliamo ed eseguiamo l'*upload* del programma sul nostro arduino collegato mediante lo shield Ethernet alla nostra LAN.
Aprendo il monitor seriale avremo, non appena il programma va in esecuzione, abbiamo: 

<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/arduino/Serial_Monitor_1.png?raw=true" width="60%" alt="Serial Monitor">
    <p>Arduino Serial Monitor</p>
</div>

## Connessione al broker mqtt ##
Per connetterci al broker mqtt configurato nelle note precedenti, faremo uso di un'implementazione *Embedded C++* del progetto [paho](https://eclipse.org/paho/).
Tra le diverse soluzioni disponibili, proveremo ad utilizzare il client per arduino [PubSubClient](http://pubsubclient.knolleary.net/).
Per prima cosa aggiungiamo la libreria al nostro progetto. Nel caso di PlatformIO, l'installazione consiste nel cercare *online* la libreria con il **Library Manager**.
Lanciato il comando *PlatformIO>>Library Manager CLI (GUI Soon)*, nell'IDE, verrà visualizzata una prompt dei comandi, nella quale digiteremo il comando:

```
: pio lib search "PubSubClient"
```
che eseguirà una ricerca tra le risorse disponibili della libreria in questione. L'output di tale comando sarà simile al seguente

<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/arduino/PlatformIO_Library_Search.png?raw=true" width="60%" alt="Library Search">
    <p>PlatformIO Library Search</p>
</div>

Come si può notare, la ricerca ha prodotto diversi risultati, il primo dei quali coincide con la libreria che cercavamo. 
Per la configurazione della libreria nel nostro progetto, utilizzeremo l'informazione relativa all'ID del pacchetto (nel nostro caso 89), digitiamo nel prompt dei comandi
```
: pio lib install 89
```
<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/arduino/PlatformIO_Library_Install.png?raw=true" width="60%" alt="Library Install">
    <p>PlatformIO Library Install</p>
</div>
 
 Inziamo ad integrare la libreria appena aggiunta nel codice del nostro termostato. A tal fine aggiungiamo due attributi alla classe nodo

 ```cpp
private:
...
Client *_client;
PubSubClient* _mqttClient;
...
 ```

 ed aggiungiamo un nuovo costruttore a quello di default:
 ```cpp
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
 ```
 ed un metodo per l'inizializzazione del protocollo mqtt, che chiameremo dal metodo *Init* della classe
 ```cpp
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
```
Per il funzionamento della classe *PubSubClient* è necessario chiamare ricorsivamente il metodo *loop* della stessa, ed aggiungere una *callback* di risposta ai messaggi per i quali è stata fatta una sottoscrizione.  
A tal proposito aggiungiamo il metodo **Loop** alla classe **Nido**
```cpp
bool Nido::Loop() {
  ...
  return this->_mqttClient->loop();
}
```
e la *callback* **OnMessageArrived**
```cpp
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
```
Nel video seguente, abbiamo una dimostrazione del funzionamento dell'intero sistema.

[![Arduino Due vs MQTT](http://img.youtube.com/vi/3Pf1lSSwZXc/0.jpg)](http://www.youtube.com/watch?v=3Pf1lSSwZXc)


**NOTA:** Per una limitazione della libreria *PubSubClient*, è stato necessario ridurre la dimensione del *payload* ad una stringa con meno di 80 caratteri, rimuovendo le informazioni *uid*, e *timestamp* dalla stringa inviata.   


