sap.ui.core.mvc.Controller.extend("com.mlauffer.trip.view.Detail", {

	onInit : function() {
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
	},
	
	onRouteMatched : function(oEvent) {
		// when detail navigation occurs, update the binding context
		if (oEvent.getParameter("name") === "trip") {
			var sProductPath = "/Trips/" + oEvent.getParameter("arguments").trip;
			var oView = this.getView();
			oView.bindElement(sProductPath);
			
			// Check that the product specified actually was found
			oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				var oData = oView.getModel().getData(sProductPath);
				if (!oData) {
					sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
						currentView : oView,
						targetViewName : "com.mlauffer.trip.view.NotFound",
						targetViewType : "XML"
					});
				}
			}, this));
		}
	},
	
	onNavBack : function() {
		// This is only relevant when running on phone devices
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("main");
	},

	onDetailSelect : function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("editExpense",{
			trip : oEvent.getSource().getBindingContext().getPath().substring(7, 8),
			expense : oEvent.getSource().getBindingContext().getPath().slice(-1)
		}, true);
	},
	
	onEditTrip : function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("editTrip",{
			trip : oEvent.getSource().getBindingContext().getPath().slice(-1)
		}, true);
	},
	
	onAddExpense : function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("expense",{
			trip : oEvent.getSource().getBindingContext().getPath().slice(-1)
		}, true);
	}

});