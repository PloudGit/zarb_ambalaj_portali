sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/model/json/JSONModel"
], function (
	ManagedObject,
	JSONModel
) {
	"use strict";

	return ManagedObject.extend("com.app.abdiibrahim.zarbambalajportali.utils.DataModel", {

		//Create Data Management Model
		createDM: function (that) {


			var dModel = new JSONModel();
			// var i18n = that.getView().getModel("i18n").getResourceBundle();


			var dData = {
				iconTabBarSelectedKey: "ACIKCAGRI",
				OrderList: [],
				OrderListPKOLMAYAN: [],
				OrderListACIKCAGRI: [],
				OrderListTEYITCAGRI: [],
				OrderListFREVIZYON: [],
				OrderListAIREVIZYON: [],
				OrderListIPTALCAGRI: [],
				OrderListTUMCAGRI: [],
				OrderListTUMSIPARIS: [],
			}


			dModel.setData(dData);
			dModel.refresh();

			sap.ui.getCore().setModel(dModel, "dm");
			that.getView().setModel(dModel, "dm");
		},

		//Create Property Management Model
		createPM: function (that) {

			var pModel = new JSONModel();

			var pData = {
				iconTabBar: {
					PKOLMAYAN: true,
					ACIKCAGRI: true,
					ONAY: true,
					REVF: true,
					REVE: true,
					IPTT: true,
					TUM: true,
					GET_TUM_SIPARIS_S: true
				},
				detailPopup: {
					addNote: false,
					addNoteEditable: false,
					approveButton: false,
					cancelButton: false,
					reviseButton: false,
					saveButton:false
				}


			}

			// pModel.loadData(sPath, "false");
			pModel.setData(pData);
			pModel.refresh();

			sap.ui.getCore().setModel(pModel, "pm");
			that.getView().setModel(pModel, "pm");

		},

		//Create Backend Management Model
		createBM: function (that) {


			var bModel = new JSONModel();

			var bData = {

			}

			bModel.setData(bData);
			// bModel.loadData(sPath, "true");
			bModel.refresh();


			sap.ui.getCore().setModel(bModel, "bm");
			that.getView().setModel(bModel, "bm");

		},

		createAllModel: function (that) {

			this.createDM(that);
			this.createPM(that);
			this.createBM(that);

		}


	});
});
