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
				SyUname:"",
				TeslimYeriList:[],
				supplierNo: "",
				isSupplier: false,
				detailPopupNote: "",
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
				OrderListSUMMARY: [],
				OrderListWeeklyDeliveries: [],
				OrderListLateDeliveries: [],
				OrderListFutureDeliveries: [],
				summaryCounts: {
					weekly: 0,
					late: 0,
					future: 0
				}


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
				header: {
					lifnrFilter: true,
					routeCallApplication:true,
					routeLogApplication:true
				},
				iconTabBar: {
					PKOLMAYAN: true,
					ACIKCAGRI: true,
					ONAY: true,
					REVF: true,
					REVE: true,
					IPTT: true,
					TUM: true,
					GET_TUM_SIPARIS_S: true,
					SUMMARY: false
				},
				detailPopup: {
					// addNote: false,
					// addNoteEditable: false,
					// approveButton: false,
					// cancelButton: false,
					// reviseButton: false,
					// saveButton: false,
					currentAction:"",
					BtnVisConfirmAction:false,
					BtnVisAddNote: false,
					BtnVisAiCancel: false,
					BtnVisApprove: false,
					BtnVisPk: false,
					BtnVisReject: false,
					BtnVisRevise: false,
					BtnVisSend: false,
					BtnVisSevk: false,
					BtnVisTedCancAppr: false,
					BtnVisTedCancReject: false,
					BtnVisTedCancRevise: false,
					IsSupplier: false,
					NormtEdit: false,
					PlakaVis: false,
					SevkmVis: false,
					SlfdiEdit: false,
					SlfdiVis: false,
					SoforVis: false,
					TesyrVis: false,
					SevkedVis:false,
					AddNoteArea:false
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
