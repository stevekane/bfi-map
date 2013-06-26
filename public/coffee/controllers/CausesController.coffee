BFI.CausesController = Ember.ArrayController.extend
  needs: ['cause']

  createCauses: (data) ->
    for cause in data.causes
      this.pushObject BFI.Cause.create(cause)
