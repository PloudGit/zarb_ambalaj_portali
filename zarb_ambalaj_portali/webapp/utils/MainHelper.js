sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/m/MessageBox",
    "sap/m/BusyDialog",
    "sap/m/HBox",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Table",
    "com/app/abdiibrahim/zarbambalajportali/utils/formatter",
], function (
    ManagedObject,
    MessageBox,
    BusyDialog,
    HBox,
    VBox,
    Text,
    Table,
    formatter
) {
    "use strict";

    return ManagedObject.extend("com.app.abdiibrahim.zarbambalajportali.utils.MainHelper", {

        formatters: formatter,
        setFilterBar: function (that, id) {
            var oFilter = that.getView().byId(id);

            if (!oFilter) {
                console.error("FilterBar bulunamadı:", id);
                return;
            }

            oFilter.addEventDelegate({
                onAfterRendering: function (oEvent) {
                    var oFB = oEvent.srcControl;
                    var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();

                    if (oFB._oSearchButton) {
                        oFB._oSearchButton.setText(oResourceBundle.getText("goButtonText"));
                        oFB._oSearchButton.setIcon("sap-icon://search");
                        oFB._oSearchButton.setIconFirst(true);
                        oFB._oSearchButton.setType(sap.m.ButtonType.None);
                        oFB._oSearchButton.addStyleClass("greenButton");
                    }

                    if (oFB._oFiltersButton) {
                        oFB._oFiltersButton.setType(sap.m.ButtonType.Transparent);
                        oFB._oFiltersButton.addStyleClass("blueButton");
                    }

                    if (oFB._oHideShowButton) {
                        oFB._oHideShowButton.setType(sap.m.ButtonType.Transparent);
                        oFB._oHideShowButton.addStyleClass("yellowButton");
                    }

                    // // Clear butonu
                    // if (oFB._oClearButtonOnFB) {
                    //     oFB._oClearButtonOnFB.setType(sap.m.ButtonType.Transparent);
                    //     oFB._oClearButtonOnFB.addStyleClass("redButton");
                    // }

                    // // Restore Filters butonu
                    // if (oFB._oRestoreButtonOnFB) {
                    //     oFB._oRestoreButtonOnFB.setType(sap.m.ButtonType.Transparent);
                    //     oFB._oRestoreButtonOnFB.addStyleClass("redButton");
                    // }

                    // // Show All Filters butonu
                    // if (oFB._oShowAllFiltersButton) {
                    //     oFB._oShowAllFiltersButton.setType(sap.m.ButtonType.Transparent);
                    //     oFB._oShowAllFiltersButton.addStyleClass("redButton");
                    // }

                    debugger;
                }
            });
        },

        getTabViewData: function (that) {

            // var selectedKey = that._main.getIcontabBarSelectedKey(that);

            // selectedKey değerine göre ilgili veriyi çek
            // switch (selectedKey) {
            //     case "PKOLMAYAN": // PK Bilgisi Olmayan Çağrılar
            //         that._oData.getNoPKInfoCalls(that);
            //         break;
            //     case "ACIKCAGRI": // Açık Çağrılar
            //         that._oData.getOpenCalls(that);
            //         break;
            //     case "TEYITCAGRI": // Teyit Edilen Çağrılar
            //         that._oData.getConfirmedCalls(that);
            //         break;
            //     case "FREVIZYON": // Firma Revizyon Talepleri
            //         that._oData.getCompanyRevisionRequests(that);
            //         break;
            //     case "AIREVIZYON": // Abdi İbrahim Revizyon Talepleri
            //         that._oData.getAbdiIbrahimRevisionRequests(that);
            //         break;
            //     case "IPTALCAGRI": // İptal Edilen Çağrılar
            //         that._oData.getCancelledCalls(that);
            //         break;
            //     case "TUMCAGRI": // Tüm Çağrılar
            //         that._oData.getAllCalls(that);
            //         break;
            //     case "TUMSIPARIS": // Tüm Siparişler
            //         that._oData.getAllPurchaseOrders(that);
            //         break;
            // }

            that._oData.getList(that);


        },
        getIcontabBarSelectedKey: function (that) {

            var dModel = that.getOModel(that, "dm");
            var dData = dModel.getData();

            return dData["iconTabBarSelectedKey"];

        },
        getOldIcontabBarSelectedKey: function (that) {

            var dModel = that.getOModel(that, "dm");
            var dData = dModel.getData();

            return dData["oldIconTabBarSelectedKey"];

        },

        setOldIcontabBarSelectedKey: function (that, value) {

            var dModel = that.getOModel(that, "dm");
            var dData = dModel.getData();

            dData["oldIconTabBarSelectedKey"] = value;
            dModel.refresh();

        },
        setOrderList: function (that, data) {
            debugger;

            var dModel = that.getOModel(that, "dm");
            var selectedKey = that._main.getIcontabBarSelectedKey(that);
            var sPath = "/OrderList" + selectedKey;

            dModel.setProperty(sPath, []);
            dModel.setProperty(sPath, data);
            dModel.updateBindings(true);

            // IconTab bul
            var oIconTabBar = that.getView().byId("idIconTabBar");
            if (!oIconTabBar) return;

            var oItem = oIconTabBar.getItems().find(element => element.getKey() === selectedKey);
            if (!oItem) return;

            var oInnerView = oItem.getContent()[0];
            if (!oInnerView) return;

            oInnerView.setModel(dModel, "dm");


        }



    });
});