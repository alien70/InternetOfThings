# CoAP #
**CoAP** (**Co**strained **A**pplication **P**rotocol) è un protocollo di comunicazione molto *leggero* 
la cui standardizzazione è seguita dal gruppo **CoRE** (**Co**strained **R**esource **E**nvironment) della community [IETF](https://www.ietf.org/).  
E' un protocollo simile ad *HTTP*, dal quale di differenzia per i seguenti motivi:
* è pensato per dispositivi con risorse hw/sw particolarmente ridotte;
* i pacchetti di dati scambiati sono di dimensioni molto minori di quelli utilizzati con *HTTP*;
* a differenza di HTTP che a livello di trasporto si basa su **TCP**, CoAP utilizza **UDP**;
CoAP implementa un modello *client/server* 