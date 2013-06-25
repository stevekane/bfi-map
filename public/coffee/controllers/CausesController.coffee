BFI.CausesController = Ember.ArrayController.extend
  createCauses: (data) ->
    for cause in data.causes
      cause.progress = Math.round(Math.random() * 100)
      this.pushObject BFI.Cause.create(cause)
