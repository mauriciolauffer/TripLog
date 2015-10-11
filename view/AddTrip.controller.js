jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.core.mvc.Controller.extend("com.mlauffer.trip.view.AddTrip", {

	oAlertDialog : null,
	oBusyDialog : null,

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf view.AddTrip
	 */
	onInit : function() {
		this.getView().setModel(new sap.ui.model.json.JSONModel(), "newTrip");
		this.initializeNewTripData();
	},

	onAfterRendering : function() {
	},

	/*
	 * onBeforeRendering : function() { var sPath = ""; var oSelect =
	 * this.getView().byId("country"); if
	 * (sap.ui.getCore().getConfiguration().getLanguage().substring(0,2) ==
	 * "pt") { sPath = "country>/CountryCollection/PT"; } else { sPath =
	 * "country>/CountryCollection/EN"; } oSelect.bindItems(sPath, new
	 * sap.ui.core.Item({ key : "{country>ISOCountry}", text :
	 * "{country>Country}" })); },
	 */

	initializeNewTripData : function() {
		this.getView().getModel("newTrip").setData({
			Detail : {}
		});
	},

	showErrorAlert : function(sMessage) {
		sap.m.MessageBox.alert(sMessage);
	},

	saveTrip : function(oEvent) {
		var mNewTrip = this.getView().getModel("newTrip").getData().Detail;
		// Basic payload data
		var mPayload = {
			Id : $.now(),
			Name : mNewTrip.Name,
			DateJS : this.getView().byId("dateBegin").getDateValue(),
			DateBegin : mNewTrip.DateBegin,
			DateEnd : mNewTrip.DateEnd,
			Total : 0
		};

		var oModel = this.getView().getModel();
		var iItems = oModel.getData().Trips.length;

		try {
			oModel.getData().Trips.push(mPayload);

		} catch (e) {
			this.oBusyDialog.close();
			this.showErrorAlert(e.message);
			return;
		}

		oModel.refresh(true);
		this.initializeNewTripData();

		// Local Storage
		jQuery.sap.storage(jQuery.sap.storage.Type.local).put("MLui5Trip",
				oModel.getData().Trips);

		sap.ui.core.UIComponent.getRouterFor(this).navTo("trip", {
			from : "master",
			trip : iItems
		}, true);

		// ID of newly inserted trip is available in mResponse.ID
		this.oBusyDialog.close();
		sap.m.MessageToast.show("Trip '" + mPayload.Name + "' added");
	},

	onSave : function(oEvent) {
		var oBundle = this.getView().getModel("i18n").getResourceBundle();
		var oValidator = new mlauffer.controls.FieldValidation();

		var aElements = [ this.getView().byId("name"),
				this.getView().byId("dateBegin"),
				this.getView().byId("dateEnd") ];
		var bValid = oValidator.required(aElements);
		if (!bValid) {
			sap.m.MessageToast.show(oBundle.getText("errorRequired"));
			return;
		}
		if (!this.oBusyDialog) {
			this.oBusyDialog = new sap.m.BusyDialog();
		}
		this.oBusyDialog.open();
		this.saveTrip(oEvent);
	},

	onNavBack : function() {
		sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(
				this.getView());
		this.getView().unbindElement();
	},

	onDialogClose : function(oEvent) {
		oEvent.getSource().getParent().close();
	}
});