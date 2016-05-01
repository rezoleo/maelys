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
  database.people.findOne({_id:req.params.id},function (err, results){
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
    if(!err && room){
      console.log('Found room',room);
      var toSend = {};
      if(room.resident == '0'){
        console.log('The room is empty');
        room.resident = userId;
        room.save(function(err){});
        database.people.findOne({_id:userId},function(err,user){
          user.room = room._id;
          user.save(function(err){
            toSend = {concerning:user.username,results :'Change successfully made'};
          });
        });

      }
      else
        toSend= {concerning:room.name,results:'Already taken'};

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
  database.people.Model.find().populate('devices').populate('room').exec(function(err,users){
    res.send(users);
  });
});


module.exports = router;