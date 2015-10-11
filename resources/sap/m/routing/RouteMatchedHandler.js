/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/m/InstanceManager','sap/m/NavContainer','sap/m/SplitContainer','sap/ui/base/Object','sap/ui/core/routing/History','sap/ui/core/routing/Router'],function(q,I,N,S,B,H,R){"use strict";var a=B.extend("sap.m.routing.RouteMatchedHandler",{constructor:function(r,c){this._aQueue=[];if(c===undefined){this._bCloseDialogs=true}else{this._bCloseDialogs=!!c}r.attachRouteMatched(this._onHandleRouteMatched,this);r.attachRoutePatternMatched(this._handleRoutePatternMatched,this);this._oRouter=r}});a.prototype.destroy=function(){this._oRouter.detachRouteMatched(this._onHandleRouteMatched,this);this._oRouter.detachRoutePatternMatched(this._handleRoutePatternMatched,this);this._oRouter=null;return this};a.prototype.setCloseDialogs=function(c){this._bCloseDialogs=!!c;return this};a.prototype.getCloseDialogs=function(){return this._bCloseDialogs};a.prototype._handleRoutePatternMatched=function(e){var t=+e.getParameter("config").viewLevel,h=H.getInstance(),b,r=this._createResultingNavigations(e.getParameter("name"));this._closeDialogs();if(isNaN(t)||isNaN(this._iCurrentViewLevel)||t===this._iCurrentViewLevel){b=h.getDirection()==="Backwards"}else{b=t<this._iCurrentViewLevel}while(r.length){this._handleRouteMatched(r.shift().oParams,b)}this._iCurrentViewLevel=t};a.prototype._onHandleRouteMatched=function(e){this._aQueue.push({oTargetControl:e.getParameter("targetControl"),oArguments:e.getParameter("arguments"),oConfig:e.getParameter("config"),oView:e.getParameter("view"),sRouteName:e.getParameter("name")})};a.prototype._createResultingNavigations=function(r){var i,f,c,C,o,b=[],v,d,e,p,g;while(this._aQueue.length){f=false;c=this._aQueue.shift();C=c.oTargetControl;d=C instanceof S;e=C instanceof N;v=c.oView;o={oContainer:C,oParams:c,bIsMasterPage:(d&&!!C.getMasterPage(v.getId()))};p=d&&c.oConfig.preservePageInSplitContainer&&C.getCurrentPage(o.bIsMasterPage)&&r!==c.sRouteName;if(!(e||d)||!v){continue}for(i=0;i<b.length;i++){g=b[i];if(g.oContainer!==C){continue}if(e||sap.ui.Device.system.phone){b.splice(i,1);b.push(o);f=true;break}if(g.bIsMasterPage===o.bIsMasterPage){if(p){break}b.splice(i,1);b.push(o);f=true;break}}if(C instanceof S&&!sap.ui.Device.system.phone){o.bIsMasterPage=!!C.getMasterPage(v.getId())}if(!f){if(!!C.getCurrentPage(o.bIsMasterPage)&&p){continue}b.push(o)}}return b};a.prototype._handleRouteMatched=function(p,b){var t=p.oTargetControl,P,A=p.oArguments,T=p.oConfig.transition||"",o=p.oConfig.transitionParameters,v=p.oView.getId(),n=t instanceof S&&!!t.getMasterPage(v);if(t.getCurrentPage(n).getId()===v){q.sap.log.info("navigation to view with id: "+v+" is skipped since it already is displayed by its targetControl");return}q.sap.log.info("navigation to view with id: "+v+" the targetControl is "+t.getId()+" backwards is "+b);if(b){P=t.getPreviousPage(n);if(!P||P.getId()!==v){t.insertPreviousPage(v,T,A)}t.backToPage(v,A,o)}else{t.to(v,T,A,o)}};a.prototype._closeDialogs=function(){if(!this._bCloseDialogs){return}if(I.hasOpenPopover()){I.closeAllPopovers()}if(I.hasOpenDialog()){I.closeAllDialogs()}};return a},true);