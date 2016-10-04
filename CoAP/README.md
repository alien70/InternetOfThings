# CoAP #
**CoAP** (**Co**strained **A**pplication **P**rotocol) è un protocollo di comunicazione molto *leggero* 
la cui standardizzazione è seguita dal gruppo **CoRE** (**Co**strained **R**esource **E**nvironment) della community [IETF](https://www.ietf.org/).  
E' un protocollo simile ad *HTTP*, dal quale di differenzia per i seguenti motivi:
* è pensato per dispositivi con risorse hw/sw particolarmente ridotte;
* i pacchetti di dati scambiati sono di dimensioni molto minori di quelli utilizzati con *HTTP*;
* a differenza di HTTP che a livello di trasporto si basa su **TCP**, CoAP utilizza **UDP**;
A differenza di mqtt, che prevede un modello *publisher/subscriber*, CoAP implementa un modello *client/server*, nel quale la comunicazione è implementata un'archiettuta REST (i client accedono alle risorse mediante i metodi GET, PUT, POST e DELETE).  
## Application Level QoS ##
I messaggi tra client e server, possono essere impostati come *confirmable* e *nonconfirmable*. All'invio dei messaggi del primo tipo deve sempre corrispondere un *Acknowledgment* che ne garantisce la ricezione
## Negoziazione dei contenuti ##
Caratteristica inteesante di CoAP è che, al pari di HTTP, supporta la negoziazione dei contenuti che consentirà di scegliere la rappresentazione dei contenuti preferita nella comunicazione *client-server* (XML, json,...). Sempre al pai di HTTP, è possibile utilizzare delle query string che consentiranno l'implementazione di funzionalità accessorie quali *Ricerca*, *Paginazione*, ecc.
## Sicurezza ##
Essendo implementato sul protocollo **UDP**, CoAP, si affida all'analogo UDP di **TLS**, ovvero **DTLS** (**D**atagram **T**ransport **L**ayer **S**ecurity).
