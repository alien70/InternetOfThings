![MQTT Logo](https://github.com/alien70/InternetOfThings/blob/master/images/mqttorg-glow.png?raw=true)  
Inizialmemte sviluppato da IBM per implementare la comunicazione satellitare con gli impianti petroliferi.  
Attualmente, la standardizzazione di questo protocollo è supervisionata dall'organizzazione [OASIS](https://www.oasis-open.org/news/announcements/mqtt-version-3-1-1-becomes-an-oasis-standard), e la versione attuale è la [3.1.1](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.pdf).  
Tra gli sponsor ufficiali dello standard, degna di nota è sicuramente la comunità di [Eclipse](http://iot.eclipse.org/standards#mqtt).
## Definizione ##
Il protocollo implementa un modello di comunicazione **Publish/Subscribe**, e richiede la presenza di un **broker** che si occupa della gestione e dell'instradamento dei messaggi verso altri nodi MQTT.  

![mqtt broker](https://github.com/alien70/InternetOfThings/blob/master/images/mqtt_broker.png?raw=true)  

## Punti di forza ##
### Modello *Publish/Subscribe* ####
### Sicurezza ###
### *QoS* ###
### Last Will and Testament (**LWT**) ###
## Problemi ##   
### Broker Centralizzato ###
### TCP ###
### Wake up time ###