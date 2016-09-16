#include <PubSubClient.h>

#include <SPI.h>

#include <Ethernet.h>



// MAC addfress of the ethernet shield
byte mac[] = { 0x90, 0xA2, 0xDA, 0X0E, 0XA1, 0X30 };

char printbuf[100];


/*  ----------------------------
 *  Mqtt constants
 *  ----------------------------
*/
// unique identifier of the device
const char* uid = "33f58d9d-9b78-4a95-b858-7524d089b520";

const char* onlineTopic = "/thermostat/online";

const char* ledTopic = "/thermostat/led";

const char* server = "broker.hivemq.com";
const int port = 1883;

const char* TRUE = "true";
const char* FALSE = "false";

EthernetClient ethClient;
PubSubClient mqttClient(ethClient);

void setup() {
  pinMode(13, OUTPUT);
  digitalWrite(13, LOW);
  
  Serial.begin(9600);
  while(!Serial) {
    ;
  }
  
  if(Ethernet.begin(mac) == 0){
    Serial.println("Failed to configure Ethernet using DHCP");

    return;
  }

  printIPAddress();  

  connectMqtt();
}

void loop() {
  // Ethernet connection management
  manageEthernetConnection();

  mqttClient.loop();
}

void onMessageArrived(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  char buf[50];
  strncpy(buf, (char*)payload, length);
  
  Serial.println(buf);
  
  if(strcmp(buf, "true") == 0)
    digitalWrite(13, HIGH);
  else
    digitalWrite(13, LOW);
    
  Serial.println();
}

void connectMqtt() {
  sprintf(printbuf, "Connecting to %s:%d\n", server, port);
  Serial.println(printbuf);
  mqttClient.setServer(server, port);
  
   if(mqttClient.connect(uid)) {
    Serial.println("Connected");
    sprintf(printbuf, "%s%s", uid, onlineTopic);
    
    int lenght = strlen(TRUE);
    bool retained = true;
    boolean rc = mqttClient.publish(printbuf, (byte*)TRUE, lenght, retained);
    //boolean rc = mqttClient.publish(printbuf, (byte*)FALSE, lenght, retained);

    mqttClient.setCallback(onMessageArrived);
    
    sprintf(printbuf, "%s%s", uid, ledTopic);
    mqttClient.subscribe(printbuf);
   } else {
    Serial.println("connection failed");
   }
}

void manageEthernetConnection()
{
  switch (Ethernet.maintain())
  {
    case 1:
      //renewed fail
      Serial.println("Error: renewed fail");
      break;

    case 2:
      //renewed success
      Serial.println("Renewed success");

      //print your local IP address:
      printIPAddress();
      break;

    case 3:
      //rebind fail
      Serial.println("Error: rebind fail");
      break;

    case 4:
      //rebind success
      Serial.println("Rebind success");

      //print your local IP address:
      printIPAddress();
      break;

    default:
      //nothing happened
      break;
  }  
}

void printIPAddress()
{
  Serial.print("My IP address: ");
  for (byte thisByte = 0; thisByte < 4; thisByte++) {
    // print the value of each byte of the IP address:
    Serial.print(Ethernet.localIP()[thisByte], DEC);
    Serial.print(".");
  }

  Serial.println();
}

