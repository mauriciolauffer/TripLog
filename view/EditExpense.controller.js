jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.core.mvc.Controller.extend("com.mlauffer.trip.view.EditExpense", {

	oAlertDialog : null,
	oBusyDialog : null,
	_actualTrip : null,
	_actualExpense : null,

	onInit : function() {
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
	},
	
	onRouteMatched : function(oEvent) {
		// when detail navigation occurs, update the binding context
		if (oEvent.getParameter("name") === "editExpense") {
			this._actualTrip = oEvent.getParameter("arguments").trip;
			this._actualExpense = oEvent.getParameter("arguments").expense;
			var sProductPath = "/Trips/" + this._actualTrip + "/Expenses/" + this._actualExpense;
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

	showErrorAlert : function(sMessage) {
		sap.m.MessageBox.alert(sMessage);
	},

	saveTrip : function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();
		var oModel = this.getView().getModel();
		
		try {
			oModel.setProperty("Date", this.getView().byId("date").getValue(), oContext);
			oModel.setProperty("Description", this.getView().byId("description").getValue(), oContext);
			oModel.setProperty("Price", parseFloat(this.getView().byId("price").getValue()).toFixed(2), oContext);
			oModel.setProperty("Currency", this.getView().byId("currency").getValue(), oContext);

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
		sap.m.MessageToast.show("Expense '" + this.getView().byId("description").getValue() + "' edited");

	},

	onSave : function(oEvent) {
		var oBundle = this.getView().getModel("i18n").getResourceBundle();
		var oValidator = new mlauffer.controls.FieldValidation();

		var aElements = [ this.getView().byId("price") ];
		var bValid = oValidator.number(aElements);
		if (!bValid) {
			sap.m.MessageToast.show(oBundle.getText("ErrorNumber"));
			return;
		}
		
		aElements = [ this.getView().byId("date"),
				this.getView().byId("description"),
				this.getView().byId("price") ];
				//this.getView().byId("currency") ];
		bValid = oValidator.required(aElements);
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
		var that = this;
		var oContext = oEvent.getSource().getBindingContext();
		var oBundle = this.getView().getModel("i18n").getResourceBundle();
		
		// show confirmation dialog
		sap.m.MessageBox.confirm(oBundle.getText("dialogMsgDelete"), function(oAction) {
			if (sap.m.MessageBox.Action.OK === oAction) {
				var oModel = that.getView().getModel();
				
				try {
					oModel.getData().Trips[ that._actualTrip ].Expenses.splice(oContext.getPath().slice(-1), 1);
					// Local Storage
					jQuery.sap.storage(jQuery.sap.storage.Type.local).put("MLui5Trip", oModel.getData().Trips);
				} catch (e) {
					sap.m.MessageBox.alert(oBundle.getText("errorSave") + ":\n" + e.message);
					return;
				}
				
				oModel.refresh(true);
				that.onCancel();
				sap.m.MessageToast.show(oBundle.getText("successDelete"));
			}
		}, oBundle.getText("dialogTitleDelete"));
	},

	onCancel : function(oEvent) {
		var actualTrip = this._actualTrip;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("trip", {
			trip : actualTrip //oEvent.getSource().getBindingContext().getPath().substring(7, 8)
		}, true);
		this.getView().unbindElement();
	},

	onDialogClose : function(oEvent) {
		oEvent.getSource().getParent().close();
	}
});