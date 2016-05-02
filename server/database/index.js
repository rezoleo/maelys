/**
 * Created by xents on 20/04/2016.
 */

// Dépendences
var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/database');
var Schema = mongoose.Schema;
var ctrl_base = require('./controllers/database-controller');


// Définition des schémas
var peopleSchema = new Schema({
  username: String,
  name: String,
  firstName: String,
  email: String,
  room: String,
  devices : [{type: String, ref:'device'}]
});

var deviceSchema = new Schema({
  mac: String, // Adresse MAC de la machine
  ip: String, // Adresse IP associée
  dns: String, // Adresse DNS associée
  active: String, // Est-ce que la machine a été activée
  owner: {type: String, ref:'people'} // Username de la personne qui la possède
});

var roomSchema = new Schema({
  name: String,
  sw_and_port:String,
  resident: {type: String, ref:'people'}
});

//Initialisation des Models
var People = mongoose.model('people',peopleSchema);
var Room = mongoose.model('room',roomSchema);
var Device = mongoose.model('device',deviceSchema);

// Initialisation des controllers
// ATTENTION : Les controllers dépendent forcement des Models !
var peopleCtrl = ctrl_base('People',People);
var roomCtrl = ctrl_base('Room',Room);
var deviceCtrl = ctrl_base('Device', Device);


module.exports = {
  people: peopleCtrl,
  room: roomCtrl,
  device: deviceCtrl
}


/* People.findAllPeople(function(err,results){
  console.log(results);
})*/