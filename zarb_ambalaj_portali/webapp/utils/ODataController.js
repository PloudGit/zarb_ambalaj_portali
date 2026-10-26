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

			// her koşulda Main controller'dan al
			var oMainController = null;
			if (that.getView().getViewName().indexOf("Main") !== -1) {
				oMainController = that;
			} else {
				// OpenCalls gibi sub-view'lardan geliyorsa parent'tan bul
				var oParent = that.getView().getParent();
				while (oParent) {
					if (oParent.getController && oParent.getController()) {
						var ctrl = oParent.getController();
						if (ctrl.getView().getViewName().indexOf("Main") !== -1) {
							oMainController = ctrl;
							break;
						}
					}
					oParent = oParent.getParent();
				}
			}

			var url = "/AmbOrderListSet";

			var bModel = that.getOModel(that, "bm");
			var bData = bModel.getData();

			var dModel = that.getOModel(that, "dm");
			var dData = dModel.getData();
			var aFilters = [];
			var selectedKey = that._main.getIcontabBarSelectedKey(that);

			var oSmartFilterBar = oMainController._oSmartFilterBar || oMainController.byId("smartFilterBar");

			// var oSmartFilterBar = that.byId("smartFilterBar");
			if (oSmartFilterBar) {
				aFilters = oSmartFilterBar.getFilters();
			}
			aFilters.push(new Filter("StatuFiori", FilterOperator.EQ, selectedKey));

			if (dData["isSupplier"] === true && dData["supplierNo"] !== "") { // tedarikçi ise filtre olarak gönder 

				aFilters.push(new Filter("Lifnr", FilterOperator.EQ, dData["supplierNo"]));

			}


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
		getPopupInfo: function (that, rowData) {
			return new Promise(function (resolve, reject) {

				var dModel = that.getOModel(that, "dm");
				var dData = dModel.getData();

				var url = "/AmbDetailOprSet";
				var oDataModel = that.getOwnerComponent().getModel();

				var aFilters = [
					new Filter("Ebeln", FilterOperator.EQ, rowData.Ebeln),
					new Filter("Ebelp", FilterOperator.EQ, rowData.Ebelp),
					new Filter("Etenr", FilterOperator.EQ, rowData.Etenr),
					new Filter("Statu", FilterOperator.EQ, rowData.Statu),
					new Filter("IsSupplier", FilterOperator.EQ, dData.isSupplier),
					new Filter("Tabinfo", FilterOperator.EQ, dData.iconTabBarSelectedKey)
				];

				that.openBusyDialog();

				oDataModel.read(url, {
					filters: aFilters,
					success: function (oData) {
						// that.closeBusyDialog();

						if (oData && oData.results) {
							that._main.setDetailPopupVisibility(that, oData.results);
							resolve();
						} else {
							reject();
						}
					},
					error: function (oError) {
						that.closeBusyDialog();
						that._oData.handleODataErrors(that);
						reject(oError);
					}
				});
			});
		},

		approveProcess: function (that, data) {

			var url = "/AmbDetailOprSet";

			debugger;
			var oDataModel = that.getOwnerComponent().getModel();
			that.openBusyDialog();
			oDataModel.create(url, data, {
				success: function (oData, oResponse) {

					debugger;
					that.closeBusyDialog();
					that._main.approveSuccessInformation(that, oData);
				},
				error: function (oError) {
					debugger;
					// that.openMessagePopover(that);
					that.closeBusyDialog();
					that._oData.handleODataErrors(that);

				}
			});

		},

		getTeslimYeriList: function (that) {

			var url = "/DomainValueSet";

			var bModel = that.getOModel(that, "bm");
			var bData = bModel.getData();

			var dModel = that.getOModel(that, "dm");
			var dData = dModel.getData();
			var aFilters = [];

			aFilters.push(new Filter("Domname", FilterOperator.EQ, 'ZARBD_AP_TESYR'));

			var oDataModel = that.getOwnerComponent().getModel();

			oDataModel.read(url, {
				filters: aFilters,
				success: function (oData, oResponse) {

					dData["TeslimYeriList"] = oData.results;
					dModel.refresh();

				},
				error: function (oError) {
					that.closeBusyDialog();
					that._oData.handleODataErrors(that);

				}

			});

		},

		getUserInfo: function (that) {

			var url = "/UserInfoSet";

			var dModel = that.getOModel(that, "dm");
			var dData = dModel.getData();

			var oDataModel = that.getOwnerComponent().getModel();

			oDataModel.read(url, {
				success: function (oData, oResponse) {

					if (!oData || !oData.results || oData.results.length === 0) {
						return;
					}

					var userData = oData.results[0];

					if (!userData.Uname) {
						return;
					}

					dData["SyUname"] = userData.Uname;
					dData["IsSupplier"] = userData.IsSupplier;
					dModel.refresh();

					// tedarikçi ise ui değiştir 
					if (userData.IsSupplier) {
						that._main.setUiForSupplier(that, userData.Uname);
					}

				},
				error: function (oError) {
					that.closeBusyDialog();
					that._oData.handleODataErrors(that);

				}

			});

		},
		 // ================= FIRMA TEYİT - TOPLU ONAY / REVİZE =================
        saveFirmaTeyit: function (that, sModelPath) {
            var i18n = that.getView().getModel("i18n").getResourceBundle();
            var dModel = that.getView().getModel("dm");
            var dData = dModel.getData();

            var aRows = (dModel.getProperty("/" + sModelPath) || []).filter(function (r) {
                return r.BulkAction === "AC" || r.BulkAction === "RV";
            });

            if (!aRows.length) {
                MessageBox.warning(i18n.getText("fcNothingToSave"));
                return;
            }

            var iAc = aRows.filter(function (r) { return r.BulkAction === "AC"; }).length;
            var iRv = aRows.length - iAc;

            MessageBox.confirm(i18n.getText("fcConfirmSave", [aRows.length, iAc, iRv]), {
                title: i18n.getText("titleConfirm"),
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        that._oData._sendFirmaTeyit(that, sModelPath, aRows, i18n, dData);
                    }
                }
            });
        },

        _sendFirmaTeyit: function (that, sModelPath, aRows, i18n, dData) {
            var oDataModel = that.getOwnerComponent().getModel();

            // Not başlığı - tekli revize ile aynı format
            var sFormattedDateTime = new Date().toLocaleString("tr-TR", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            });
            var sNoteHeader = (dData["SyUname"] || "") + " " + sFormattedDateTime + "   ";
            var sNewNote = sNoteHeader + i18n.getText("note_type_REVISE") + " " + i18n.getText("fcExcelNote");

            var aItems = aRows.map(function (r) {
                var oItem = {
                    Ebeln: r.Ebeln,
                    Ebelp: r.Ebelp,
                    Etenr: r.Etenr,
                    Action: r.BulkAction
                };

                if (r.BulkAction === "RV") {
                    var sOldNote = (r.Desc1 || "").trim();
                    oItem.Slfdi = that.formatters.adjustStartDateForUTC(r.FirmaTeyit);
                    oItem.Desc1 = sOldNote ? sOldNote + "\n\n" + sNewNote : sNewNote; // not geçmişi korunur
                }
                return oItem;
            });

            var oPayload = {
                BulkId: "1",
                Tabinfo: sModelPath.replace("OrderList", ""),
                ToBulkItems: aItems
            };

            that.openBusyDialog();
            oDataModel.create("/AmbBulkHeaderSet", oPayload, {
                success: function (oData) {
                    that.closeBusyDialog();
                    that._oData._showFirmaTeyitResult(that, oData, i18n);
                },
                error: function () {
                    that.closeBusyDialog();
                    that._oData.handleODataErrors(that);
                }
            });
        },

        _showFirmaTeyitResult: function (that, oData, i18n) {
            var aResults = (oData.ToBulkItems && oData.ToBulkItems.results) || [];
            var aErrors = aResults.filter(function (r) { return r.Msgty === "E"; });

            var fnRefresh = function () {
                that._oData.getList(that);
            };

            if (!aErrors.length) {
                MessageBox.success(i18n.getText("fcSaveSuccess", [oData.SuccessCnt]), {
                    onClose: fnRefresh
                });
                return;
            }

            var sDetails = "<ul>" + aErrors.map(function (r) {
                return "<li>" + r.Ebeln + " / " + r.Ebelp + " / " + r.Etenr + ": " + r.Message + "</li>";
            }).join("") + "</ul>";

            MessageBox.warning(i18n.getText("fcSavePartial", [oData.SuccessCnt, oData.ErrorCnt]), {
                details: sDetails,
                onClose: fnRefresh
            });
        },




	});
});