Per monitorare online il nostro termostato intelligente, utilizzaremo uno strumento che ci fornirà l'*impalcatura* sulla quale costruiremo una *web application* M.E.A.N.. Il tool in questione è [YEOMAN](http://yeoman.io/)  

<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/yeoman.png?raw=true" width="25%" alt="YEOMAN Logo">
</div>
Per l'installazione del tool sulla macchina di sviluppo, utilizzaremo il *package manager* di node

```
$ npm install -g yo
$ npm install -g generator-angular 
```

Creata una cartella *client* nella quale creeremo l'infrastruttura della web application con il comando

```
$ yo angular
```
che avvierà un wizard di configurazione, come quello rappresentato nell'immagine seguente.
<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/yeoman%20wizard.png?raw=true" width="50%" alt="YEOMAN Wizard">
</div>
Lasceremo invariate le impostazioni di default proposte, tranne quelle relative alla scelta dei moduli da includere, che limiteremo al solo *angular-route.js*.
A questo YEOMAN provvederà a creare l'intero progetto che realizzerà la nostra web application.
Al termine dell'installazione, per avviare la web app, utilizzeremo il comando 
```
$ grunt serve
```
Che avvierà il sito web
<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/yeoman_first_run.png?raw=true" width="50%" alt="YEOMAN Wizard">
</div>
Per la nostra applicazione, realizzeremo, una per la lettura dei dati storici prodotti dal nostro sistema, l'altra per una lettura *real-time* dei valori correnti.
Per creare una pagina, ed il relativo *routing* ci serviremo del comando  

```
$ yo angular:route thermostat
```
Modifichiamo la pagina html *history.html* come segue:
``` html
<table class="table table-striped">
    <thead>
        <th>Temperature</th>
        <th>Humidity</th>
        <th>Timestamp</th>
    </thead>
    <tbody>
        <tr ng-repeat="thermostat in thermostats">
            <td>{{ thermostat.temperature | number: 2}}°</td>
            <td>{{ thermostat.humidity | number: 2}}%</td>
            <td>{{ thermostat.timestamp | date: 'dd/MM/yyyy hh:mm:ss' }}</td>
        </tr>
    </tbody>
</table>
```
ed il file *history.js*, come segue:
``` javascript
'use strict';

angular.module('clientApp')
  .controller('HistoryCtrl', function ($scope) {
    $scope.thermostats = [
      {
        uid: '33f58d9d-9b78-4a95-b858-7524d089b520',
        temperature: 24.065643436754,
        humidity: 57.6359378444804,
        timestamp: '2016-09-13T09:33:26.580Z'
      },
      {
        uid: '33f58d9d-9b78-4a95-b858-7524d089b520',
        temperature: 24.182950703534,
        humidity: 40.5889361346308,
        timestamp: '2016-09-13 09:34:28.017Z'
      },
      {
        uid: '33f58d9d-9b78-4a95-b858-7524d089b520',
        temperature: 24.1830730422421,
        humidity: 49.1091010584811,
        timestamp: '2016-09-13 09:43:00.823Z'
      }
    ];
  });

```
Ovviamente i dati sono simulati, ma il risultato è già notevole:
<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/mocked_data.png?raw=true" width="80%" alt="YEOMAN Wizard">
</div>

