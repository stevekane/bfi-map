/*
this object is responsible for listening to keyboard events
and passing the information on to its subscribers after some
processing
*/

var InputWizardInterface = {
  addSubscriber: function (subscriber) {},  
  removeSubscriber: function (subscriber) {},  
  attachToDomNode: function (domNode) {},  
  removeFromDomNode: function (domNode) {},  

  //public interface attributes
  subscribers: [],
  domNodes: [],
};

Kane.InputWizard = function (settings) {
  _.extend(this, settings);

  this.subscribers = [];
  this.domNodes = [];
};

Kane.InputWizard.prototype = Object.create(InputWizardInterface);

Kane.InputWizard.prototype.addSubscriber = function (subscriber) {
  if ("object" !== typeof subscriber) { throw new Error('no subscriber provided'); }

  this.subscribers.push(subscriber);
  
  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.removeSubscriber = function (subscriber) {
  if ("object" !== typeof subscriber) { throw new Error('no subscriber provided'); }
  if (!_.contains(this.subscribers, subscriber)) {
    throw new Error('subscriber provided is not a in the list of subscribers!');
  }

  this.subscribers = _.without(this.subscribers, subscriber);

  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.attachToDomNode = function (domNode) {
  //if no domNode provided, set domNode to document body
  domNode = (domNode) ? domNode : document.body;
  this.domNodes.push(domNode);

  //useful for chaining
  return this;
};

Kane.InputWizard.prototype.removeFromDomNode = function (domNode) {
  //we throw so that we dont silently fail to remove 
  if (!domNode) { throw new Error('no domnode provided'); } 
  if (!_.contains(this.domNodes, domNode)) {
    throw new Error('domNode provided not in the list of domNodes');
  } 
  
  this.domNodes = _.without(this.domNodes, domNode);

  //useful for chaining
  return this;
};
