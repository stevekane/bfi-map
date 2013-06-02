var EntityManagerInterface = {

};

Kane.EntityManager = function (entClass) {
  if (!entClass) { throw new Error ('must provide entity class!'); } 

  var array = new Array();
  this.entities = array; 
};

Kane.EntityManager.prototype = Object.create(EntityManagerInterface);
