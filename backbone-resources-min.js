var Resources=function(e,t){var r={},i={},n={},a=window,s=0,o={actions:["index","new"],item_actions:["show","edit"],silent:false},c=null,u={resources:{defaults:{index:"_resource_"},custom:"_resource_/:action"},items:{defaults:{show:"_resource_/:id"},custom:"_resource_/:id/:action"}};r.Router=e.Router.extend({constructor:function(t){e.Router.prototype.constructor.apply(this,arguments);for(name in this.resources){this._createResource(name,this.resources[name])}for(rout in this.redirects){this._createRedirect(rout,this.redirects[rout])}},_routesHandler:function(){var r=e.history.fragment;params=r.split("/"),name=params[0],resource=i[name],view=resource.view,routeMask=params.join("/").replace(name,"_resource_"),invertActionsMap=t.invert(u.resources.defaults),action=null;if(routeMask in invertActionsMap){action=invertActionsMap[routeMask]}else{action=params[1]}if(typeof view=="function"){n[name]=n[name]||new view;n[name].action(action,{id:arguments[0]})}this.trigger("route:"+name+":"+action,{id:arguments[0]})},_itemsRoutesHandler:function(){var r=e.history.fragment;params=r.split("/"),name=params[0],resource=i[name],view=resource.view,routeMask=null,invertActionsMap=t.invert(u.items.defaults),action=null;params[1]=":id";routeMask=params.join("/").replace(name,"_resource_");if(routeMask in invertActionsMap){action=invertActionsMap[routeMask]}else{action=params[2]}if(typeof view=="function"){n[name]=n[name]||new view;n[name].action(action,{id:arguments[0]})}this.trigger("route:"+name+":"+action,{id:arguments[0]})},_createResource:function(e,r){switch(typeof r){case"object":c=t.extend(o,r);c.actions=r.actions||o.actions;c.item_actions=r.item_actions||o.item_actions;i[e]={view:c.view,params:c};this._createsResourceRoutes(e,c);break;default:i[e]={view:r,params:o};this._createsResourceRoutes(e,o);break}},_createsResourceRoutes:function(e,t){var r,i;for(var n=0;n<t.item_actions.length;n++){r=t.item_actions[n];this._createRoute(e,r,u.items,"_itemsRoutesHandler","item")}for(var n=0;n<t.actions.length;n++){r=t.actions[n];this._createRoute(e,r,u.resources,"_routesHandler","collection")}},_createRoute:function(e,t,r,i,n){var a;routMask=t in r.defaults?r.defaults[t]:r.custom;a=routMask.replace("_resource_",e).replace(":action",t);this.route(a,i);this._createRouteHelper(e,t,r,a,n)},_createRouteHelper:function(e,t,r,i,n){var s,o=e.slice(0,-1);if(n=="item"){s=t=="show"?o+"_path":t+"_"+o+"_path";a[s]=function(e){return"#"+i.replace(":id",e)}}else{s=t=="new"?s=t+"_"+o+"_path":s=t+"_"+e+"_path";s=t=="index"?s=e+"_path":s;a[s]=function(){return"#"+i}}},_createRedirect:function(e,t){var r="__redirect__"+s;this[r]=function(){var e=/:(\w+)/i;for(var r=0;r<arguments.length;r++){t=t.replace(e,arguments[r])}this.navigate(t,{trigger:true,replace:true})};this.route(e,r)}});r.View=e.View.extend({action:function(e,t){this._runningAction=e;this.template=null;this._actionTemplatePath=this.JSTpath?this.JSTpath+"/"+e:null;if(typeof JST!="undefined"){this.template=JST[this._actionTemplatePath]}this.params=t;this[e](t);if(!this.rendered&&this.template){this.render()}this.rendered=false;this._runningAction=null},render:function(e){var t=this;e=e||this.params;if(typeof this.template=="function"&&this._runningAction){this.$el.empty().append(this.template(e)).ready(function(){t.rendered=false})}this.rendered=true;return this},skipRender:function(){this.rendered=true}});return r}(Backbone,_);