jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.core.mvc.Controller.extend("com.mlauffer.trip.view.EditTrip", {

	oAlertDialog: null,
	oBusyDialog: null,
	_actualTrip: null,

	onInit: function() {
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
	},

	onRouteMatched: function(oEvent) {
		// when detail navigation occurs, update the binding context
		if (oEvent.getParameter("name") === "editTrip") {

			this._actualTrip = oEvent.getParameter("arguments").trip;
			var sProductPath = "/Trips/" + this._actualTrip;
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

	showErrorAlert: function(sMessage) {
		sap.m.MessageBox.alert(sMessage);
	},

	saveTrip: function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();
		var oModel = this.getView().getModel();

		try {
			oModel.setProperty("Name", this.getView().byId("name").getValue(), oContext);
			oModel.setProperty("DateJS", this.getView().byId("dateBegin").getDateValue(), oContext);
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
			trip: actualTrip
		}, true);

		// ID of newly inserted trip is available in mResponse.ID
		this.oBusyDialog.close();
		sap.m.MessageToast.show("Trip '" + this.getView().byId("name").getValue() + "' edited");
	},

	onSave: function(oEvent) {
		var oBundle = this.getView().getModel("i18n").getResourceBundle();
		var oValidator = new mlauffer.controls.FieldValidation();

		var aElements = [this.getView().byId("name"),
				this.getView().byId("dateBegin"),
				this.getView().byId("dateEnd")];
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

	onDelete: function(oEvent) {
		var that = this;
		var oContext = oEvent.getSource().getBindingContext();
		var sPath = oContext.getPath();
		var oBundle = this.getView().getModel("i18n").getResourceBundle();

		// show confirmation dialog
		sap.m.MessageBox.confirm(oBundle.getText("dialogMsgDelete"), function(oAction) {
			if (sap.m.MessageBox.Action.OK === oAction) {
				var oModel = that.getView().getModel();

				try {
					oModel.getData().Trips.splice(sPath.slice(sPath.lastIndexOf("/") + 1), 1);
					// Local Storage
					jQuery.sap.storage(jQuery.sap.storage.Type.local).put("MLui5Trip", oModel.getData().Trips);
				} catch (e) {
					sap.m.MessageBox.alert(oBundle.getText("errorSave") + ":\n" + e.message);
					return;
				}

				oModel.refresh(true);
				this._actualTrip = null;
				//that.onCancel();
				sap.ui.core.UIComponent.getRouterFor(that).navTo("main", {}, true);
				that.getView().unbindElement();
				sap.m.MessageToast.show(oBundle.getText("successDelete"));
			}
		}, oBundle.getText("dialogTitleDelete"));
	},

	onCancel: function(oEvent) {
		var actualTrip = this._actualTrip;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("trip", {
			trip: actualTrip
		}, true);
		this.getView().unbindElement();
	},

	onDialogClose: function(oEvent) {
		oEvent.getSource().getParent().close();
	}
});