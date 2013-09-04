PostsView = Resources.View.extend({
  el: "#app",

  initialize: function() {
    
  },
  
  index: function() {
    this.template = _.template($('#posts-index').text());
  },

  new: function() {
    this.template = _.template($('#posts-new').text());
  },

  // Auto-define this.params with :id from router
  show: function() {
    this.template = _.template($('#posts-show').text());
  },

  // Auto-define this.params with :id from router
  edit: function() {
    this.template = _.template($('#posts-edit').text());
  },

  special: function() {
    this.template = _.template($('#posts-index').text());
  }
    
});

Router = Resources.Router.extend({
  
  resources: {
    posts : {view: PostsView, actions: ['index', 'new', 'special'], item_actions: ['show', 'edit']}
  },
  
  redirects: {
    ".*"    : "posts",
    "e/:id" : "posts/:id/edit"
  }
    
});