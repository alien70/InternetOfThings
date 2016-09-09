Per implementare i simulatori del termostato e del controllo remoto direttamente in linguaggio javascript, faremo uso dell'infrastruttura fornita da [Node.js](https://nodejs.org/en/) che riterremo già installato sul sistema e del quale utilizzaremo il *package manager* [npm](https://www.npmjs.com/) per l'installazione dei moduli necessari.

<img style="background-color:#333;" src="https://github.com/alien70/InternetOfThings/blob/master/images/nodejs-logo.png?raw=true" width="10%" alt="PAHO Logo" >

Iniziamo con il creare due cartelle *thermostat* e *remote* che conterranno le implementazioni dei relativi moduli.

# thermostat #
Da una shell di comando, dopo essersi spostati nella cartella *thermostat*, lanciare il comando:
```
...$ npm init
```
il comando, serve per la creazione del file *package.json* nella cartella in questione. Dopo una serie di domande, il contenuto del file dovrebbe essere simile a questo:
```
{
  "name": "thermostat.js",
  "version": "1.0.0",
  "description": "smart thermostat javascript emulator ",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/alien70/InternetOfThings.git"
  },
  "keywords": [
    "IoT",
    "mqtt",
    "Domotic"
  ],
  "author": "Maurizio Attanasi",
  "license": "GPL-3.0",
  "bugs": {
    "url": "https://github.com/alien70/InternetOfThings/issues"
  },
  "homepage": "https://github.com/alien70/InternetOfThings#readme"
}
```
Tra le varie informazioni inserite, abbiamo definito il nome del file sorgente principale dell'applicazione '*index.js*', quindi il passo successivo è quello di creare un file con tale nome nella cartella attuale.
## Installazione di mqtt ## 
A questo punto installiamo, a livello locale, il package [mqtt.js](https://github.com/mqttjs) mediante il comando
```
...$ npm install mqtt --save
```
al termine del quale verranno, nel file package.json, le righe
```
  "dependencies": {
    "mqtt": "^1.14.1"
  }
```
e la cartella *node_modules* contenente tutte le dipendenze di mqtt.  
Iniziamo con la scrittura del controller:
``` javascript
var mqtt = require('mqtt');

// unique identifier of the device
var uid = '33f58d9d-9b78-4a95-b858-7524d089b520';

var onlineTopic = uid + '/thermostat/online';

var client = mqtt.connect('mqtt://broker.hivemq.com', {
    will:{
        topic: onlineTopic,
        payload: 'false'
    }
});

client.on('connect', () => {
	client.publish(onlineTopic, 'true', {
        qos: 1,
        retain: true
    });
})
```

L'analisi di queste prime righe di codice ci consentono di introdurre alcuni dei punti chiave del protocollo MQTT.
### Topic ### 
```
var onlineTopic = uid + '/thermostat/online';
```
Con il termine *topic* ci si riferisce ad una stringa che consente di definire una gerarchia di messaggi che possono essere filtrati dal broker ed opportunamente distribuiti ai client che hanno eseguito un'opportuna sottoscrizione. I livelli della gerarchia vengono definiti madiante il carattere *'/' (backslah)*. Nell'esempio riportato, il topic fa riferimento alla proprietà *online* del gruppo *thermostat* di un sistema individuato univocamnete da un *guid*. 

### Last Will Testament ###
MQTT consente, mediante questa caratteristica di gestire i casi in cui la connessione del client al broker viene interrotta improvvisamente per qualsiasi motivo
```
    will:{
        topic: onlineTopic,
        payload: 'false'
    }
```
Nel caso in esame, abbiamo utilizzato questa feature del protocollo per agire direttamente sul *topic* che definisce lo stato di connessione del sistema, facendo in modo che venga pubblicato un valore *false* in caso di disconnessione improvvisa.

### Quality of Service e Retained Messages ###
Con riferimento alla pubblicazione di un particolare messaggio, tra i parametri della funzione *publish*, abbiamo una serie di opzioni
```
    {
        qos: 1,
        retain: true
    }
```
Il primo parametro di tali opzioni, *qos*, definisce quella che secondo la terminologia mqtt e la *Qualità del Servizio* (**QoS**). I valori che possono essere assunti da tale parametro sono tre: 
* **0**: il broker/client spedirà una volta il messaggio senza verifica di consegna (*fire and forget*);
* **1**: il broker/client spedirà *almeno una volta* il messaggio fino a quando otterrà una conferma di ricezione;
* **2**: il broker/client spedirà il messaggio solo una volta utilizzando un meccanismo di handshake a quattro step.
Il secondo parametro '*retain*' serve per comunicare al broker se conservare o meno l'ultimo valore conosciuto del messaggio definito dal topic in esame.

# remote # 
In modo analogo a quanto fatto per il controller del termostato, implementeremo nella cartella *remote* un'applicazione javascript che simulerà il controllo remoto del termostato.
Il contenuto del file *index.js* è:

``` javascript
// Remote
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://broker.hivemq.com');

var connected = false;

// unique identifier of the device
var uid = '33f58d9d-9b78-4a95-b858-7524d089b520';
var onlineTopic = uid + '/thermostat/online';

client.on('connect', () => {
	client.subscribe(onlineTopic);
})

client.on('message', (topic, message) => {
	switch(topic){
		case onlineTopic: {
			connected = (message.toString() === 'true');	
			console.log('Termostat is %s', (connected) ? 'online' : 'offline' );		
		} break;
	}
})

// User interface
var readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
	console.log(str);
	switch(str){
		case 'q': {
			process.exit();
		} break;
	}
})
```
Le prime righe del codice provvedono, al pari di quanto visto per il controller, alla connessione del client con il broker. A connessione avvenuta, viene fatta richiesta di sottoscrizione al topic che definisce lo stato di connessione del nostro termostato:
``` javascript
client.on('connect', () => {
	client.subscribe(onlineTopic);
})
```
Un secondo blocco di codice sovrintende la comunicazione asincrona tra il client ed il broker
``` javascript
client.on('message', (topic, message) => {
	switch(topic){
		case onlineTopic: {
			connected = (message.toString() === 'true');	
			console.log('Termostat is %s', (connected) ? 'online' : 'offline' );		
		} break;
	}
})
```
ed in particolare segnala, mediante un messaggio sulla console, lo stato di connessione tra il client a bordo del termostato ed il broker.
# Test #
Per testare il funzionamento di questi due client è sufficiente aprire due shell di comando, e far eseguire a node.js i due script appena realizzati con il comando
```
...$: node index.js
```
<table>
    <tr>
        <td>
            <img style="background-color:#333;" src="https://github.com/alien70/InternetOfThings/blob/master/images/thermostat_client.png?raw=true" alt="" >
        </td>
        <td>
            <img style="background-color:#333;" src="https://github.com/alien70/InternetOfThings/blob/master/images/romote_client_1.png?raw=true" alt="" >
        </td>
        <td>
            <img style="background-color:#333;" src="https://github.com/alien70/InternetOfThings/blob/master/images/remote_client_2.png?raw=true" alt="" >
        </td>
    </tr>
    <tr style="text-align: center;">
        <td>Fig. 1 - Thermostat in esecuzione</td>
        <td>Fig. 2 - Thermostat online</td>
        <td>Fig. 2 - Thermostat offline</td>
    </tr>
</table>

Nelle immagini vengono rappresentati, da sinistra a destra, i seguenti step:
* il client che emula il termostato viene avviato;
* il client che emula il controllo remoto segnala che il termostato è andato 'online';
* il processo del termostato viene arrestato, ed il controllo remoto segnala che il termostato è andato 'offline';
