


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
    var that = this;
    var id = incID(this.collection);
    
    this.inputTitle = this.$('[name="title"]')
    this.inputBody = this.$('[name="body"]')
    
    this.model = this.collection.create({id: id, title: this.inputTitle.val(), body: this.inputBody.val()}, {wait: true});
    
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
		$('#posts').empty();
		this.collection.forEach(this.addOne);
	},

	addOne: function(model) {
		item = new App.Views.PostItem({model: model});
		$('#posts').append(item.render().el);
	}
});

var incID = function(collection) {
  var length = collection.length;
  
  return (length == 0) ? '1' : ((collection.models[length-1].get('id')*1 + 1) + '');
}

var postBootstrap = [
  {id: '1', title: "Welcome to my blog!", body: "Natalie Cole, a young writer, is late to board the ship that was to take her home to America. Already depressed by a chain of misfortunes, Natalie becomes absolutely despondent. Just when she is about to give up hope of getting home, she meets a captain at the port who is sailing a cargo ship to her very same destination, and he invites her to sail along with him and his crew. Natalie, relieved at her good fortune, agrees. Little does she know, this random stroke of good luck hasn't come without a price. Natalie has unwittingly embarked on a dangerous and exciting journey where she must prevent ancient evil from awakening inside a mysterious antique collection on board the cargo ship! Can Natalie save the crew and its captain from evil spirits and still return home? "},
  {id: '2', title: "Sunny gone, sadly...", body: "Everybody do what you're doing \nSmile will bring a sunshine day \nEverybody do what you're doing \nSmile will bring a sunshine day."},
  {id: '3', title: "Use my new plugin Backbone.Resources.", body: "Add some magic to your router."}
];