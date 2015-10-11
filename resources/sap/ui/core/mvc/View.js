/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','sap/ui/core/Control','sap/ui/core/ExtensionPoint','sap/ui/core/library'],function(q,M,C,E,l){"use strict";var V=C.extend("sap.ui.core.mvc.View",{metadata:{library:"sap.ui.core",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},viewName:{type:"string",group:"Misc",defaultValue:null},displayBlock:{type:"boolean",group:"Appearance",defaultValue:false}},aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},events:{afterInit:{},beforeExit:{},afterRendering:{},beforeRendering:{}}}});V.prototype._initCompositeSupport=function(s){this.oViewData=s.viewData;this.sViewName=s.viewName;if(sap.ui.core.CustomizingConfiguration&&sap.ui.core.CustomizingConfiguration.hasCustomProperties(this.sViewName,this)){var t=this;this._fnSettingsPreprocessor=function(s){var i=this.getId();if(sap.ui.core.CustomizingConfiguration&&i){if(t.isPrefixedId(i)){i=i.substring((t.getId()+"--").length)}var m=sap.ui.core.CustomizingConfiguration.getCustomProperties(t.sViewName,i,t);if(m){s=q.extend(s,m)}}}}if(this.initViewSettings){this.initViewSettings(s)}c(this,s);if(this.onControllerConnected){this.onControllerConnected(this.oController)}this.fireAfterInit()};V.prototype.getController=function(){return this.oController};V.prototype.byId=function(i){return sap.ui.getCore().byId(this.createId(i))};V.prototype.createId=function(i){if(!this.isPrefixedId(i)){i=this.getId()+"--"+i}return i};V.prototype.isPrefixedId=function(i){return!!(i&&i.indexOf(this.getId()+"--")===0)};function c(t,s){if(!sap.ui.getCore().getConfiguration().getControllerCodeDeactivated()){var o=s.controller;if(!o&&t.getControllerName){var d=t.getControllerName();if(d){o=sap.ui.controller(d)}}if(o){t.oController=o;o.connectToView(t)}}else{t.oController={}}}V.prototype.getViewData=function(){return this.oViewData};V.prototype.exit=function(){this.fireBeforeExit();this.oController=null};V.prototype.onAfterRendering=function(){this.fireAfterRendering()};V.prototype.onBeforeRendering=function(){this.fireBeforeRendering()};V.prototype.clone=function(i,L){var s={},k,o;for(k in this.mProperties&&!(this.isBound&&this.isBound(k))){if(this.mProperties.hasOwnProperty(k)){s[k]=this.mProperties[k]}}o=C.prototype.clone.call(this,i,L,{cloneChildren:false,cloneBindings:true});o.applySettings(s);return o};sap.ui.view=function(i,v,t){var a=null,o={};if(typeof i==="object"||typeof i==="string"&&v===undefined){v=i;i=undefined}if(v){if(typeof v==="string"){o.viewName=v}else{o=v}}if(i){o.id=i}if(t){o.type=t}if(sap.ui.core.CustomizingConfiguration){var b=sap.ui.core.CustomizingConfiguration.getViewReplacement(o.viewName,M._sOwnerId);if(b){q.sap.log.info("Customizing: View replacement for view '"+o.viewName+"' found and applied: "+b.viewName+" (type: "+b.type+")");q.extend(o,b)}else{q.sap.log.debug("Customizing: no View replacement found for view '"+o.viewName+"'.")}}if(!o.type){throw new Error("No view type specified.")}else if(o.type===sap.ui.core.mvc.ViewType.JS){a=new sap.ui.core.mvc.JSView(o)}else if(o.type===sap.ui.core.mvc.ViewType.JSON){a=new sap.ui.core.mvc.JSONView(o)}else if(o.type===sap.ui.core.mvc.ViewType.XML){a=new sap.ui.core.mvc.XMLView(o)}else if(o.type===sap.ui.core.mvc.ViewType.HTML){a=new sap.ui.core.mvc.HTMLView(o)}else if(o.type===sap.ui.core.mvc.ViewType.Template){a=new sap.ui.core.mvc.TemplateView(o)}else{throw new Error("Unknown view type "+o.type+" specified.")}return a};V._resolveEventHandler=function(n,o){var h;if(!sap.ui.getCore().getConfiguration().getControllerCodeDeactivated()){switch(n.indexOf('.')){case 0:h=o&&o[n.slice(1)];break;case-1:h=o&&o[n];if(h!=null){break}default:h=q.sap.getObject(n)}}else{h=function(){}}if(typeof h==="function"){h._sapui_handlerName=n;return[h,o]}};return V},true);