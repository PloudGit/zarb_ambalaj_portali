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

                    debugger;
                    // custom buton
                    var oToolbar = oFB.getToolbar ? oFB.getToolbar() : oFB._oToolbar;
                    if (oToolbar && !oFB._bCustomButtonAdded) {
                        oFB._bCustomButtonAdded = true;

                        oToolbar.addContent(
                            new sap.m.Button({
                                text: "Çağrı Uygulamasına Git",
                                icon: "sap-icon://headset",
                                visible: "{pm>/header/routeCallApplication}",
                                press: that._main.onOpenCallScreen.bind(that)
                            }).addStyleClass("orangeButton sapUiSmallMarginLeft")
                        );

                        // ambalaj log raporu
                        oToolbar.addContent(
                            new sap.m.Button({
                                text: "Ambalaj Log Raporuna Git",
                                icon: "sap-icon://table-view",
                                press: that._main.onOpenLogScreen.bind(that),
                                visible: "{pm>/header/routeLogApplication}",
                            }).addStyleClass("blueButton sapUiSmallMarginLeft")
                        );

                    }
                }
            });
        },

        setUiForSupplier: function (that, supplierNo) {

            var dModel = that.getOModel(that, "dm");
            var dData = dModel.getData();

            var pModel = that.getOModel(that, "pm");
            var pData = pModel.getData();

            dData["isSupplier"] = true;
            dData["supplierNo"] = supplierNo;
            dModel.refresh();

            pData["iconTabBar"]["PKOLMAYAN"] = false;
            pData["iconTabBar"]["SUMMARY"] = true;

            pData["header"]["lifnrFilter"] = false;
            pData["header"]["routeCallApplication"] = false;
            pData["header"]["routeLogApplication"] = false;
            
            pModel.refresh();
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

        onOpenLogScreen: function (that) {
            debugger;

            var systemId;
            if (sap.ushell) {
                systemId = sap.ushell.Container.getLogonSystem("system").getName();
            } else {
                systemId = "DS4";
            }

            var url;
            if (systemId === "DS4") {
                url = "https://vhvctds4ci.sap.abdiibrahim.com.tr:44300/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=100&sap-language=TR#ZARB_AMBALAJL-display";
            }
            else if (systemId === "QS4") {
                url = "https://vhvctqs4ci.sap.abdiibrahim.com.tr:44300/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=100&sap-language=TR#ZARB_AMBALAJL-display";

            }
            else if (systemId === "PS4") {
                url = "https://vhvctps4ci.sap.abdiibrahim.com.tr:44300/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=100&sap-language=TR#ZARB_AMBALAJL-display";

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
                var deliveryDate = oItem.Slfdt;
                deliveryDate.setHours(0, 0, 0, 0);

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

        setDetailPopupVisibility: function (that, data) {

            // sevk miktarı alanlarını da güncelle 
            var dModel = that.getOModel(that, "dm");
            var dData = dModel.getData();

            dData["sSelectedEbelnTableData"][0]["Sevkm"] = data[0].Sevkm;
            dData["sSelectedEbelnTableData"][0]["RestSevkm"] = data[0].RestSevkm;
            dModel.refresh();

            var pModel = that.getOModel(that, "pm");
            var pData = pModel.getData();

            // hepsini önce false yap 
            for (var key in pData.detailPopup) {
                if (typeof pData.detailPopup[key] === "boolean") {
                    pData.detailPopup[key] = false;
                }
            }

            // sadece butonları yönet
            if (data && data.length > 0) {
                var result = data[0];
                Object.keys(result).forEach(function (key) {
                    if (key.startsWith("BtnVis") && pData.detailPopup.hasOwnProperty(key)) {
                        pData.detailPopup[key] = result[key];
                    }
                });
            }

            // sevk mktarı açıksa - sevk yapılan miktarı görsün - 
            if (pData.detailPopup["BtnVisSevk"]) {
                pData.detailPopup["SevkedVis"] = true;
            }


            // not ekle açıksa 
            if (pData.detailPopup["BtnVisAddNote"] === true) {
                pData.detailPopup["AddNoteArea"] = true;
            }

            pModel.refresh();
            that.closeBusyDialog();
        },


        // checkData: function (that, action) {

        //     var dModel = that.getOModel(that, "dm");
        //     var dData = dModel.getData();

        //     switch (action) {
        //         case 'ADD_NOTE':
        //             var note = dData.detailPopupNote?.trim();

        //             if (!note) {
        //                 // MessageBox.error(
        //                 //     oBundle.getText("note_field_required"), // i18n: "Lütfen bir not giriniz."
        //                 //     {
        //                 //         title: oBundle.getText("missing_fields_title"),
        //                 //         actions: [MessageBox.Action.OK],
        //                 //         emphasizedAction: MessageBox.Action.OK
        //                 //     }
        //                 // );
        //                 that.showMessage("error", "note_field_required");
        //                 return;
        //             }

        //             that.confirmMessageWithActonResponse(that, "confirmAddNote", that.onConfirmResponse, 'ADD_NOTE'); // i18n: "Notu eklemek istediğinize emin misiniz?"
        //             break;
        //         default:
        //             break;
        //     }

        // },


        checkData: function (that, action) {
            var dModel = that.getOModel(that, "dm");
            var dData = dModel.getData();
            var note = dData.detailPopupNote?.trim();

            switch (action) {
                case 'AN': // Not ekleme
                    if (!note) {
                        that.showMessage("error", "note_field_required");
                        return;
                    }
                    that.confirmMessageWithActonResponse(that, "confirmAddNote", that.onConfirmResponse, action);
                    break;

                case 'AC': // Onayla

                    that.confirmMessageWithActonResponse(that, "confirmApprove", that.onConfirmResponse, action);
                    break;

                case 'RJ': // Reddet
                    if (!note) {
                        that.showMessage("error", "note_field_required");
                        return;
                    }
                    that.confirmMessageWithActonResponse(that, "confirmReject", that.onConfirmResponse, action);
                    break;

                case 'CN': // İptal Et
                    if (!note) {
                        that.showMessage("error", "note_field_required");
                        return;
                    }
                    that.confirmMessageWithActonResponse(that, "confirmCancel", that.onConfirmResponse, action);
                    break;

                case 'CA': // İptali Onayla
                    that.confirmMessageWithActonResponse(that, "confirmCancelApprove", that.onConfirmResponse, action);
                    break;

                case 'CR': // İptali Reddet
                    if (!note) {
                        that.showMessage("error", "note_field_required");
                        return;
                    }
                    that.confirmMessageWithActonResponse(that, "confirmCancelReject", that.onConfirmResponse, action);
                    break;

                case 'CV': // İptali Revize Et
                    if (!note) {
                        that.showMessage("error", "note_field_required");
                        return;
                    }
                    var slfdi = dData.sSelectedEbelnTableData[0].Slfdi
                    if (!slfdi || slfdi.toString().trim() === "") {
                        that.showMessage("error", "slfdi_field_required");
                        return;
                    }
                    that.confirmMessageWithActonResponse(that, "confirmCancelRevise", that.onConfirmResponse, action);
                    break;

                case 'RV': // Revize Et 
                    // firma teslim tarihini revize edebilir yani zorunlu  - not girişi zorunludur
                    if (!note) {
                        that.showMessage("error", "note_field_required");
                        return;
                    }

                    var slfdi = dData.sSelectedEbelnTableData[0].Slfdi
                    if (!slfdi || slfdi.toString().trim() === "") {
                        that.showMessage("error", "slfdi_field_required");
                        return;
                    }
                    that.confirmMessageWithActonResponse(that, "confirmRevise", that.onConfirmResponse, action);
                    break;

                // case 'SD': // Gönder

                //     that.confirmMessageWithActonResponse(that, "confirmSend", that.onConfirmResponse, action);
                //     break;

                case 'SE': // Sevk Et
                    debugger;
                    var tesyr = dData.sSelectedEbelnTableData[0].Tesyr?.trim();
                    var plaka = dData.sSelectedEbelnTableData[0].Plaka?.trim();
                    var sofor = dData.sSelectedEbelnTableData[0].Sofor?.trim();
                    var sevkm = dData.sSelectedEbelnTableData[0].RestSevkm?.trim();
                    if (!tesyr) {
                        that.showMessage("error", "tesyr_field_required");
                        return;
                    }
                    if (!plaka) {
                        that.showMessage("error", "plaka_field_required");
                        return;
                    }
                    if (!sofor) {
                        that.showMessage("error", "sofor_field_required");
                        return;
                    }
                    if (!sevkm || sevkm === "0") {
                        that.showMessage("error", "sevkm_field_required");
                        return;
                    }

                    that.confirmMessageWithActonResponse(that, "confirmSevk", that.onConfirmResponse, action);
                    break;

                case 'PK': // PK

                    that.confirmMessageWithActonResponse(that, "confirmPackage", that.onConfirmResponse, action);
                    break;

                default:
                    break;
            }
        },

        approveSuccessInformation: function (that, data) {
            var i18n = that.getView().getModel("i18n").getResourceBundle();
            var action = data.Action;
            var successTitle = i18n.getText("Success");
            var messageKey = "";

            switch (action) {
                case "AN":
                    messageKey = "noteAddedSuccessfully";
                    break;
                case "AC":
                    messageKey = "approvedSuccessfully";
                    break;
                case "RJ":
                    messageKey = "rejectedSuccessfully";
                    break;
                case "CN":
                    messageKey = "cancelledSuccessfully";
                    break;
                case "CA":
                    messageKey = "cancelApproveSuccess";
                    break;
                case "CR":
                    messageKey = "cancelRejectSuccess";
                    break;
                case "CV":
                    messageKey = "cancelReviseSuccess";
                    break;
                case "RV":
                    messageKey = "reviseSuccess";
                    break;
                case "SE":
                    messageKey = "sevkSuccess";
                    break;
                case "PK":
                    messageKey = "pkSuccess";
                    break;
                default:
                    messageKey = "processSuccesfullyDone";
                    break;
            }

            MessageBox.success(i18n.getText(messageKey), {
                title: successTitle,
                onClose: function () {
                    if (that.OrderDetailPopup) {
                        that.OrderDetailPopup.close();
                    }
                    that._oData.getList(that);
                }
            });
        }




    });
});