# Internet Of Things #
  
Riprendendo il discorso iniziato nella nota [Industry 4.0. -To boldly go where no man has gone before... (Part II)](https://maurizioattanasi.blogspot.it/2016/09/industry-40-to-boldly-go-where-no-man_6.html), entro la fine del 2020, 20.8 miliardi di dispositivi saranno connessi ad internet per formare l'**Internet delle Cose**. Considerando che, per lo stesso anno è prevista una popolazione mondiale di poco superiore a 7.5 miliardi, avremo, connessi ad internet, circa tre dispositivi per abitante sulla terra.  

<img src="https://github.com/alien70/InterntOfThings/blob/master/images/worldpop.png?raw=true" width="50%" alt="world population">

Sulla base di questa considerazione, la domanda che sorge spontanea, è: "*come si connetteranno tutti questi dispositivi tra loro, ai provider di servizi o, più in generale al cloud, considerando che, in generale, il requisito principale sarà quello di garantire una minima occupazione di banda, e massima efficienza energetica, e che le risorse computazionali disponibili saranno, nella quasi totalità dei casi, molto ridotte?*".
Una risposta alla domanda, ci viene dalla seguente tabella, che riassume i requisiti minimi dell'hardware e delle infrastrutture di rete per consentire l'implementazione di un'efficace comunicazione M2M.

<img src="https://github.com/alien70/InterntOfThings/blob/master/images/0915_SiLabs_Table2.gif?raw=true" width="50%" alt="IoT End-Node/Device Requirements">  

*fonte [Electronic Design](http://electronicdesign.com/)*  

Tra i diversi protocolli che soddisfano le specifiche definite nella tabella di sopra, citiamo quelli maggiormente in uso per l'implemetazione della comunicazione **M2M**:
* **[MQTT](https://github.com/alien70/InternetOfThings/tree/master/mqtt)**;
* **CoAP**;
* **AMQP** 
