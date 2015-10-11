jQuery.sap.declare("com.mlauffer.trip.Component");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("com.mlauffer.trip.MyRouter");
jQuery.sap.require("com.mlauffer.trip.util.MLauffer-FieldValidation");

sap.ui.core.UIComponent.extend("com.mlauffer.trip.Component", {

	metadata : {
		name : "TripLog",
		version : "1.3.0",
		includes : [],
		dependencies : {
			libs : [ "sap.m", "sap.ui.layout" ],
			components : []
		},
		rootView : "com.mlauffer.trip.view.App",

		config : {
			resourceBundle : "./i18n/messageBundle.properties",
			homeScreenIconPhone : "./img/triplog_57p.png",
			homeScreenIconTablet : "./img/triplog_72p.png",
			serviceConfig : {
				name : "MockUp",
				//serviceUrl : "./model/mock.json"
				serviceUrl : "./model/initModel.json"
			}
		},

		routing : {
			config : {
				routerClass : com.mlauffer.trip.MyRouter,
				viewType : "XML",
				viewPath : "com.mlauffer.trip.view",
				targetAggregation : "detailPages",
				clearTarget : false
			},
			routes : [ {
				pattern : "",
				name : "main",
				view : "Master",
				targetAggregation : "masterPages",
				targetControl : "idAppControl",
				subroutes : [ {
					pattern : "trip/{trip}",
					name : "trip",
					view : "Detail"
				}, {
					pattern : "trip/{trip}/edit",
					name : "editTrip",
					view : "EditTrip"
				}, {
					pattern : "trip/{trip}/expense/{expense}",
					name : "editExpense",
					view : "EditExpense"
				}, {
					pattern : "trip/{trip}/expense/{expense}/map",
					name : "map",
					view : "Map"
				}, {
					pattern : "trip/{trip}/addExpense",
					name : "expense",
					view : "AddExpense"
				} ]
			}, {
				name : "catchallMaster",
				view : "Master",
				targetAggregation : "masterPages",
				targetControl : "idAppControl",
				subroutes : [ {
					pattern : ":all*:",
					name : "catchallDetail",
					view : "NotFound"
				} ]
			} ]
		}
	},

	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var rootPath = jQuery.sap.getModulePath("com.mlauffer.trip");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [ rootPath, mConfig.resourceBundle ].join("/")
		});
		this.setModel(i18nModel, "i18n");

		// Create and set domain model to the component
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setDefaultBindingMode("OneWay");

		// Local Storage
		var mTrips = jQuery.sap.storage(jQuery.sap.storage.Type.local).get(
				"MLui5Trip");
		// Check Storage
		if (mTrips) {
			var mData = {};
			mData.Trips = mTrips;
			// Create JS Date
			$.each(mData.Trips, function(i, oItem) {
				oItem.DateJS = new Date(oItem.DateJS);
				if (oItem.Expenses) {
					$.each(oItem.Expenses, function(j, oItemEx) {
						oItemEx.DateJS = new Date(oItemEx.DateJS);
					});
				}
			});
			oModel.setData(mData);
		} else {
			oModel.loadData(mConfig.serviceConfig.serviceUrl);
		}
		this.setModel(oModel);

		/*
		 * var oCountryModel = new sap.ui.model.json.JSONModel();
		 * oCountryModel.loadData("./model/country.json");
		 * oCountryModel.setDefaultBindingMode("OneWay");
		 * this.setModel(oCountryModel, "country");
		 * 
		 * var oCurrencyModel = new sap.ui.model.json.JSONModel();
		 * oCurrencyModel.loadData("./model/currency.json");
		 * oCurrencyModel.setDefaultBindingMode("OneWay");
		 * this.setModel(oCurrencyModel, "currency");
		 */

		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None"
					: "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		this.setModel(deviceModel, "device");

		this.getRouter().initialize();
	}
});