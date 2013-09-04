# Backbone.Resources v0.0.1

No need more define route actions inside [Backbone](http://documentcloud.github.com/backbone) Router.

## Why you need it?

In standart Backbone.Router your have to write long list of routes for each action of your app, and worse, you have to define transit actions for each route inside Router function. You never put buisness logic or view(render) logic in Router actions beacause it is bad pattern. As a rule Router actions just trigger special events which handled in special Views. Why we need these extra actions and events handlers? What about declarative relation between routes and actions in special View that service these routes? And what about declarative redirects in one line of code also without router actions? With Backbone.Resources you can do this and some more!
Features of Backbone.Resources:

* Resource Routing like in Rails. Your declare in a single line of code all routes for one resource and bind it with special View that service it.
* Resource route action when matching will automaticly call same name method of resources View. Dont need define actions inside Router!
* All Resources.View have default Render method and calls it after each action method call. To render() will be automaticly passed all params from route and you can use it in template.
* On each route will be created a helper funtion for easy generating urls in templates. Dont need hardcode urls in strings!
* Declarative redirects in a single line without uses Router actions.
* If you use JST templates for actions will be setting automaticly.

## Getting started

Download source from [GitHub](https://github.com/Iverson/backbone-resources).

* Development: [backbone-resources.js](https://raw.github.com/Iverson/backbone-resources/master/backbone-resources.js) *6.857 kb*

### Create router from Resources.Router class.

Resources.Router extends from Backbone.Router.

#### Example

```js
App.Router = Resources.Router.extend({
  resources: {
    posts : {view: App.Views.Posts, actions: ['index', 'new', 'special'], item_actions: ['show', 'edit']}
  },
  
  redirects: {
    ".*"    : "posts",
    "e/:id" : "posts/:id/edit"
  }
});
```

### Create resource View from Resources.View class.

Resources.View extends from Backbone.View.

#### Example

```js
App.Views.Posts = Resources.View.extend({
  el: "#app",

  initialize: function() {
    _.bindAll(this);
  },
  
  // Actions methods
  // ------------------------
  //
  // Automaticly call by Resource.Router when routes fire.
  // After each action by convention fires render() method with params from router (:id) and with template from this.template
  // to disable this callback you should call skipRender() in body your action and if you want call render() by yourself, template would by also send automaticly.
  
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
```

And this is all!

For each resource routes will be created helper method for simple generating route url.
```js
  // Example:
  posts_path()         // => '#posts'
  new_post_path()      // => '#posts/new'
  post_path(12)        // => '#posts/12'
  edit_post_path(12)   // => '#posts/12/edit'
  special_posts_path() // => '#posts/special'
```

On matching route `#posts/new` will be called 'new' action of App.Views.Posts and after call `render()` with `_.template($('#posts-new').text())`.

On matching `#posts/12/edit` be called 'edit' action and `render()` with `_.template($('#posts-edit').text())` and params `{id: 12}`.

Root route will be redirected to `#posts` and `#e/12/` will be redirected to `#posts/12/edit`.

#### Use JST for declarate resource templates.

```js
App.Views.Posts = Resources.View.extend({
  el: "#app",
  
  // Auto-define this.template = JST["backbone/templates/posts/:action"] in each action and use it in render.
  JSTpath: "backbone/templates/posts",
  
  ....
```

### Stop magic! I wanna control it.

As you wish. For skip `render()` callback just call `this.skipRender();` in your action.