require 'views/GridTileView.js'

BFI.GridView = Ember.CollectionView.extend
  itemViewClass: BFI.GridTileView
  contentBinding: "controller.content"
