![MQTT Logo](https://github.com/alien70/InternetOfThings/blob/master/images/mqttorg-glow.png?raw=true)  
Inizialmemte sviluppato da IBM per implementare la comunicazione satellitare con i sistemi di controllo degli impianti petroliferi, 
il protocollo che implementa un modello di comunicazione **Publish/Subscribe**, richiede la presenza di un **broker** che si occupa della gestione e dell'instradamento dei messaggi verso altri nodi MQTT.
 
<img src="https://github.com/alien70/InterntOfThings/blob/master/images/mqtt_broker.png?raw=true" width="50%" alt="MQTT Broker"> 

Attualmente, la standardizzazione di questo protocollo è supervisionata dall'organizzazione [OASIS](https://www.oasis-open.org/news/announcements/mqtt-version-3-1-1-becomes-an-oasis-standard),
 e la versione attuale è la [3.1.1](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.pdf).
Tra gli sponsor ufficiali dello standard, c'è la comunità di [Eclipse](http://iot.eclipse.org/standards#mqtt), che si occuopa, tra l'altro dello svilupo di diversi client MQTT, attraverso il progetto [Paho](https://eclipse.org/paho/).  

<img src="https://github.com/alien70/InternetOfThings/blob/master/images/paho_logo_400.png?raw=true" width="25%" alt="PAHO Logo">

Attualmente vengono sviluppati client per i maggiori linguaggi di programmazione attualmente in uso

<table>
<thead>
<th>Client</th>
<th>Release ufficiale</th>
</thead>
<tbody>
<tr>
	<td>Java</td>
	<td>1.1.0</td>
</tr>
<tr>
	<td>Python</td>
	<td>1.0</td>
</tr>
<tr>
	<td>Javascript</td>
	<td>1.0.2</td>
</tr>
<tr>
	<td>Golang</td>
	<td>1.0.0</td>
</tr>
<tr>
	<td>C</td>
	<td>1.1.0</td>
</tr>
<tr>
    <td>.Net (C#)</td>
	<td>4.0.4</td>
</tr>
<tr>
	<td>Android Service</td>
	<td>1.1.0</td>
</tr>
<tr>
	<td>Embedded C++</td>
	<td>1.0.0</td>
</tr>
</tbody>
</table>

Per descrivere le caratteristiche fondamentali del protocollo seguiremo un approccio pratico, implementando un caso semplice di comunicazione M2M.  
Inizieremo a sviluppare i client del servizio utilizzando come broker uno dei tanti servizi gratuiti messi a disposizione dai diversi provider mqtt. In particolare utizzeremo il servizio fornito da [HiveMQ](http://www.mqtt-dashboard.com/).

A titolo di esempio realizzeremo la simulazione di un **termostato intelligente**. Il sistema consisterà essenzialmente di un modulo di controllo del termostato che sarà responsabile della *pubblicazione* dello *stato* attuale (connesso/disconnesso, temperatura, umidità ambientale, ...) e che *sottoscriverà* i *topic* relativi ai comandi che potranno essere serviti (set point della temperatura, ...). Accanto al *controller*, implementeremo un'applicazione per il controllo remoto del termostato.
Tra i vari client disponibili, sperimenteremo in particolare con quelli per:
* [JavaScript](https://github.com/alien70/InternetOfThings/tree/master/mqtt/Javascript) 
* [.NET](https://github.com/alien70/InternetOfThings/tree/master/mqtt/dotNet)
