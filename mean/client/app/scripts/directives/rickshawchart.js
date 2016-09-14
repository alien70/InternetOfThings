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
              series: [{data: scope.data, color: attrs.color}],
              renderer: scope.renderer
            });

            graph.render();
          });
        }
      };
    });