## Lettura dei dati storici via REST ##
Nei prossimi passi, modificheremo il nostro controller affinchè in luogo dei dati 'statici' inseriti al passo precedente, prelevi le letture dal database MongoDB, mediante le API, sviluppate in precedenza.  
A tal proposito, iniziamo ad installare le dipendenze per il modulo [Restangular](https://github.com/mgonto/restangular). Per far ciò utilizzeremo [Bower](https://bower.io/), un package manager per i progetti web, che abbiamo precedentemente installato sulla macchina di sviluppo.

```
$ bower install --save restangular
```
e passiamo alla configurazione del modulo appena installato, in modo da farlo puntare al server REST, modificando il file *app.js* come segue;

``` javascript
angular
  .module('clientApp', [
    'ngRoute',
    'restangular'
  ])
  .config(function ($routeProvider, RestangularProvider) {
    
    RestangularProvider.setBaseUrl('http://localhost:3000');
    ...
    ...
  })
  .factory('ThermostatRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setRestangularFields({
        id: '_id'
      });
    });
  })
  .factory('Thermostat', function(ThermostatRestangular) {
    return ThermostatRestangular.service('thermostat');
  });
```
Configurata l'interfaccia verso il web service adibito alla lettura dei dati, modifichiamo il controller associato alla pagina *history.html* in modo da leggere i dati provenienti dal servizio stesso.

```javascript
angular.module('clientApp')
  .controller('HistoryCtrl', function ($scope, Thermostat) {
    
        Thermostat.getList().then(function(values){
          var data = values;
          $scope.thermostats = data;
        });
        
  });
```

**NOTA:** Un modo alternativo per leggere i dati provenienti dal web service poteva essere il seguente:
```javascript
$scope.thermostats = Thermostat.getList().$object;
```
La differenza tra i due apporcci, sta nel fatto che, nel secondo modo, non si tiene conto della natura asincrona della chiamata al web service.
Se l'obiettivo della chiamata fosse esclusivamente quello di utilizzare i dati per, ad esempio, alimentare una tabella, i due approcci sarebbero fondamentalmente equivalenti.
```html
<table class="table table-striped  table-bordered table-list">
    <thead>
        <th>Temperature</th>
        <th>Humidity</th>
        <th>Timestamp</th>
    </thead>
    <tbody>
        <tr ng-repeat="thermostat in thermostats">
            <td>{{ thermostat.temperature | number: 2}}°</td>
            <td>{{ thermostat.humidity | number: 2}}%</td>
            <td>{{ thermostat.timestamp | date: 'dd/MM/yyyy hh:mm:ss' }}</td>
        </tr>
    </tbody>
</table>
```
il cui risultato è il seguente:
<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/historicl_table_view.png?raw=true" width="90%" alt="YEOMAN Wizard">
</div>
Il risultato cambia invece nel caso in cui, sui dati in arrivo dal web service, di devono eseguire delle operazioni sincrone.  
A titolo di esempio, proviamo a dare una visualizzazione grafica dei dati ottenuti. A tal fine utilizzeremo, tra i vari prodotti disponibili in rete, il controllo [Rickshaw](http://code.shutterstock.com/rickshaw/) che fornisce diverse opzioni per la visulizzazione di grafici.
Incapsuliamo il controllo in una direttiva *AngularJS* [rickshawchart.js](https://github.com/alien70/InternetOfThings/blob/master/mean/client/app/scripts/directives/rickshawchart.js), e creiamo una nuova vista, e l'opportuno supporto alla navigazione per visualizzare gli stessi dati in forma grafica.

```javascript
'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:rickshawChart
 * @description
 * # rickshawChart
 */
angular.module('clientApp')
  .directive('rickshawChart', function () {
    return {
      scope:{
        data: '=',
        renderer: '='
      },
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          scope.$watchCollection('[data, renderer]', function(newVal, oldVal){
            if(!newVal[0]){
              return;
            }

            element[0].innerHTML ='';

            var graph = new Rickshaw.Graph({
              element: element[0],
              width: attrs.width,
              height: attrs.height,
              series: [{data: scope.data[0], color: 'red'}, {data: scope.data[1], color: 'steelblue'}],
              renderer: scope.renderer
            });

            var xAxis = new Rickshaw.Graph.Axis.Time( { graph: graph } );
            
            var yAxis = new Rickshaw.Graph.Axis.Y( {
                graph: graph,
                orientation: 'left'
            } );

            graph.render();
            
          });
        }
      };
    });

```
Il risultato è il seguente:
<div style="text-align: center;">
    <img src="https://github.com/alien70/InternetOfThings/blob/master/images/historical_chart_view.png?raw=true" width="90%" alt="YEOMAN Wizard">
</div>
Per ottenere tale risultato, è stato necessario riprocessare lo stream di dati JSON in modo da creare le coppie *x-y* da passare al controllo grafico.

```javascript
angular.module('clientApp')
  .controller('ChartsCtrl', function ($scope, Thermostat) {
        $scope.viewChart = true;
        $scope.viewTable = false;

        Thermostat.getList().then(function(values){
          var data = values;
          
          $scope.thermostats = data;

          $scope.renderer = 'line';

          var temperatureReading = _.chain(data)
            .map(function(o){
              return {
                x: Date.parse(o.timestamp) / 1000,
                y: o.temperature
              };
            })
            .flatten()
            .value();

          var humidityReading = _.chain(data)
            .map(function(o){
              return {
                x: Date.parse(o.timestamp) / 1000,
                y: o.humidity
              };
            })
            .flatten()
            .value();

            $scope.thermostatReading = [ temperatureReading, humidityReading ];
        });
  });
```
**NOTA 2:** per estrarre i dati dallo stream completo (*mapping*) è stata utilizzata la libreria [Lodash](https://lodash.com/), che fornisce degli strumenti utilissimi per la manipolazione di matrici.

