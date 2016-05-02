/**
 * Created by xents on 20/04/2016.
 */

var express = require('express');
var router = express.Router();


var database = require('../database');


router.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin','http://localhost:63342');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
  next();
});
/*** DEFINITION DES ROUTES ROOM ***/

/**
 * Définition des routes GET
 */

router.get('/room',function(req,res) {
  database.room.findAll(function(err,data) {
    res.send(data);
  });
});

router.get('/room/:number',function(req,res){
  database.room.findOne({_id:req.params.number},function(err,results){
    res.send(results);
  });
});

/**
 * Définition des routes POST
 */

router.post('/room',function(req,res){
  console.log(req.body);
  var newRoom = {
    name: req.body.name,
    sw_and_port: req.body.sw_and_port,
    resident:'0'
  };
  database.room.addNew(newRoom,function(err,results) {
    res.send(results);
  });
});

/**
 * Definition des routes PUT
 */
router.put('/room/:name',function(req,res) {
  var room = req.params.name;
  var newData = req.body.newData;
  
  database.room.update({name: {$gt : room}},newData,function(err,raw){
    res.send(raw);
  });
});

/*** DEFINITION DES ROUTES PEOPLE ***/
/**
 * Définition des routes GET
 */
router.get('/people',function(req,res) {

    database.people.findAll(function(err,data) {
      res.send(data);
    });
});

router.get('/people/:id',function(req,res) {
  var chosenUser = database.people.Model.findOne({_id:req.params.id});
  ignoreMatching(chosenUser,'name -_id','room','room','No room').populate('devices').exec(function (err, results){
    if(err)
      res.send(err.message);
    else
      res.send(results);

  });
});

/**
 * Définition des routes POST
 */

router.post('/people',function(req,res){
  var newPeople = {
    username: req.body.username,
    name: req.body.name,
    firstName: req.body.firstName,
    email: req.body.email,
    room: 'No room',
    devices:[]
  };
  console.log(newPeople);
  database.people.addNew(newPeople,function(err,results) {
    res.send(results);
  })
});

/**
 * Définintion des routes PUT 
 */
router.put('/people/:username',function(req,res) {
  var username = req.params.username;
  var newData = req.body.newData;

  console.log(newData);
  database.people.update({name: {$gt : room}},newData,function(err,raw){
    res.send(raw);
  });
});

router.put('/people/:userId/room',function(req,res){
  var userId = req.params.userId;
  var newRoomRequest = req.body.newRoomRequest;

  console.log(newRoomRequest);
  database.room.findOne({name:newRoomRequest},function(err,room){
    // On ne se place que dans le cas où on trouve réellement une chambre
    if(!err && room) {
      console.log('Found room', room);
      var toSend = {};

      if (room.resident == '0') {
        // PREMIER CAS : La chambre est vide
        // Pas de souci, on peut déplacer directement la personne
        console.log('The room is empty');
        room.resident = userId;
        room.save(function (err) {
        });
        database.people.findOne({_id: userId}, function (err, user) {
          user.room = room._id;
          user.save(function (err) {
          });
        });
        toSend = {concerning: newRoomRequest, results: 'Change successfully made'};
      }
      else if (room) {
        // DEUXIEME CAS : La chambre est déjà occupé
        // On demande confirmation en demandant le forcing du changement de chambre
        console.log('The room was taken. Use the forcing option to force moving into the room');
        toSend = {
          concerning: room.name,
          results: 'The room was taken. Use the forcing option to force moving into the room',
          requestedAction:'NEW-ROOM-NEED-FORCING'
        };
      }
    }
    else
        // La chambre n'existe pas ...
        toSend = {concerning:room.name,results:'The room does not exist.'};

      console.log(toSend);
      res.send(toSend);
  });
});

