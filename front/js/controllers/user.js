/**
 * Created by xents on 23/04/2016.
 */

var maelysControllers = angular.module('Maelys-Control');
var apiHost = 'http://localhost:3000/api';

// @infos :  Controller pour la page d'infos
maelysControllers.controller('InfosCtrl',['$scope','$http','$routeParams', function($scope,$http,$routeParams){
  var userId =$routeParams.userId;
  /**
   * PREMIERE PARTIE : DEFINITION DES DIFFERENTES STRUCTURES
   *
   * *** LES DIFFERENTES METHODES ET VARIABLES STOCKEES ***
   * $scope.infos : informations concernant l'utilisateur que l'on regarde
   *  --> infos.user : (_id,username,name,firstName,room,email)
   *  --> infos.update : méthode de mise à jour de infos.user
   * $scope.changeRoom : méthodes et variables associées au chagement de chambre
   *  --> changeRoom.newRoom : valeur de la nouvelle chambre
   *  --> changeRoom.submit : méthode qui gère le changement ou non de la chambre
   *  --> changeRoom.open_newRoomSection : permet l'affichage du formulaire de changement de chambre
   *  $scope.machines : méthodes et variables concernant les différentes machines enregistrée/à enregistrer pour l'utilisateur courant
   *  --> machines.addDevice : méthode d'ajout d'une nouvelle machine associée à l'utilisateur courant
   */

  // **** DEFINITION DE $scope.infos ****

  $scope.infos = {
    user:{
      _id : userId,
      username: 'Not known yet',
      name: 'Not known yet',
      firstName: 'Not known yet',
      room: 'Not known yet',
      email : 'Not known yet'
    },
    update: function(newInfos) {
      $scope.infos.user.username = newInfos.username;
      $scope.infos.user.name= newInfos.name;
      $scope.infos.user.firstName= newInfos.firstName;
      $scope.infos.user.room = newInfos.room;
      $scope.infos.user.email = newInfos.email;
    }

  };

  // **** FIN DE DEFINITION DE $scope.machines ****

  // **** DEFINITION DE $scope.machines ****
  $scope.machines = {
    addDevice: function() {
      $http({
        method: 'POST',
        url:apiHost + '/device',
        data: {
          mac : $scope.newDeviceMac,
          ip: 'No information yet',
          dns : 'No information yet',
          owner : $scope.infos._id,
          active: true
        }
      }).success(function(data){
        console.log(data);
      });
    },
    listOfDevices:[]
  };

  // **** FIN DE DEFINITION DE $scope.machines ****


  // **** DEFINITION DE $scope.changeRoom ****

  $scope.changeRoom = {
    newRoom: "Not set",
    open_newRoomSection: function () {
      $("#machines-part").fadeOut(600, function () {
        $("#changeRoom-part").fadeIn(600);
      });
    },
    close_newRoomSection: function() {
      $("#changeRoom-part").fadeOut(600,function(){
        $("#machines-part").fadeIn(600);
      });
    },
    submit: function (eventType) {
      switch (eventType) {
        case 'submit':
          $http({
            method: 'PUT',
            url: apiHost + '/people/' + userId + '/room',
            data: {
              newRoomRequest: $scope.changeRoom.newRoom
            }
          });
          // Pas de break ici : normal, on veut exécuter la partie du dessous
        case 'cancel':
            $scope.changeRoom.close_newRoomSection();
          break;
      }
    }
  }

  // FIN DE DEFINITION DE $scope.changeRoom

  /**
   * **** DEUXIEME PARTIE : INITIALISATION ****
   */

  // On commence par récupérer les informations associées à l'utilisateur
  $http.get(apiHost + '/people/'+ userId).then(function(userInfo_response) {
    console.log('First query : updating user infos values');
    $scope.infos.update(userInfo_response.data);
  });
  // On récupère la liste des machines connectées
  $http.get(apiHost + '/device/from/'+userId).then(function(devicesList){
      console.log('Second query : fetching the devices list');
      $scope.machines.listOfDevices = devicesList.data;
      console.log($scope.machines.listOfDevices);
  });
}]);


// @infos : Controller pour la page d'ajout d'un utilisateur
maelysControllers.controller('AddUserCtrl',['$scope', '$http', '$route', function ($scope,$http,$route) {
  $scope.addUser = function() {
    $http({
      method: 'POST',
      url: apiHost + '/people',
      data: {
        username: $scope.username,
        name: $scope.name,
        firstName: $scope.firstName,
        email: $scope.email
      }
    }).success(function(data){
      console.log(data);
      // REDIRECT NOT WORKING : TODO
      $route.updateParams('/users/infos/' + data.concerning);
    })
  }
}]);