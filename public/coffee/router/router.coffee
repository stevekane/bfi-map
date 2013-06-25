

BFI.IndexRoute = Ember.Route.extend
  setupController: (controller) ->
    causesCon = controller.get('controllers.causes')
    causeCon = controller.get('controllers.cause')
  
    console.log 'setupController fired'

    BFI.Cause.fetch causesCon