router.put('/people/:userId/room/force',function(req,res){
  /*
    On force le changement de chambre, cela veut dire que si quelqu'un était déjà enregistré, il est remplacé.
    Remplacer qqun signifie que :
      .Son indicateur de chambre est replacé à 'No room'
      .L'indicateur de resident de la chambre est changé en userId
      .L'indicateur de chambre de l'utilisateur userId est passé à room._id

    Avantage : un utilisateur qui n'est plus présent à la Rez n'est tout de même pas supprimé. Il lui sera alors possible de revenir
    plus tard et d'être déjà enregistré.
    On pensera à vider régulièrement la liste des personnes sans chambres.
   */
  var userId = req.params.userId;
  var newRoomRequest = req.body.newRoomRequest;

  database.room.findOne({name:newRoomRequest},function(err,room){
    // On checke toujours si la chambre demandé existe
    if(!err && room){
      console.log('Found room',room);
      var toSend = {};
      if(room.resident == '0'){
        // La chmabre est vide
        // Le mécanisme de forcing est inutile mais on change tout de même l'utilisateur de chambre.
        console.log('The room is empty');
        changeRoom(userId,room);
        toSend = {concerning:newRoomRequest,results :'Change successfully made'};
      }
      else {
        console.log('The room was taken. Still moved in.');
        changeRoom(userId,room,room.resident);
        toSend = {concerning:room.name,results:'The room was already  taken, but the resident was replaced'};
      }

      console.log(toSend);
      res.send(toSend);
    }
  });
});
/*** DEFINITION DES ROUTES DEVICE ***/

/**
 * Définition des routes GET
 */

router.get('/device',function(req,res) {
  database.device.findAll(function(err,data) {
    res.send(data);
  });
});

router.get('/device/:mac',function(req,res){
  console.log(req.params);
  database.device.findOne({mac:req.params.mac},function(err,results){
    res.send(results);
  });
});

router.get('/device/from/:owner',function(req,res){
  console.log(req.params);
  database.device.find({owner:req.params.owner},function(err,results){
    res.send(results);
  });
});

/**
 * Définition des routes POST
 */

router.post('/device',function(req,res){
  var newDevice = new database.device.Model({
    mac: req.body.mac,
    ip: req.body.ip,
    dns: req.body.dns,
    owner: req.body.owner,
    active: req.body.active
  });

  console.log(newDevice);

  newDevice.save(function(err){
    database.people.Model.findById(req.body.owner,function(err,owner){
      owner.devices.push(newDevice._id);
      owner.save(function(){});
    });
  });
});

/**
 * Definition des routes PUT
 */
router.put('/device/:mac',function(req,res) {
  var mac = req.params.name;
  var newData = req.body.newData;

  database.device.update({mac: {$gt : room}},newData,function(err,raw){
    res.send(raw);
  });
});

/**
 * Définition de la route pour le Search Engine
 */

router.get('/loadSearchEngine',function(req,res){
  // ATTENTION : Lorsqu'il ne trouve pas la chambre, il assigne null à room.
  // Cela nécessite un post-traitement sur le front-end
   var listOfUsers = database.people.Model.find();
   ignoreMatching(listOfUsers,'name -_id','room','room','No room').populate('devices').exec(function(err,users){
      if(err)
          res.send(err.message);
      else
        res.send(users);
   });
});


module.exports = router;

// *** Helper functions
function ignoreMatching(currentQuery, select, path, model, match) {
  return currentQuery.populate({
    path: path,
    model: model,
    match: {_id : {$not: new RegExp('/' + match + '/')}},
    select:select,
    default: match
  });
}

function changeRoom(requestingUserId,requestedRoom, userToReset) {
  database.people.findOne({_id:requestingUserId},function(err,user){
    if(err || !user) {
      console.log("Aucun utilisateur n'a été trouvé ou une erreur est survenue. Le déplacememnt est annulé.");
      return;
    }

    // Attribution du résident
    requestedRoom.resident = requestingUserId;
    requestedRoom.save(function (err) {});

    // Attribution de la chambre
    user.room = requestedRoom._id;
    user.save(function(err){} );

    // On sait que userToReset est forcement bon : il correspond à un id d'utilisateur préceddement enregistré
    // On peut donc faire la recherche sans problème, on est sûr de trouver un résultat (dans le cas où l'id est précisé).
    if(userToReset){
      database.people.findOne({_id:userToReset},function(err,toReset){
        toReset.room = 'No room';
        toReset.save(function(err){});
      });
    }

  });
}