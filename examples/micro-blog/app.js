_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

window.App = new (Backbone.View.extend({
	el: '#app',
	
	Models: {},
	Collections: {},
	Views: {},
	Router: {},

	initialize: function() {
		_.bindAll(this, 'start');
	},
	
	start: function() {
	    App.router = new App.Router();
	    Backbone.history.start();
    },
    
	ajaxError: function(collection, response) {
		alert(response.statusText);
	}
	
}));

$(function() {
   App.start(); 
});

App.Models.Post = Backbone.Model.extend({
	defaults: {
		title: "",
		body: ""
	},
	
	validation: {
		title: {
			required: true,
			minLength: 5
		},
		
		body: {
			required: true
		}
	}
});

App.Collections.Posts = Backbone.Collection.extend({
	model: App.Models.Post,
	localStorage: new Backbone.LocalStorage("todos-backbone")
});

App.Views.PostEditForm = Backbone.View.extend({
  el: "#app",
  
  events: {
	  'click .js-editPost'  : 'editPost'
	},

  initialize: function() {
    _.bindAll(this);
  },
    
  showValidationErrors: function() {
    $('#errors').empty();

    for (key in this.model.validationError)
    {
      $('#errors').append("<p>" + this.model.validationError[key] + "</p>");
    }

    return false
  },

  editPost: function() {
    this.inputTitle = this.$('[name="title"]')
    this.inputBody = this.$('[name="body"]')
    
    this.model.save({title: this.inputTitle.val(), body: this.inputBody.val()}, {wait: true})
    
    if (this.model.isValid())
    {
      App.router.navigate(post_path(this.model.get('id')), {trigger: true})
    }
      
    this.showValidationErrors()

    return false
  }
    
});

App.Views.PostNewForm = Backbone.View.extend({
  el: "#app",
  
  events: {
	  'click .js-createPost': 'createPost'
  },

  initialize: function() {
    _.bindAll(this);
  },
    
  showValidationErrors: function() {
    $('#errors').empty();

    for (key in this.model.validationError)
    {
      $('#errors').append("<p>" + this.model.validationError[key] + "</p>");
    }

    return false
  },

  createPost: function() {
    this.inputTitle = this.$('[name="title"]')
    this.inputBody = this.$('[name="body"]')
    
    this.model = this.collection.create({title: this.inputTitle.val(), body: this.inputBody.val()}, {wait: true})
    
    if (this.model.isValid())
    {
      this.inputTitle.val('');
      this.inputBody.val('');
      App.router.navigate(posts_path(), {trigger: true});
    }
    this.showValidationErrors();

    return false
  }
    
});

App.Views.PostItem = Backbone.View.extend({
	events: {
		'click .js-destroy': 'destroy'
	},
	
	initialize: function() {
	    this.template = _.template($('#posts-item').text());
	},
	
	render: function() {
		this.$el.empty().append( this.template(this.model.attributes) );
		return this;
	},
	
	destroy: function() {
		this.model.destroy();
		this.$el.remove();
		return false;
	}
});
	
App.Views.PostsList = Backbone.View.extend({
	el: "#posts",

	initialize: function() {
		_.bindAll(this);
		this.collection.on('reset', this.addAll);
		this.collection.on('add', this.addOne);
	},

	addAll: function() {
		this.$el.empty();
		this.collection.forEach(this.addOne);
	},

	addOne: function(model) {
		item = new App.Views.PostItem({model: model});
		this.$el.append(item.render().el);
	}
});

// ####################
// Resources classes
// ####################

App.Views.Posts = Resources.View.extend({
  el: "#app",
  
  // Auto-define this.template = JST["backbone/templates/posts/:action"] in each action and use it in render.
  //templatesPath: "backbone/templates/posts",

  initialize: function() {
    _.bindAll(this);
    this.Posts = new App.Collections.Posts;
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
    
    this.PostsListView = new App.Views.PostsList({collection: this.Posts});
    this.Posts.fetch({reset: true, error: App.ajaxError});  
  },
  
  new: function() {
    this.template = _.template($('#posts-new').text());
    
    this.PostNewFormView = new App.Views.PostNewForm({collection: this.Posts})
  },
  
  // Auto-define this.params with :id from router
  show: function() {
    this.template = _.template($('#posts-show').text());
      
    this.Posts.fetch();
    this.post = this.Posts.findWhere({id: this.params.id});
    
    this.skipRender();
    
    if (this.post) {
        this.render(this.post.attributes);
    } else {
        App.router.navigate(posts_path(), {trigger: true});
    }
  },
  
  // Auto-define this.params with :id from router
  edit: function() {
    this.template = _.template($('#posts-edit').text());
    this.Posts.fetch();
    this.post = this.Posts.findWhere({id: this.params.id});
    
    this.skipRender();
    
    if (this.post) {
        this.render(this.post.attributes);
        this.PostEditFormView = new App.Views.PostEditForm({model: this.post});
    } else {
        App.router.navigate(posts_path(), {trigger: true});
    }
  }
    
});

App.Router = Resources.Router.extend({
  
  // Just define Resource.View which would be handle all standart actions by resource. (index, new, show, edit)
  //
  // For each resources will be created 4 helpers methods for simple generate urls for links.
  //
  // Example:
  //     posts_path() => '#posts'
  //     new_post_path() => '#posts/new'
  //     post_path(12) => '#posts/12'
  //     edit_post_path(12) => '#posts/12/edit'
  //     special_posts_path() => '#posts/special'
  //     details_post_path(12) => '#posts/12/details'
  
  resources: {
    posts : {view: App.Views.Posts, actions: ['index', 'new'], item_actions: ['show', 'edit']}
  },
  
  redirects: {
    ".*"    : "posts",
    "e/:id" : "posts/:id/edit"
  }
    
});