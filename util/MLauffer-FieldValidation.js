/* Mauricio Lauffer custom control: Field Validation */
(function() {
	"use strict";
	jQuery.sap.declare("mlauffer.controls.FieldValidation");

	sap.ui.core.Core.extend("mlauffer.controls.FieldValidation", {
		metadata : {},

		_bError : false,

		number : function(aElements) {
			this._bError = false;

			try {
				for (var i = 0; i < aElements.length; i++) {
					if (aElements[i].getValue() != "") {
						if (!$.isNumeric(aElements[i].getValue())) {
							aElements[i].setValueState("Error");
							this._bError = true;
						} else {
							aElements[i].setValueState("None");
						}
					}
				}
			} catch (e) {
				alert(e.message);
			}

			return (this._bError) ? false : true;
		},

		required : function(aElements) {
			this._bError = false;

			try {
				for (var i = 0; i < aElements.length; i++) {
					if (aElements[i].getValue() == "") {
						aElements[i].setValueState("Error");
						this._bError = true;
					} else {
						aElements[i].setValueState("None");
					}
				}
			} catch (e) {
				alert(e.message);
			}

			return (this._bError) ? false : true;
		}

	});

	mlauffer.controls.FieldValidation.prototype.exit = function() {
		/* release resources that are not released by the SAPUI5 framework */
		/*
		 * if (this._oLink) { this._oLink.destroy(); delete this._oLink; }
		 */
	};

}());