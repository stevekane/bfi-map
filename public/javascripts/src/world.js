var WorldInterface = {
  loadData: function(data) {},

  //public facing interface attributes
  isLoaded: false,
};

Kane.World = function (settings) {
  //bus transmits world events
  if (!settings.bus) {
    throw new Error('no bus provided in settings to constructor');
  }

  //drawplane is a surface to draw our map onto
  if (!settings.drawplane) {
    throw new Error('no drawplane provided in settiungs to constructor');
  }
  _.extend(this, settings);

  this.isLoaded = false;
};

Kane.World.prototype = Object.create(WorldInterface);

Kane.World.prototype.loadData = function (data) {
  if (!data) {
    throw new Error('no data provided to load!');
  }

  this.data = data; 
  
  this.isLoaded = true;
};

//this loads data by requesting JSON from the server by name
Kane.World.prototype.loadRemoteData = function (jsonName, context, successcb, errorcb) {
  if (!jsonName) {
    throw new Error('jsonName not provided to loadRemoteData');
  }

  //create event stream for jquery ajax call
  var ajax = $.getJSON(jsonName)
    , jsonStream = Bacon.fromPromise(ajax);

  //define error behavior
  jsonStream.onError(function () {
    //if errorcb, call w/ provided context
    if (errorcb) {
      errorcb.call(context);
    }
  
    console.log('attempt to load ', jsonName, ' unsuccessful!');
  }.bind(this));

  //define success behavior
  jsonStream.onValue(function (data) {
    //load the data
    this.loadData(data); 

    //if successcallback, call with provided context 
    if (successcb) {
      successcb.call(context);
    }

    //push the data onto the world's bus
    this.bus.push({
      data: data 
    });
    
  }.bind(this));
};
