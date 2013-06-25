BFI.Cause = Ember.Object.extend
  name: ""
  lat: null
  long: null
  
  progressStyle: (->
    "width: #{@get('progress')}"
  ).property('progress')

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
