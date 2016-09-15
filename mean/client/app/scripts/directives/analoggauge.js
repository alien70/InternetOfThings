'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:analogGauge
 * @description
 * # analogGauge
 */
angular.module('clientApp')
  .directive('analogGauge', function () {
    return {
      scope: {
        data: '='
      },
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.$watchCollection('[data]', function(newVal, oldVal){
            if(!newVal[0]){
              return;
            }          

            element[0].innerHTML ='';

            var chart = Highcharts.chart({
                chart: {
                    type: 'gauge',
                    renderTo: 'container',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
    
                title: {
                    text: 'Temperature'
                },
    
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },
       
                // the value axis
                yAxis: {
                    min: -20,
                    max: 50,
                    
                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',

                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        step: 2,
                        rotation: 'auto'
                    },
                    title: {
                        text: ' °C'
                    },
                    plotBands: [{
                        from: -20,
                        to: 18,
                        color: '#4682b4' // steelblue
                    }, {
                        from: 18,
                        to: 30,
                        color: '#55BF3B' // yellow
                    }, {
                        from: 30,
                        to: 50,
                        color: '#DF5353' // red
                    }]        
                },

                series: [{
                    name: 'temperature',
                    data: [scope.data],
                    tooltip: {
                        valueSuffix: ' °C'
                    }
                }]
            });

            element.text('this is the analogGauge directive ' + scope.data);
        });        
      }
    };
  });
