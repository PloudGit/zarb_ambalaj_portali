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

                    // GO Button
                    if (oFB._oSearchButton) {
                        oFB._oSearchButton.setText(oResourceBundle.getText("goButtonText"));
                        oFB._oSearchButton.setIcon("sap-icon://search");
                        oFB._oSearchButton.setIconFirst(true);
                        oFB._oSearchButton.setType(sap.m.ButtonType.None);
                        oFB._oSearchButton.addStyleClass("greenButton");
                    }

                    // Filters
                    if (oFB._oFiltersButton) {
                        oFB._oFiltersButton.setType(sap.m.ButtonType.Transparent);
                        oFB._oFiltersButton.addStyleClass("blueButton");
                    }

                    // Hide / Show
                    if (oFB._oHideShowButton) {
                        oFB._oHideShowButton.setType(sap.m.ButtonType.Transparent);
                        oFB._oHideShowButton.addStyleClass("yellowButton");
                    }


                    // custom buton
                    var oToolbar = oFB.getToolbar ? oFB.getToolbar() : oFB._oToolbar;
                    if (oToolbar && !oFB._bCustomButtonAdded) {
                        oFB._bCustomButtonAdded = true;

                        oToolbar.addContent(
                            new sap.m.Button({
                                text: "Çağrı Uygulamasına Git",
                                icon: "sap-icon://headset",
                                press: that._main.onOpenCallScreen.bind(that)
                            }).addStyleClass("orangeButton sapUiSmallMarginLeft")
                        );

                    }

                    debugger;
                }
            });
        },

        onOpenCallScreen: function (that) {
            debugger;

            var systemId;
            if (sap.ushell) {
                systemId = sap.ushell.Container.getLogonSystem("system").getName();
            } else {
                systemId = "DS4";
            }

            var url;
            if (systemId === "DS4") {
                // url = i18n.getText("urlCallDev");
                url = "https://vhvctds4ci.sap.abdiibrahim.com.tr:44300/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=100&sap-language=TR#ZARB_AMBALAJC-manage";
            }
            else if (systemId === "QS4") {
                // url = i18n.getText("urlCallQa");
                url = "https://vhvctqs4ci.sap.abdiibrahim.com.tr:44300/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=100&sap-language=TR#ZARB_AMBALAJC-manage";

            }
            else if (systemId === "PS4") {
                // url = i18n.getText("urlCallProd");
                url = "https://vhvctps4ci.sap.abdiibrahim.com.tr:44300/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=100&sap-language=TR#ZARB_AMBALAJC-manage";

            }

            sap.ui.require(["sap/m/library"], function (library) {
                var URLHelper = library.URLHelper;
                URLHelper.redirect(url, false);
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

            if (selectedKey === "SUMMARY") {
                that._main.splitOrderListByDeliveryDate(that, data);
            }
            // IconTab bul
            var oIconTabBar = that.getView().byId("idIconTabBar");
            if (!oIconTabBar) return;

            var oItem = oIconTabBar.getItems().find(element => element.getKey() === selectedKey);
            if (!oItem) return;

            var oInnerView = oItem.getContent()[0];
            if (!oInnerView) return;

            oInnerView.setModel(dModel, "dm");


        },
        splitOrderListByDeliveryDate: function (that, aOrderList) {
            var oModel = that.getOModel(that, "dm");

            var today = new Date();
            today.setHours(0, 0, 0, 0);

            var endOfWeek = new Date(today);
            endOfWeek.setDate(endOfWeek.getDate() + 7);

            var weeklyDeliveries = [];
            var lateDeliveries = [];
            var futureDeliveries = [];

            aOrderList.forEach(function (oItem) {
                var deliveryDate = that.dateConvert(oItem.Slfdt);
                if (!deliveryDate) return;

                if (deliveryDate < today) {
                    lateDeliveries.push(oItem);
                } else if (deliveryDate >= today && deliveryDate <= endOfWeek) {
                    weeklyDeliveries.push(oItem);
                } else {
                    futureDeliveries.push(oItem);
                }
            });

            oModel.setProperty("/OrderListWeeklyDeliveries", weeklyDeliveries);
            oModel.setProperty("/OrderListLateDeliveries", lateDeliveries);
            oModel.setProperty("/OrderListFutureDeliveries", futureDeliveries);

            oModel.setProperty("/summaryCounts", {
                weekly: Array.isArray(weeklyDeliveries) ? weeklyDeliveries.length : 0,
                late: Array.isArray(lateDeliveries) ? lateDeliveries.length : 0,
                future: Array.isArray(futureDeliveries) ? futureDeliveries.length : 0
            });

        },

        setUiVisibility: function (that, role) {
            debugger;

            // role kaydet
            var dModel = that.getOModel(that, "dm");
            var dData = dModel.getData();
            dData["Role"] = role;
            dModel.refresh();

            var pModel = that.getOModel(that, "pm");
            var pData = pModel.getData();

            if (role === 'Tedarikçi') {
                pData.iconTabBar["PKOLMAYAN"] = false;
                pData.iconTabBar["ACIKCAGRI"] = true;
                pData.iconTabBar["ONAY"] = true;
                pData.iconTabBar["REVF"] = true;
                pData.iconTabBar["REVE"] = false;
                pData.iconTabBar["IPTT"] = true;
                pData.iconTabBar["TUM"] = false;
                pData.iconTabBar["GET_TUM_SIPARIS_S"] = false;

                // // detailPopup 
                // pData.detailPopup["addNote"] = true;
                // pData.detailPopup["addNoteEditable"] = true;
                // pData.detailPopup["approveButton"] = false;
                // pData.detailPopup["cancelButton"] = true;
                // pData.detailPopup["reviseButton"] = false;

            } else {
                pData.iconTabBar["PKOLMAYAN"] = true;
                pData.iconTabBar["ACIKCAGRI"] = true;
                pData.iconTabBar["ONAY"] = true;
                pData.iconTabBar["REVF"] = true;
                pData.iconTabBar["REVE"] = true;
                pData.iconTabBar["IPTT"] = true;
                pData.iconTabBar["TUM"] = true;
                pData.iconTabBar["GET_TUM_SIPARIS_S"] = true;

                // // detailPopup 
                // pData.detailPopup["addNote"] = true;
                // pData.detailPopup["addNoteEditable"] = false;
                // pData.detailPopup["approveButton"] = true;
                // pData.detailPopup["cancelButton"] = true;
                // pData.detailPopup["reviseButton"] = true;
            }

            pModel.refresh();
        },

        setDetailPopupVisibility: function (that) {
            var dModel = that.getOModel(that, "dm");
            var pModel = that.getOModel(that, "pm");

            var role = dModel.getProperty("/Role");
            var selectedKey = that._main.getIcontabBarSelectedKey(that);

            var pData = pModel.getData();
            pData.detailPopup = pData.detailPopup || {};

            // Tüm alanları default kapalı yap
            var dp = pData.detailPopup;
            dp["addNote"] = false;
            dp["addNoteEditable"] = false;
            dp["approveButton"] = false;
            dp["cancelButton"] = false;
            dp["reviseButton"] = false;
            dp["saveButton"] = false;

            // Tedarikçi için
            if (role === "Tedarikçi") {
                switch (selectedKey) {
                    case "PKOLMAYAN":
                        // dp["addNote"] = true;
                        // dp["addNoteEditable"] = true;
                        break;
                    case "ACIKCAGRI":
                        dp["addNote"] = true;
                        dp["addNoteEditable"] = true;
                        dp["saveButton"] = true;
                        break;

                    case "ONAY":
                        dp["addNote"] = true;
                        dp["addNoteEditable"] = true;
                        dp["cancelButton"] = true;
                        dp["reviseButton"] = true;
                        dp["saveButton"] = true;
                        break;

                    case "REVF":
                        dp["addNote"] = true;
                        dp["addNoteEditable"] = true;
                        dp["approveButton"] = true;
                        dp["cancelButton"] = true;
                        dp["reviseButton"] = true;
                        dp["saveButton"] = true;
                        break;

                    case "REVE":

                        break;

                    case "IPTT":

                        break;

                    case "TUM":
                        break;
                    case "GET_TUM_SIPARIS_S":

                        break;

                    default:
                        break;
                }
            }
            // Abdici
            else {
                switch (selectedKey) {
                    case "PKOLMAYAN":
                        // dp["addNote"] = true;
                        // dp["addNoteEditable"] = true;
                        break;
                    case "ACIKCAGRI":
                        dp["addNote"] = true;
                        dp["addNoteEditable"] = true;
                        dp["saveButton"] = true;
                        break;

                    case "ONAY":
                        dp["addNote"] = true;
                        dp["addNoteEditable"] = true;
                        dp["cancelButton"] = true;
                        dp["reviseButton"] = true;
                        dp["saveButton"] = true;
                        break;

                    case "REVF":
                        dp["addNote"] = true;
                        dp["addNoteEditable"] = true;
                        dp["approveButton"] = true;
                        dp["cancelButton"] = true;
                        dp["reviseButton"] = true;
                        dp["saveButton"] = true;
                        break;

                    case "REVE":

                        break;

                    case "IPTT":

                        break;

                    case "TUM":
                        break;
                    case "GET_TUM_SIPARIS_S":

                        break;

                    default:
                        break;
                }
            }

            pModel.refresh();
        }





    });
});