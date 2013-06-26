BFI.Router.map ->
  @resource "causes", ->
    @route "map"
    @route "grid"

BFI.IndexRoute = Ember.Route.extend
  redirect: ->
    @replaceWith "causes"

BFI.CausesRoute = Ember.Route.extend
  events:
    showmap: ->
      @transitionTo "causes.map"
    showgrid: ->
      @transitionTo "causes.grid"

  setupController: (controller) ->
    #fetch will ajax for data, then assign the returned data to content
    BFI.Cause.fetch controller

BFI.CausesGridRoute = Ember.Route.extend
  renderTemplate: ->
    controller = @controllerFor 'causes'
    @render "causes/grid", {into: 'causes', controller: controller}

BFI.CausesMapRoute = Ember.Route.extend
  renderTemplate: ->
    controller = @controllerFor 'causes'
    @render "causes/map", {into: 'causes', controller: controller}
