/**
 * Created by xents on 21/04/2016.
 */

var app = module.exports = function(loaded_modelType, loaded_Model) {
  /**
   * Ce module retourne un controller qui permet de gérer les entrées associées à un model
   * Pour des questions d'instances partagées (cf. fonctinonement de Node.JS) , on renvoie
   * une NOUVELLE instance d'un controller.
   * 
   * Le controller qui suit redéfinit certaines méthodes d'accès simples pour qu'elles soient plus facilement accessibles depuis l'extérieur.
   * Mais il laisse tout de même la possibilité de remonter jusqu'au Model originel, ce qui laisse une certaine liberté dans 
   * la manipulation de la base de données.
   * Pour des traitement complexes, il est recommandé de repartir du Model originel.
   */
  return new function(){
  //
    var self = this;
      this.Model = loaded_Model;
      this.loadedType = loaded_modelType;

    //******** METHODES D'ACCES AUX DONNEES ********//
    this.findAll = function(cb){
      self.Model.find({},cb);
    };

    this.find = function(criterias,cb) {
      self.Model.find(criterias,cb);
    };

    this.findOne = function(criterias,cb) {
      self.Model.findOne(criterias,cb);
    };

    //******** METHODE D'AJOUT DE DONNEES ********//
    this.addNew = function(infos,cb) {
      // Plus tard, Model désignera un id dans une autre base de donnée
      console.log('addNew from ' + loaded_modelType);
      var toAdd = new self.Model(infos);
      toAdd.save(function(err){
        var toR = {};
        switch(self.loadedType){
          case 'Room':
            toR.concerning = toAdd.name;
            break;
          case 'Device':
            toR.concerning = toAdd.mac;
            break;
          case 'People':
            toR.concerning = toAdd.username;
            break;
        }

        if(!err)
          toR.results = 'Succefully added';
        else
          toR.results = 'Something bad happend';

        cb(null,toR);
      });

    };

    //******** METHODE DE MISE A JOUR DES DONNEES ********//
    this.update = function(criterias,newValues,cb) {
      self.Model.update(criterias,newValues,cb);
    };

  };

};
