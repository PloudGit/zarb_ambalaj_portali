sap.ui.define([
    "com/app/abdiibrahim/zarbambalajportali/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "com/app/abdiibrahim/zarbambalajportali/utils/DataModel",
    "com/app/abdiibrahim/zarbambalajportali/utils/ODataController",
    "com/app/abdiibrahim/zarbambalajportali/utils/MainHelper",
    "com/app/abdiibrahim/zarbambalajportali/utils/Mapping",
    "com/app/abdiibrahim/zarbambalajportali/utils/formatter",
    "sap/ui/model/BindingMode",
    "sap/ui/export/Spreadsheet",
    "sap/m/HBox",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Table"
], function (BaseController,
    Fragment,
    JSONModel,
    DataModel,
    ODataController,
    MainHelper,
    Mapping,
    formatter,
    BindingMode,
    Spreadsheet,
    HBox,
    VBox,
    Text,
    Table
) {
    "use strict";

    return BaseController.extend("com.app.abdiibrahim.zarbambalajportali.controller.Main", {
        formatters: formatter,
        oJSONModel: new JSONModel(),

        onInit: function (oEvent) {
            this._Router = this.getOwnerComponent().getRouter();
            this._Router.getRoute("Main").attachMatched(this._onRouteMatched, this);
            this._Router.getRoute("supplier").attachMatched(this._onRouteMatchedSupplier, this);

            //Datamodel js 
            this._dataModel = new DataModel();

            //oData Controller
            this._oData = new ODataController();

            // MainHelper.js
            this._main = new MainHelper();

            // Mapping.js
            this._mapping = new Mapping();

            // Create Model 
            this._dataModel.createAllModel(this);

            this.setMessagePopover(this);
            var that = this;

            this._main.setFilterBar(this, "smartFilterBar");
        },

        _onRouteMatched: function () {
            // Route matched işlemleri
            var that = this;

            // listeyi al 
            // that._main.getTabViewData(that);

        },

        _onRouteMatchedSupplier: function (oEvent) {
            // Route matched işlemleri
            var that = this;

            var oArgs = oEvent.getParameter("arguments");
            var supplierNo = oArgs.SupplierNo;

            if (supplierNo) { //btp ile gelince 

                this._main.setUiForSupplier(this, supplierNo);

            }

        },

        onAfterRendering: function () {

            var oScroll = this.byId("mainScrollContainer");
            if (oScroll) {
                // Ekran yukarı scroll 
                oScroll.scrollTo(0, 0, 0); // (x, y, duration)
            }
        },

        onExit: function () {
            // Çıkış işlemleri
        },


        onSearch: function (oEvent) {
            debugger;
            // var oSmartFilterBar = this.byId("smartFilterBar");

            // var aFilters = oSmartFilterBar.getFilters();

            this._oData.getList(this);

        },

        onPressEbeln: function (oEvent) {

            debugger;
            var that = this;
            // hangi tablodaki hangi satır verisine tıklandığını tutalım  ? 

            // selectedkey tab zaten aslında hangi tablo olduğunu veryor - 
            // satır bilgisi yeterli olur sanki 
            var selectedKey = this._main.getIcontabBarSelectedKey(this);

            var oContext = oEvent.getSource().getBindingContext("dm");
            if (!oContext) {
                return;
            }
            var oRowData = oContext.getObject();

            // Ebeln değerini al
            var sEbeln = oRowData.Ebeln;
            oRowData.Slfdi = null; // Firma Revizyon Teslim Tarihi boş olsun .
            var dModel = this.getOModel(this, "dm");
            dModel.setProperty("/sSelectedEbelnRowData", oRowData);

            var oRow = {};
            var oRows = [];

            oRow["Ebeln"] = oRowData.Ebeln;
            oRow["Ebelp"] = oRowData.Ebelp;
            oRow["Menge"] = oRowData.Menge;
            oRow["Meins"] = oRowData.Meins;
            oRow["Slfdt"] = oRowData.Slfdt;
            oRow["Slfdi"] = null;
            oRow["Plaka"] = oRowData.Plaka;
            oRow["Sevkm"] = oRowData.Sevkm;
            oRow["Sofor"] = oRowData.Sofor;
            oRow["Tesyr"] = oRowData.Tesyr;
            oRows.push(oRow);
            dModel.setProperty("/sSelectedEbelnTableData", oRows);
            dModel.refresh();

            this._selectedRow = oRowData;

            // this._main.setDetailPopupVisibility(this);

            // get visibility data 

            this._oData.getPopupInfo(that, oRowData)
                .then(function () {
                    that._orderDetailPopup(selectedKey).open();
                });


        },

        _orderDetailPopup: function (selectedKey) {

            var that = this;

            if (!that.OrderDetailPopup) {

                that.OrderDetailPopup = sap.ui.xmlfragment(selectedKey, "com.app.abdiibrahim.zarbambalajportali.view.fragments.OrderDetailPopup", that);

                that.OrderDetailPopup.setModel(that.getView().getModel());

                that.getView().addDependent(that.OrderDetailPopup);

                jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that.OrderDetailPopup);

            }
            return that.OrderDetailPopup;
        },
        onCloseOrderDetailPopup: function () {
            if (this.OrderDetailPopup) {

                this._oData.getList(this);

                this.OrderDetailPopup.close();

            }
        },

        onExcelDownloadMainTable: function () {
            debugger;

        },

        onIconTabBarSelect: function (oEvent) {

            this._oData.getList(this);

        },

        // detail popup not ekle butonu - direkt backende gitsin notu kaydetsin 
        onApproveOrder: function (oEvent) {
            var that = this;
            that._main.checkData(that, 'AN');
        },

        onPressAction: function (oEvent, sActionCode) {
            var that = this;

            that._main.checkData(that, sActionCode);
        },

        onConfirmResponse: function (that, response, action) {
            var dModel = that.getOModel(that, "dm");
            var dData = dModel.getData();
            var oBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
            var tableRow = dData.sSelectedEbelnTableData[0];
            var prefix = "";
            var finalNote = "";
            var combinedNote = "";

            if (response === 'OK') {
                var row = dData.sSelectedEbelnRowData;
                var payload = {
                    Action: action,
                    Ebeln: row.Ebeln,
                    Ebelp: row.Ebelp,
                    Etenr: row.Etenr,
                    Normt: row.Normt,
                    Plaka: tableRow.Plaka,
                    Sofor: tableRow.Sofor,
                    Statu: row.Statu,
                    Tabinfo: row.Tabinfo,
                    Tesyr: tableRow.Tesyr,
                    Slfdi: that.formatters.adjustStartDateForUTC(tableRow.Slfdi),
                    IsSupplier: dData["isSupplier"],
                    Lifnr: dData["supplierNo"],
                    Sevkm: tableRow.Sevkm,
                    Desc1: row.Desc1  // aşağıda eklenecek not ekle denirse 
                };

                switch (action) {
                    case 'AN':
                        var newNote = dData.detailPopupNote?.trim();
                        var oldNote = row.Desc1?.trim() || "";
                        var status = row.Statu;

                        switch (status) {
                            case 'INIT':
                                prefix = oBundle.getText("note_type_INIT"); break;
                            case 'ACCE':
                                prefix = oBundle.getText("note_type_ACCE"); break;
                            case 'DELI':
                                prefix = oBundle.getText("note_type_DELI"); break;
                            case 'REVF':
                                prefix = oBundle.getText("note_type_REVF"); break;
                            case 'REVE':
                                prefix = oBundle.getText("note_type_REVE"); break;
                            case 'IPTL':
                                prefix = oBundle.getText("note_type_IPTL"); break;
                            case 'AIPT':
                                prefix = oBundle.getText("note_type_AIPT"); break;
                            default:
                                prefix = oBundle.getText("note_type_DEFAULT");
                        }

                        finalNote = prefix + " " + newNote;
                        combinedNote = oldNote ? oldNote + "\n" + finalNote : finalNote;

                        dModel.setProperty("/sSelectedEbelnRowData/Desc1", combinedNote);
                        dModel.setProperty("/detailPopupNote", "");

                        payload.Desc1 = combinedNote;

                        break;

                    case 'AC': // Approve
                    case 'RJ': // Reject
                        var newNote = dData.detailPopupNote?.trim();
                        var oldNote = row.Desc1?.trim() || "";
                        var status = row.Statu;

                        prefix = oBundle.getText("note_type_REJECT");
                        finalNote = prefix + " " + newNote;
                        combinedNote = oldNote ? oldNote + "\n" + finalNote : finalNote;

                        dModel.setProperty("/sSelectedEbelnRowData/Desc1", combinedNote);
                        dModel.setProperty("/detailPopupNote", "");
                        payload.Desc1 = combinedNote;

                    case 'CN': // Cancel
                        var newNote = dData.detailPopupNote?.trim();
                        var oldNote = row.Desc1?.trim() || "";
                        var status = row.Statu;

                        prefix = oBundle.getText("note_type_CANCEL");
                        finalNote = prefix + " " + newNote;
                        combinedNote = oldNote ? oldNote + "\n" + finalNote : finalNote;

                        dModel.setProperty("/sSelectedEbelnRowData/Desc1", combinedNote);
                        dModel.setProperty("/detailPopupNote", "");
                        payload.Desc1 = combinedNote;

                    case 'CA': // Cancel Approve
                    case 'CR': // Cancel Reject
                    case 'CV': // Cancel Revise
                    case 'RV': // Revise

                        var newNote = dData.detailPopupNote?.trim();
                        var oldNote = row.Desc1?.trim() || "";
                        var status = row.Statu;

                        prefix = oBundle.getText("note_type_REVISE");
                        finalNote = prefix + " " + newNote;
                        combinedNote = oldNote ? oldNote + "\n" + finalNote : finalNote;

                        dModel.setProperty("/sSelectedEbelnRowData/Desc1", combinedNote);
                        dModel.setProperty("/detailPopupNote", "");
                        payload.Desc1 = combinedNote;

                        break;
                    case 'SD': // Send
                    case 'SE': // Sevk
                    case 'PK': // PK

                        break;

                    default:
                        return;
                }

                that._oData.approveProcess(that, payload);
            }
        },
        // onConfirmResponse: function (that, response, action) {
        //     var dModel = that.getOModel(that, "dm");
        //     var dData = dModel.getData();
        //     var oBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();

        //     if (response === 'OK') {
        //         switch (action) {
        //             case 'ADD_NOTE':
        //                 var row = dData.sSelectedEbelnRowData;
        //                 var newNote = dData.detailPopupNote?.trim();
        //                 var oldNote = row.Desc1?.trim() || "";
        //                 var status = row.Statu;

        //                 var prefix = "";
        //                 switch (status) {
        //                     case 'INIT':
        //                         prefix = oBundle.getText("note_type_INIT");
        //                         break;
        //                     case 'ACCE':
        //                         prefix = oBundle.getText("note_type_ACCE");
        //                         break;
        //                     case 'DELI':
        //                         prefix = oBundle.getText("note_type_DELI");
        //                         break;
        //                     case 'REVF':
        //                         prefix = oBundle.getText("note_type_REVF");
        //                         break;
        //                     case 'REVE':
        //                         prefix = oBundle.getText("note_type_REVE");
        //                         break;
        //                     case 'IPTL':
        //                         prefix = oBundle.getText("note_type_IPTL");
        //                         break;
        //                     case 'AIPT':
        //                         prefix = oBundle.getText("note_type_AIPT");
        //                         break;
        //                     default:
        //                         prefix = oBundle.getText("note_type_DEFAULT");
        //                 }

        //                 var finalNote = prefix + " " + newNote;
        //                 var combinedNote = oldNote ? oldNote + "\n" + finalNote : finalNote;

        //                 dModel.setProperty("/sSelectedEbelnRowData/Desc1", combinedNote);
        //                 dModel.setProperty("/detailPopupNote", "");


        //                 break;
        //         }
        //     }
        // },



    });
});
