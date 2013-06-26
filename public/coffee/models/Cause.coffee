BFI.Cause = Ember.Object.extend
  name: ""
  lat: null
  long: null
  goal: null
  progress: null
  followers: null
  daysToGo: null
  description: ""
  backgroundImage: """
    background-image: url(http://christiannewsng.com/wp-content/uploads/2013/03/Charity.jpg);
    background-size: contain;
    """
  
  percentOfGoal: (->
    goal = @get 'goal'
    progress = @get 'progress'
    Math.round progress/goal * 100
  ).property('goal', 'progress')

  progressStyle: (->
    "width: #{@get "percentOfGoal"}%"
  ).property('percentOfGoal')

BFI.Cause.reopenClass
  fetch: (controller) ->
    $.getJSON('public/json/causes.json')
     .done((data) ->
        controller.createCauses(data)
      )
     .fail( ->
        console.log 'attempt to load failed'
      )
      .always( ->
        console.log 'always fired'
      )
