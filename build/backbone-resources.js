/* Backbone.Resources 0.1.0
 * https://github.com/Iverson/backbone-resources
 *
 * Copyright (c) 2014 Alexey Krasman
 * Licensed under the MIT license.
 */

var Resources = (function(Backbone, _) {
  
  /// Default options
  // ---------------
  var Resources     = {},
      resources     = {},
      views         = {},
      W             = window,
      redirectCount = 0,
      defaultParams = {actions: ['index', 'new'], item_actions: ['show', 'edit'], silent: false},
      mixParams     = null,
      actionsMap    = {      
        resources: {
          defaults: {
             index: '_resource_'
          },
          custom: '_resource_/:action'
        },
        
        items: {
          defaults: {
             show: '_resource_/:id',
          },
          custom:'_resource_/:id/:action'
        }
         
      };
  
  // Resource.Router
  // ------------------------
  //
  // Allows declaratively define resources width actions (index, show, new, edit, etc..) and auto-bind it with the same name methods in special Resources.View.
  
  Resources.Router = Backbone.Router.extend({
    
    constructor : function (options) {
        
        Backbone.Router.prototype.constructor.apply(this, arguments);
        
        for (name in this.resources) {
          this._createResource(name, this.resources[name]);
        }
        
        for (rout in this.redirects) {
          this._createRedirect(rout, this.redirects[rout]);
        }
    },
    
    _routesHandler: function() {
      var route    = Backbone.history.fragment;
          params   = route.split("/"),
          name     = params[0],
          resource = resources[name],
          view     = resource.view,
          routeMask        = params.join('/').replace(name, '_resource_'),
          invertActionsMap = _.invert(actionsMap.resources.defaults),
          action   = null;

      if (routeMask in invertActionsMap)
      {
        action = invertActionsMap[routeMask];
      } else {
        action = params[1];
      }
      
      if (typeof view == 'function')
      {
        views[name] = views[name] || new view();
        views[name].action(action, {id: arguments[0]});
      }
      
      this.trigger('route:' + name + ':' + action, {id: arguments[0]});
    },
    
    _itemsRoutesHandler: function() {
      var route    = Backbone.history.fragment;
          params   = route.split("/"),
          name     = params[0],
          resource = resources[name],
          view     = resource.view,
          routeMask        = null,
          invertActionsMap = _.invert(actionsMap.items.defaults),
          action = null;
      
      params[1] = ':id';
      routeMask = params.join('/').replace(name, '_resource_');
      
      if (routeMask in invertActionsMap)
      {
        action = invertActionsMap[routeMask];
      } else {
        action = params[2];
      }
      
      if (typeof view == 'function')
      {
        views[name] = views[name] || new view();
        views[name].action(action, {id: arguments[0]});
      }
      
      this.trigger('route:' + name + ':' + action, {id: arguments[0]});
    },

    _createResource: function(name, params) {
      
      switch (typeof params) {
        
        case 'object':
          mixParams              = _.extend(defaultParams, params);
          mixParams.actions      = params.actions || defaultParams.actions;
          mixParams.item_actions = params.item_actions || defaultParams.item_actions;
          
          resources[name] = {view: mixParams.view, params: mixParams}
          
          this._createsResourceRoutes(name, mixParams);
          break;
        
        default:
          resources[name] = {view: params, params: defaultParams};
          
          this._createsResourceRoutes(name, defaultParams);
          break;
          
      }
    },
    
    _createsResourceRoutes: function(name, params) {
      
      var action,
          actionRoute;
      
      for (var i=0; i < params.item_actions.length; i++) {
        action      = params.item_actions[i];
        this._createRoute(name, action, actionsMap.items, '_itemsRoutesHandler', 'item');
      }
      
      for (var i=0; i < params.actions.length; i++) {
        action      = params.actions[i];
        this._createRoute(name, action, actionsMap.resources, '_routesHandler', 'collection');
      }
    },
    
    _createRoute: function(name, action, actionsMap, handler, object)
    {
      var actionRoute;
          routMask    = (action in actionsMap.defaults) ? actionsMap.defaults[action] : actionsMap.custom;
          actionRoute = routMask.replace('_resource_', name).replace(':action', action);

      this.route(actionRoute, handler);
      this._createRouteHelper(name, action, actionsMap, actionRoute, object);
      
    },
    
    _createRouteHelper: function(name, action, actionsMap, actionRoute, object) {
      var helperName, itemName = name.slice(0,-1);
      
      if (object == 'item') {
        helperName = (action == 'show') ? (itemName + '_path') : (action + '_' + itemName + '_path');
        
        W[helperName] = function(id){
          return '#' + actionRoute.replace(':id', id);
        }
        
      } else {
        
        helperName = (action == 'new') ? helperName = action + '_' + itemName + '_path' : helperName = action + '_' + name + '_path';
        helperName = (action == 'index') ? helperName = name + '_path' : helperName;
        
        W[helperName] = function() {
          return '#' + actionRoute;
        }
      }
      
    },
    
    _createRedirect: function(route1, route2) {
      var redirectActionName = '__redirect__' + redirectCount;
      
      this[redirectActionName] = function() {
        var re = /:(\w+)/i;
        
        for (var i=0; i < arguments.length; i++) {
          route2 = route2.replace(re, arguments[i]);
        }
        this.navigate(route2, {trigger: true, replace: true});
      }
      
      this.route(route1, redirectActionName);
    }
    
  });
  
  // Resources.View
  // ------------------------
  //
  // Support declarated resource GET-method routes (index, show, new, edit) and bind it for special Resources.View.
  
  Resources.View = Backbone.View.extend({
    
    action: function(action, params) {
      this._runningAction = action;
      
      this.template = null;
      this._actionTemplatePath = (this.JSTpath) ? this.JSTpath + "/" + action : null;
      
      if (typeof JST != 'undefined') {
        this.template = JST[this._actionTemplatePath];
      }
      this.params = params;

      this[action](params);
      
      if (!this.rendered && this.template)
      {
        this.render();
      }
      this.rendered = false;
      this._runningAction = null;
    },
    
    render: function(params) {
      var that = this;
      params = params || this.params;
      
      if ((typeof this.template == 'function') && this._runningAction)
      {
        this.$el.empty().append(this.template(params)).ready(function()
        {
          that.rendered = false;
        });
      }
      this.rendered = true;
      return this;
    },
    
    skipRender: function() {
      this.rendered = true;
    }
    
  });
  
  return Resources;
  
})(Backbone, _);