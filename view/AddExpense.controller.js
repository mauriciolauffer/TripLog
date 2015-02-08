jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.core.mvc.Controller.extend("com.mlauffer.trip.view.AddExpense", {

	oAlertDialog : null,
	oBusyDialog : null,
	_actualTrip : null,

	initializeNewRegData : function() {
		this.getView().getModel("newReg").setData({
			Detail : {}
		});
	},

	onInit : function() {
		this.getView().setModel(new sap.ui.model.json.JSONModel(), "newReg");
		this.initializeNewRegData();
		
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
	},
	
	onRouteMatched : function(oEvent) {
		// when detail navigation occurs, update the binding context
		if (oEvent.getParameter("name") === "expense") {
			this._actualTrip = oEvent.getParameter("arguments").trip;
			var sProductPath = "/Trips/" + this._actualTrip;
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
		var mNewReg = this.getView().getModel("newReg").getData().Detail;
		// Basic payload data
		var mPayload = {
			Id : $.now(),
			Date : mNewReg.Date,
			Description : mNewReg.Description,
			Price : parseFloat(mNewReg.Price).toFixed(2),
			Currency : mNewReg.Currency
		// Price: mNewReg.Price.toString()
		};

		var oModel = this.getView().getModel();
		
		try {
			if (!oModel.getData().Trips[ this._actualTrip ].Expenses) {
				oModel.getData().Trips[ this._actualTrip ].Expenses = [mPayload];
			} else {
				oModel.getData().Trips[ this._actualTrip ].Expenses.push(mPayload);
			}
			
		} catch (e) {
			this.oBusyDialog.close();
			this.showErrorAlert(e.message);
			return;
		}

		oModel.refresh(true);
		this.initializeNewRegData();
		var actualTrip = this._actualTrip;
		
		// Local Storage
		jQuery.sap.storage(jQuery.sap.storage.Type.local).put("MLui5Trip", oModel.getData().Trips);
		
		sap.ui.core.UIComponent.getRouterFor(this).navTo("trip", {
			//from : "master",
			trip : actualTrip
		}, true);

		// ID of newly inserted trip is available in mResponse.ID
		this.oBusyDialog.close();
		sap.m.MessageToast.show("Expense '" + mNewReg.Description + "' added");
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