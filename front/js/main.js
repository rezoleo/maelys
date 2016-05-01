/**
 * Created by xents on 21/04/2016.
 */


var maelysCtrl = angular.module('Maelys-Control',[]);

var app = angular.module('Maelys-App',['ngRoute','Maelys-Control']);

app.config(['$routeProvider',function($routeProvider){
  $routeProvider.when('/users/infos/:userId',{
    templateUrl:'views/users/infos-page.html',
    controller:'InfosCtrl'
  });

  $routeProvider.when('/users/new',{
    templateUrl: 'views/users/new-user.html',
    controller: 'AddUserCtrl'
  });

  $routeProvider.when('/',{
    templateUrl:'views/search-page.html',
    controller:'SearchEngineCtrl'
  });

  $routeProvider.otherwise({
    redirectTo:'/'
  });
}]);

