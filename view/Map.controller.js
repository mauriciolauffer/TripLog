sap.ui.core.mvc.Controller.extend("com.mlauffer.trip.view.Map", {

	__oMap: null,

	onInit: function() {
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
	},

	onAfterRendering: function() {
		var oLatlng = new google.maps.LatLng(-30.0222, -51.1597);
		var mapOptions = {
			zoom: 10,
			center: oLatlng
		};
		var oMap = new google.maps.Map(this.getView().byId("mapCanvas").getDomRef(), mapOptions);
		this.__oMap = oMap;
		console.dir(oMap);

		//var oModel = this.getView().getModel();
		//var oData = oModel.getProperty("/AddressCollection");

		//var oLatlng = new google.maps.LatLng(31, 35);
		new google.maps.Marker({
			position: oLatlng,
			map: oMap,
			title: "TRIP"
		});
	},

	onRouteMatched: function(oEvent) {
		// when detail navigation occurs, update the binding context
		if (oEvent.getParameter("name") === "map") {
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
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack();
		//window.history.go(-1);
	}
});