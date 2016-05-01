/**
 * Created by xents on 30/04/2016.
 */

var maelysController = angular.module('Maelys-Control');
var apiHost = 'http://localhost:3000/api';

// @infos : Controller pour la page principale
maelysControllers.controller('SearchEngineCtrl',['$scope','$http', function($scope,$http) {
  $http.get(apiHost + '/loadSearchEngine').success(function(data){
    $scope.searchResults = data;
    console.log(data);
    document.getElementById('pending-message').classList.add('hidden');
  });


  $scope.refreshListDisplay = function() {
    var classOfResultsList = document.getElementById('results-table').classList;
    if($scope.searchThis.length < 3)
      classOfResultsList.add("hidden");
    else
      classOfResultsList.remove("hidden");
  };

}]);