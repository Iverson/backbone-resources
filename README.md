# Backbone.Resources 0.1.0

No need more define route actions inside [Backbone](http://documentcloud.github.com/backbone) Router.

## Why you need it?

With standart Backbone.Router your have to write long list of routes for each action of your app, and worse, you have to define transit actions for each route inside Router function which as a rule just trigger special events which handled in other Views. So why we need these extra functions and events handlers? What about declarative relation between resource routes and View-actions like in Rails router? And what about declarative redirects in a single line of code also without router actions? With Backbone.Resources you can do this and some more!
Features of Backbone.Resources:

* Resource Routing like in Rails. Your declare in a single line of code all routes for one resource and bind it with special View that service it.
* Resource route action when matching will automaticly call same name method of resources View. Dont need define actions inside Router!
* All Resources.View have default `render()` method and calls it after each action method call. To `render()` method will be automaticly passed all params from route and you can use it in template.
* On each route will be created a helper funtion for easy generating urls in templates. Dont need hardcode urls in strings!
* Declarative redirects in a single line without uses Router actions.
* If you use JST, just set path to resource and templates for all actions will be setting automaticly.

## Getting started

#### Download source from [GitHub](https://github.com/Iverson/backbone-resources).

* Development: [backbone-resources.js](https://raw.github.com/Iverson/backbone-resources/master/build/backbone-resources.js) *7.273 kb*
* Production: [backbone-resources.min.js](https://raw.github.com/Iverson/backbone-resources/master/build/backbone-resources.min.js) *3.351 kb*

#### Include plugin in HTML and create skeleton something like this:

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Backbone.Resources demo</title>
	<script type="text/javascript" src="../../vendor/jquery.min.js"></script>
	<script type="text/javascript" src="../../vendor/underscore.js"></script>
	<script type="text/javascript" src="../../vendor/backbone.js"></script>
	<script type="text/javascript" src="../../build/backbone-resources.min.js"></script>
	<script type="text/javascript" src="app.js"></script>
	<script type="text/javascript" src="resources.js"></script>
</head>
<body>
    <script type="text/javascript">
        $(function() {
            router = new Router();
	        Backbone.history.start();   
        });
    </script>
    
    <div id="app">
		Loading....
	</div>
	
	<!-- Templates -->
	<script type="text/template" id="posts-edit">
		<h2>Edit post #<%= id %></h2>
		<p></p>

		<a class="btn btn-default" href="<%= posts_path() %>">Back to Index</a>
	</script>
	
	<script type="text/template" id="posts-index">
        <h2>Posts index <small>(<a href="<%= new_post_path()  %>" class="">Create new post</a>)</small></h2>

        <p><a href="<%= post_path(1) %>">Show post 1</a> (<a href="<%= edit_post_path(1) %>">Edit</a>)</p>
        <p><a href="<%= post_path(2) %>">Show post 2</a> (<a href="<%= edit_post_path(2) %>">Edit</a>)</p>
        <br />
        <p><a href="#e/2">Redirect</a></p>
	</script>
	
	<script type="text/template" id="posts-new">
		<h2>New post</h2>
		<p></p>

		<a class="btn btn-default" href="<%= posts_path() %>">Back to Index</a>
	</script>
	
	<script type="text/template" id="posts-show">
		<h2>Show post #<%= id %></h2>
		<p></p>

		<a class="btn btn-default" href="<%= posts_path() %>">Back to Index</a>
	</script>
</body>
</html>
```

#### Create router from Resources.Router and View from Resources.View.

```js
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
  }
});

Router = Resources.Router.extend({
  resources: {
    posts : {view: PostsView, actions: ['index', 'new'], item_actions: ['show', 'edit']}
  },
  
  redirects: {
    ".*"    : "posts",
    "e/:id" : "posts/:id/edit"
  }
});
```

#### And this is all! Check magic in your page!

For each resource routes will be created helper method for simple generating route url.
```js
  // Example:
  posts_path()         // => '#posts'
  new_post_path()      // => '#posts/new'
  post_path(12)        // => '#posts/12'
  edit_post_path(12)   // => '#posts/12/edit'
```

* On matching route `#posts/new` will be called `new` action of `PostsView` and after call `render()` with `_.template($('#posts-new').text())`.

* On matching `#posts/2/edit` be called `edit` action and `render()` with `_.template($('#posts-edit').text())` and params `{id: 2}`.

* Root route will be redirected to `#posts` and `#e/2/` will be redirected to `#posts/2/edit`.

#### Cool! But I'm too lazy setting template even...

No problem. Use JST for declarate resource templates and forget about it.

```js
App.Views.Posts = Resources.View.extend({
  el: "#app",
  
  // Auto-define this.template = JST["backbone/templates/posts/:action"] in each action and use it in render.
  JSTpath: "backbone/templates/posts",
  
  ....

  index: function() {
  },

  new: function() {
  },
  
  ....
```

#### Stop magic! I wanna control it.

As you wish. For skip `render()` callback just call `this.skipRender();` in your action.

For using custom template engine, for example <strong>Handlebars</strong>, just set compiled template to `this.template` in action:

```js
  ....

  index: function() {
    this.template = Handlebars.compile(source);
  },
  
  ...
```

If you dont wana bind any View with resource just dont set `view:` in resource:

```js
  ...
  resources: {
    posts : {actions: ['index', 'new'], item_actions: ['show', 'edit']}
  },
  ...
```

and Router just will be trigger action events on itself like `routes:posts:edit` with url params and this is also very useful.

#### Demo

Check these [examples](https://github.com/Iverson/backbone-resources/tree/master/examples).