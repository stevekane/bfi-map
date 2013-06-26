BFI.CausesController = Ember.ArrayController.extend
  needs: ['cause']

  createCauses: (data) ->
    for cause in data.causes
      this.pushObject BFI.Cause.create(cause)

  cities: ['Chicago', 'New York', 'San Francisco']

  activeCity: 'Chicago'

  types: ['Art', 'Education', 'Philanthropy']

  activeType: 'Art'
