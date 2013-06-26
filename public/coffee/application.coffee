window.BFI = Ember.Application.create()
  #LOG_ACTIVE_GENERATION: true
  #LOG_VIEW_LOOKUPS: true

require 'controllers/CausesController.js'
require 'controllers/CauseController.js'

require 'views/CausesView.js'
require 'views/CauseItemView.js'
require 'views/CauseListView.js'

require 'views/CausesGridView.js'
require 'views/CausesMapView.js'

require 'views/GridTileView.js'
require 'views/GridView.js'
require 'views/MapContainerView.js'

require 'views/MapView.js'

require 'router/router.js'
require 'models/Cause.js'
