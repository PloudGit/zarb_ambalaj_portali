sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/BusyDialog",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function (
	ManagedObject,
	BusyDialog,
	Filter,
	FilterOperator,
	MessageBox
) {
	"use strict";

	return ManagedObject.extend("com.app.abdiibrahim.zarbambalajportali.utils.ODataController", {

		handleODataErrors: function (that) {
			var errors = that.getOModel(that, "message").oData;
			var messages = '';

			errors.forEach(function (element) {
				if (element.message && !element.message.includes("An exception was raised")) {
					messages += element.message + '\n';
				}
			});

			if (messages.trim() !== '') {
				MessageBox.error(messages);
			}
		},

		getList: function (that) {

			var url = "/AmbOrderListSet";

			var bModel = that.getOModel(that, "bm");
			var bData = bModel.getData();

			var dModel = that.getOModel(that, "dm");
			var dData = dModel.getData();
			var aFilters = [];
			var selectedKey = that._main.getIcontabBarSelectedKey(that);

			var oSmartFilterBar = that.byId("smartFilterBar");
			if (oSmartFilterBar) {
				aFilters = oSmartFilterBar.getFilters();
			}
			aFilters.push(new Filter("StatuFiori", FilterOperator.EQ, selectedKey));

			var oDataModel = that.getOwnerComponent().getModel();

			that.openBusyDialog();

			oDataModel.read(url, {
				filters: aFilters,
				success: function (oData, oResponse) {
					that.closeBusyDialog();
					if (oData && oData.results) {

						that._main.setOrderList(that, oData.results);
					}
				},
				error: function (oError) {
					that.closeBusyDialog();
					that._oData.handleODataErrors(that);

				}

			});

		},



	});
});