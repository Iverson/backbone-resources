// ####################
// Resources classes
// ####################

App.Views.Posts = Resources.View.extend({
  el: "#app",
  
  // Auto-define this.template = JST["backbone/templates/posts/:action"] in each action and use it in render.
  //JSTpath: "backbone/templates/posts",

  initialize: function() {
    var that = this;
    
    _.bindAll(this);
    this.Posts = new App.Collections.Posts;
    this.Posts.fetch({reset: true, error: App.ajaxError});
    
    if (this.Posts.length == 0) {
      _.forEach(postBootstrap, function(post) {
        that.Posts.create(post, {wait: true});
      });
    }
    
  },
  
  // Actions methods
  // ------------------------
  //
  // Automaticly call by Resource.Router when standart route fire.
  // After each action by convention fires render() method with params from router (:id) and with template from JST["backbone/templates/posts/:action"]
  // to disable this callback you should call skipRender() in body your action and if you want call render() by yourself, template would by also send automaticly.
  
  index: function() {
    this.template = _.template($('#posts-index').text());
    this.render();
    
    this.PostsListView = this.PostsListView || new App.Views.PostsList({collection: this.Posts});    
    this.Posts.fetch({reset: true, error: App.ajaxError});
  },
  
  new: function() {
    this.template = _.template($('#posts-new').text());
    
    this.PostNewFormView = new App.Views.PostNewForm({collection: this.Posts})
  },
  
  // Auto-define this.params with :id from router
  show: function() {
    this.template = _.template($('#posts-show').text());
      
    //this.Posts.fetch({reset: true, error: App.ajaxError});
    var post = this.Posts.findWhere({id: this.params.id});
    
    this.skipRender();
    
    if (post) {
      this.render(post.attributes);
    } else {
      App.router.navigate(posts_path(), {trigger: true});
    }
  },
  
  // Auto-define this.params with :id from router
  edit: function() {
    this.template = _.template($('#posts-edit').text());
    this.Posts.fetch();
    var post = this.Posts.findWhere({id: this.params.id});
    
    this.skipRender();
    
    if (post) {
        this.render(post.attributes);
        
        if (this.PostEditFormView) {
          this.PostEditFormView.model = post;
        } else {
          this.PostEditFormView = new App.Views.PostEditForm({model: post});
        }
        
    } else {
        App.router.navigate(posts_path(), {trigger: true});
    }
  }
    
});

App.Router = Resources.Router.extend({
  
  resources: {
    posts : {view: App.Views.Posts, actions: ['index', 'new'], item_actions: ['show', 'edit']}
  },
  
  redirects: {
    ".*"    : "posts",
    "e/:id" : "posts/:id/edit"
  }
    
});