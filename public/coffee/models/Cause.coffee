BFI.Cause = Ember.Object.extend
  name: ""
  lat: null
  long: null
  goal: null
  progress: null
  
  progressStyle: (->
    goal = @get 'goal'
    progress = @get 'progress'
    percentage = Math.round(progress/goal * 100)

    "width: #{percentage}%"
  ).property('goal', 'progress')


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
