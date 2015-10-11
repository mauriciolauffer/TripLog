sap.ui.core.mvc.Controller.extend("com.mlauffer.trip.view.Detail", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf view.Detail
	 */
	onInit: function() {
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
	},

	onAfterRendering: function() {
		var mGroupFunctions = {
			Date: function(oContext) {
				var name = oContext.getProperty("DateJS");
				return {
					key: com.mlauffer.trip.util.Formatter.dateSAP(name),
					text: com.mlauffer.trip.util.Formatter.dateLong(name)
				};
			}
		};
		var vGroup = mGroupFunctions.Date;
		var bDescending = false;
		var aSorter = [];
		aSorter.push(new sap.ui.model.Sorter("DateJS", bDescending, vGroup));
		aSorter.push(new sap.ui.model.Sorter("DateJS", bDescending));
		this.getView().byId("expenses").getBinding("items").sort(aSorter);
	},

	onRouteMatched: function(oEvent) {
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
						currentView: oView,
						targetViewName: "com.mlauffer.trip.view.NotFound",
						targetViewType: "XML"
					});
				}
			}, this));
		}
	},

	onNavBack: function() {
		// This is only relevant when running on phone devices
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("main");
	},

	onDetailSelect: function(oEvent) {
		var sPath = oEvent.getSource().getBindingContext().getPath();
		sap.ui.core.UIComponent.getRouterFor(this).navTo("editExpense", {
			//trip: sPath.substring(7, 8),
			//expense : oEvent.getSource().getBindingContext().getPath().slice(-1)
			trip: sPath.substring(7, sPath.indexOf("/", 7)),
			expense: sPath.slice(sPath.lastIndexOf("/") + 1)
		}, true);
	},

	onEditTrip: function(oEvent) {
		var sPath = oEvent.getSource().getBindingContext().getPath();
		sap.ui.core.UIComponent.getRouterFor(this).navTo("editTrip", {
			trip: sPath.slice(sPath.lastIndexOf("/") + 1)
		}, true);
	},

	onAddExpense: function(oEvent) {
		var sPath = oEvent.getSource().getBindingContext().getPath();
		sap.ui.core.UIComponent.getRouterFor(this).navTo("expense", {
			trip: sPath.slice(sPath.lastIndexOf("/") + 1)
		}, true);
	}

});