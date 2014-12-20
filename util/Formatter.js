jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("com.mlauffer.trip.util.Formatter");

com.mlauffer.trip.util.Formatter = {
	currencyValue : function(value) {
		return parseFloat(value).toFixed(2);
	},

	dateShort : function(sDate) {
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({ style : "short" });
		return oDateFormat.format(new Date(sDate));
		//return oDate;
	},
	
	dateMedium : function(sDate) {
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance();
		return oDateFormat.format(new Date(sDate));
	},
};