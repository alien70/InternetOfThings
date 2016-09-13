# M.E.A.N. Stack #
Con il termine M.E.A.N. si fa riferimento ad un insieme di tecnologie JavaScript che, messe insieme, costituiscono uno stack completo per lo sviluppo di applicazioni web (al pari di .NET o LAMP ed altri).   
L'acronimo sta per:
* **M** [MongoDB](https://www.mongodb.com/) è un database NoSQL;
* **E** [Express](http://expressjs.com/) è un framework utilizzato per lo sviluppo di web applications per *Node.js*;
* **A** [AngularJS](https://angularjs.org/) è un framework JavaScript sviluppato da Google per l'implementazione rapida dei frontend web;
* **N** [Node.js](https://nodejs.org/en/) è un runtime JavaScript basato sul [Chrome's V8 JavaScript engine](https://developers.google.com/v8/);

Approfittiamo di questo progetto per esplorare le possibilità offerte da questo insieme di tecnologie nell'ambito di un progetto IoT.

Una delle caratteristiche fondamentali dello sviluppo M.E.A.N. è la totale separazione tra server e client.

Inizieremo con lo sviluppo delle funzionalità server implementando un'API REST che consenta di salvare, su un'istanza di MongoDB, le letture del nostro termostato.

* [Server](https://github.com/alien70/InternetOfThings/tree/master/mean/server)
* [Client](https://github.com/alien70/InternetOfThings/tree/master/mean/client)
