jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.core.mvc.Controller.extend("com.mlauffer.trip.view.EditTrip", {

	oAlertDialog : null,
	oBusyDialog : null,
	_actualTrip : null,

	onInit : function() {
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
	},
	
	/*onBeforeRendering : function() {
		var sPath = "";
		var oSelect = this.getView().byId("country");
		if (sap.ui.getCore().getConfiguration().getLanguage().substring(0,2) == "pt") {
			sPath = "country>/CountryCollection/PT";
		} else {
			sPath = "country>/CountryCollection/EN";
		}
		oSelect.bindItems(sPath, new sap.ui.core.Item({
			key : "{country>ISOCountry}",
			text : "{country>Country}",
			selectedKey : "{Country}"
		}));
	},*/
	
	onRouteMatched : function(oEvent) {
		// when detail navigation occurs, update the binding context
		if (oEvent.getParameter("name") === "editTrip") {

			this._actualTrip = oEvent.getParameter("arguments").trip;
			var sProductPath = "/Trips/" + this._actualTrip;
			var oView = this.getView();
			oView.bindElement(sProductPath);
			
			/*console.log(this.getView().byId("country").getSelectedItemId());
			console.log(this.getView().byId("country").getSelectedKey());
			console.log(oView.getModel().getProperty("Name"));
			oView.byId("country").setSelectedKey('US');
			console.log(this.getView().byId("country").getSelectedItemId());
			console.log(this.getView().byId("country").getSelectedKey());*/
			

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

	showErrorAlert : function(sMessage) {
		sap.m.MessageBox.alert(sMessage);
	},

	saveTrip : function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();
		var oModel = this.getView().getModel();
		
		try {
			oModel.setProperty("Name", this.getView().byId("name").getValue(), oContext);
			oModel.setProperty("DateBegin", this.getView().byId("dateBegin").getValue(), oContext);
			oModel.setProperty("DateEnd", this.getView().byId("dateEnd").getValue(), oContext);

		} catch (e) {
			this.oBusyDialog.close();
			this.showErrorAlert(e.message);
			return;
		}

		oModel.refresh(true);
		var actualTrip = this._actualTrip;
		
		// Local Storage
		jQuery.sap.storage(jQuery.sap.storage.Type.local).put("MLui5Trip", oModel.getData().Trips);
		
		sap.ui.core.UIComponent.getRouterFor(this).navTo("trip", {
			//from : "master",
			trip : actualTrip
		}, true);

		// ID of newly inserted trip is available in mResponse.ID
		this.oBusyDialog.close();
		sap.m.MessageToast.show("Trip '" + this.getView().byId("name").getValue() + "' edited");
	},

	onSave : function(oEvent) {
		var oBundle = this.getView().getModel("i18n").getResourceBundle();
		var oValidator = new mlauffer.controls.FieldValidation();

		var aElements = [ this.getView().byId("name"),
				this.getView().byId("dateBegin"),
				this.getView().byId("dateEnd") ];
		var bValid = oValidator.required(aElements);
		if (!bValid) {
			sap.m.MessageToast.show(oBundle.getText("ErrorRequired"));
			return;
		}

		if (!this.oBusyDialog) {
			this.oBusyDialog = new sap.m.BusyDialog();
		}
		this.oBusyDialog.open();
		this.saveTrip(oEvent);
	},
	
	onDelete : function(oEvent) {
		
	},

	onCancel : function(oEvent) {
		var actualTrip = this._actualTrip;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("trip", {
			trip : actualTrip
		}, true);
		this.getView().unbindElement();
	},

	onDialogClose : function(oEvent) {
		oEvent.getSource().getParent().close();
	}
});