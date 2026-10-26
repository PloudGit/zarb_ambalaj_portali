sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (
    ManagedObject,
    Spreadsheet,
    MessageBox,
    MessageToast
) {
    "use strict";

    return ManagedObject.extend("com.app.abdiibrahim.zarbambalajportali.utils.Excel", {

        _getExcelFileName: function (that, sModelPath) {
            var i18n = that.getView().getModel("i18n").getResourceBundle();

            var mFileNames = {
                OrderListWeeklyDeliveries: i18n.getText("panelWeeklyDeliveries"),
                OrderListLateDeliveries: i18n.getText("panelLateDeliveries"),
                OrderListFutureDeliveries: i18n.getText("panelFutureDeliveries"),
                OrderListACIKCAGRI: i18n.getText("openCallsTableTitle"),
                OrderListPKOLMAYAN: i18n.getText("noPkCallsTableTitle"),
                OrderListREVF: i18n.getText("revisionCallsTableTitle"),
                OrderListONAY: i18n.getText("approvedCallsTableTitle"),
                OrderListIPTT: i18n.getText("cancaledCallsTableTitle"),
                OrderListGET_TUM_SIPARIS_S: i18n.getText("allOrdersTableTitle"),
                OrderListTUM: i18n.getText("allCallsTableTitle"),
                OrderListREVE: i18n.getText("abdiRevisionTableTitle")
            };

            return (mFileNames[sModelPath] || "Export") + ".xlsx";
        },
        export: function (oConfig, that) {
            debugger;
            var aFormattedData = oConfig.data.map(function (item) {
                return Object.assign({}, item, {
                    Menge: that.formatters.formatDecimal(item.Menge),
                    Netpr: that.formatters.formatDecimal(item.Netpr),
                    MalGirisi: that.formatters.formatDecimal(item.MalGirisi),
                    Slfdt: that.formatters.adjustStartDateForUTC(item.Slfdt),
                    Slfdi: that.formatters.adjustStartDateForUTC(item.Slfdi),
                    CreateDate: that.formatters.adjustStartDateForUTC(item.CreateDate),
                    Eindt: that.formatters.adjustStartDateForUTC(item.Eindt)
                });
            });

            var oSettings = {
                workbook: {
                    columns: oConfig.columns,
                    context: {
                        // sheetName: oConfig.sheetName
                        sheetName: oConfig.fileName
                    }
                },
                dataSource: aFormattedData,
                fileName: oConfig.fileName
            };

            var oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },

        getColumnConfig: function (that, sModelPath, oView) {
            var i18n = oView.getModel("i18n").getResourceBundle();
            var aCols;

            switch (sModelPath) {
                case "OrderListWeeklyDeliveries":
                case "OrderListLateDeliveries":
                case "OrderListFutureDeliveries":
                    aCols = that._excel._getSummaryCols(i18n); break;
                case "OrderListONAY":
                    aCols = that._excel._getApprovedCallsCols(i18n); break;
                case "OrderListACIKCAGRI":
                    aCols = that._excel._getOpenCallsCols(i18n); break;
                case "OrderListPKOLMAYAN":
                    aCols = that._excel._getNoPkCallsCols(i18n); break;
                case "OrderListREVF":
                    aCols = that._excel._getRevisionCallsCols(i18n); break;
                case "OrderListIPTT":
                    aCols = that._excel._getCanceledCallsCols(i18n); break;
                case "OrderListTUM":
                    aCols = that._excel._getAllCallsCols(i18n); break;
                case "OrderListREVE":
                    aCols = that._excel._getAbdiRevisionCols(i18n); break;
                case "OrderListGET_TUM_SIPARIS_S":
                    aCols = that._excel._getAllOrdersCols(i18n); break;
                default:
                    return "";
            }

            // Firma Teyit kolonu - sadece tedarikçi, Açık Çağrılar ve Abdi Revizyon
            var bSupplier = oView.getModel("dm").getProperty("/isSupplier") === true;
            if (bSupplier) {
                if (sModelPath === "OrderListACIKCAGRI") {
                    that._excel._insertFirmaTeyitCol(aCols, "Slfdt", i18n);
                } else if (sModelPath === "OrderListREVE") {
                    that._excel._insertFirmaTeyitCol(aCols, "Slfdi", i18n);
                }
            }

            return aCols;
        },

        _insertFirmaTeyitCol: function (aCols, sAfterProperty, i18n) {
            var iIndex = aCols.findIndex(function (c) { return c.property === sAfterProperty; });
            aCols.splice(iIndex + 1, 0, {
                label: i18n.getText("firmConfirm"),
                property: "FirmaTeyit",
                type: "date",
                width: 15
            });
        },

        _getSummaryCols: function (i18n) {
            return [
                { label: i18n.getText("callNumber"), property: "ApKey", width: 20 },
                { label: i18n.getText("orderNumber"), property: "Ebeln", width: 15 },
                { label: i18n.getText("orderItem"), property: "Ebelp", width: 10 },
                { label: i18n.getText("supplierCode"), property: "Lifnr", width: 15 },
                { label: i18n.getText("supplierName"), property: "Name1", width: 30 },
                { label: i18n.getText("materialCode"), property: "Matnr", width: 15 },
                { label: i18n.getText("materialDesc"), property: "Txt01", width: 40 },
                { label: i18n.getText("printCode"), property: "Normt", width: 15 },
                { label: i18n.getText("quantity"), property: "Menge", width: 12 },
                { label: i18n.getText("unit"), property: "Meins", width: 8 },
                { label: i18n.getText("callCreatedDate"), property: "CreateDate", type: "date", width: 15 },
                { label: i18n.getText("firmDeliveryDate"), property: "Slfdt", type: "date", width: 15 },
                { label: i18n.getText("openDayCount"), property: "AcikDcount", width: 12 },
                { label: i18n.getText("price"), property: "Netpr", width: 12 },
                { label: i18n.getText("currency"), property: "Waers", width: 8 },
                { label: i18n.getText("deliveryNumber"), property: "Etenr", width: 10 },
                { label: i18n.getText("callCreatedBy"), property: "CreateUname", width: 20 }
            ];
        },
        _getAbdiRevisionCols: function (i18n) {
            return [
                { label: i18n.getText("callNumber"), property: "ApKey", width: 20 },
                { label: i18n.getText("orderNumber"), property: "Ebeln", width: 15 },
                { label: i18n.getText("orderItem"), property: "Ebelp", width: 10 },

                { label: i18n.getText("supplierCode"), property: "Lifnr", width: 15 },
                { label: i18n.getText("supplierName"), property: "Name1", width: 30 },

                { label: i18n.getText("materialCode"), property: "Matnr", width: 15 },
                { label: i18n.getText("materialDesc"), property: "Txt01", width: 40 },
                { label: i18n.getText("printCode"), property: "Normt", width: 15 },

                { label: i18n.getText("quantity"), property: "Menge", width: 12 },
                { label: i18n.getText("unit"), property: "Meins", width: 8 },

                { label: i18n.getText("callCreatedDate"), property: "CreateDate", type: "date", width: 15 },
                { label: i18n.getText("firmDeliveryDate"), property: "Slfdt", type: "date", width: 15 },
                { label: i18n.getText("reviseFirmDeliveryDate"), property: "Slfdi", type: "date", width: 15 },
                { label: i18n.getText("price"), property: "Netpr", width: 12 },
                { label: i18n.getText("currency"), property: "Waers", width: 8 },
                { label: i18n.getText("deliveryNumber"), property: "Etenr", width: 10 },

                { label: i18n.getText("callCreatedBy"), property: "CreateUname", width: 20 },

            ];
        },

        _getAllCallsCols: function (i18n) {
            return [
                { label: i18n.getText("callNumber"), property: "ApKey", width: 20 },
                { label: i18n.getText("orderNumber"), property: "Ebeln", width: 15 },
                { label: i18n.getText("orderItem"), property: "Ebelp", width: 10 },

                { label: i18n.getText("supplierCode"), property: "Lifnr", width: 15 },
                { label: i18n.getText("supplierName"), property: "Name1", width: 30 },

                { label: i18n.getText("materialCode"), property: "Matnr", width: 15 },
                { label: i18n.getText("materialDesc"), property: "Txt01", width: 40 },
                { label: i18n.getText("printCode"), property: "Normt", width: 15 },

                { label: i18n.getText("quantity"), property: "Menge", width: 12 },
                { label: i18n.getText("unit"), property: "Meins", width: 8 },

                { label: i18n.getText("callCreatedDate"), property: "CreateDate", type: "date", width: 15 },
                { label: i18n.getText("firmDeliveryDate"), property: "Slfdt", type: "date", width: 15 },

                { label: i18n.getText("reviseFirmDeliveryDate"), property: "Slfdi", type: "date", width: 15 },
                { label: i18n.getText("price"), property: "Netpr", width: 12 },
                { label: i18n.getText("currency"), property: "Waers", width: 8 },
                { label: i18n.getText("deliveryNumber"), property: "Etenr", width: 10 },

                { label: i18n.getText("callCreatedBy"), property: "CreateUname", width: 20 },

                { label: i18n.getText("goodsReceipt"), property: "MalGirisi", width: 15 },
                { label: i18n.getText("statu"), property: "Statu", width: 12 }
            ];
        },


        _getAllOrdersCols: function (i18n) {
            return [
                { label: i18n.getText("callNumber"), property: "ApKey", width: 20 },
                { label: i18n.getText("orderNumber"), property: "Ebeln", width: 15 },
                { label: i18n.getText("orderItem"), property: "Ebelp", width: 10 },
                { label: i18n.getText("supplierCode"), property: "Lifnr", width: 15 },
                { label: i18n.getText("supplierName"), property: "Name1", width: 30 },
                { label: i18n.getText("materialCode"), property: "Matnr", width: 15 },
                { label: i18n.getText("materialDesc"), property: "Txt01", width: 40 },
                { label: i18n.getText("printCode"), property: "Normt", width: 15 },
                { label: i18n.getText("openQuantity"), property: "RestMenge", width: 12 },
                { label: i18n.getText("quantity"), property: "Menge", width: 12 },
                { label: i18n.getText("unit"), property: "Meins", width: 8 },
                { label: i18n.getText("orderDate"), property: "CreateDate", type: "date", width: 15 },
                { label: i18n.getText("firmDeliveryDate"), property: "Slfdt", type: "date", width: 15 },
                { label: i18n.getText("price"), property: "Netpr", width: 12 },
                { label: i18n.getText("currency"), property: "Waers", width: 8 },
                { label: i18n.getText("goodsReceipt"), property: "MalGirisi", width: 15 },
                { label: i18n.getText("statu"), property: "Statu", width: 12 }
            ];
        },

        _getCanceledCallsCols: function (i18n) {
            return [
                { label: i18n.getText("callNumber"), property: "ApKey", width: 20 },
                { label: i18n.getText("orderNumber"), property: "Ebeln", width: 15 },
                { label: i18n.getText("orderItem"), property: "Ebelp", width: 10 },

                { label: i18n.getText("supplierCode"), property: "Lifnr", width: 15 },
                { label: i18n.getText("supplierName"), property: "Name1", width: 30 },

                { label: i18n.getText("materialCode"), property: "Matnr", width: 15 },
                { label: i18n.getText("materialDesc"), property: "Txt01", width: 40 },
                { label: i18n.getText("printCode"), property: "Normt", width: 15 },

                { label: i18n.getText("quantity"), property: "Menge", width: 12 },
                { label: i18n.getText("unit"), property: "Meins", width: 8 },

                { label: i18n.getText("callCreatedDate"), property: "CreateDate", type: "date", width: 15 },
                { label: i18n.getText("firmDeliveryDate"), property: "Slfdt", type: "date", width: 15 },

                { label: i18n.getText("price"), property: "Netpr", width: 12 },
                { label: i18n.getText("currency"), property: "Waers", width: 8 },
                { label: i18n.getText("deliveryNumber"), property: "Etenr", width: 10 },

                { label: i18n.getText("callCreatedBy"), property: "CreateUname", width: 20 }
            ];
        },

        _getApprovedCallsCols: function (i18n) {
            return [
                { label: i18n.getText("callNumber"), property: "ApKey", width: 20 },
                { label: i18n.getText("orderNumber"), property: "Ebeln", width: 15 },
                { label: i18n.getText("orderItem"), property: "Ebelp", width: 10 },
                { label: i18n.getText("supplierCode"), property: "Lifnr", width: 15 },
                { label: i18n.getText("supplierName"), property: "Name1", width: 30 },
                { label: i18n.getText("materialCode"), property: "Matnr", width: 15 },
                { label: i18n.getText("materialDesc"), property: "Txt01", width: 40 },
                { label: i18n.getText("printCode"), property: "Normt", width: 15 },
                { label: i18n.getText("quantity"), property: "Menge", width: 12 },
                { label: i18n.getText("unit"), property: "Meins", width: 8 },
                { label: i18n.getText("callCreatedDate"), property: "CreateDate", type: "date", width: 15 },
                { label: i18n.getText("firmDeliveryDate"), property: "Slfdt", type: "date", width: 15 },
                { label: i18n.getText("reviseFirmDeliveryDate"), property: "Slfdi", type: "date", width: 15 },
                { label: i18n.getText("price"), property: "Netpr", width: 12 },
                { label: i18n.getText("currency"), property: "Waers", width: 8 },
                { label: i18n.getText("deliveryNumber"), property: "Etenr", width: 10 },
                { label: i18n.getText("callCreatedBy"), property: "CreateUname", width: 20 },
                { label: i18n.getText("goodsReceipt"), property: "MalGirisi", width: 15 }
            ];
        },


        _getRevisionCallsCols: function (i18n) {
            return [
                { label: i18n.getText("callNumber"), property: "ApKey", width: 20 },
                { label: i18n.getText("orderNumber"), property: "Ebeln", width: 15 },
                { label: i18n.getText("orderItem"), property: "Ebelp", width: 10 },

                { label: i18n.getText("supplierCode"), property: "Lifnr", width: 15 },
                { label: i18n.getText("supplierName"), property: "Name1", width: 30 },

                { label: i18n.getText("materialCode"), property: "Matnr", width: 15 },
                { label: i18n.getText("materialDesc"), property: "Txt01", width: 40 },
                { label: i18n.getText("printCode"), property: "Normt", width: 15 },

                { label: i18n.getText("quantity"), property: "Menge", width: 12 },
                { label: i18n.getText("unit"), property: "Meins", width: 8 },

                { label: i18n.getText("callCreatedDate"), property: "CreateDate", type: "date", width: 15 },
                { label: i18n.getText("firmDeliveryDate"), property: "Slfdt", type: "date", width: 15 },
                { label: i18n.getText("reviseFirmDeliveryDate"), property: "Slfdi", type: "date", width: 15 },
                { label: i18n.getText("price"), property: "Netpr", width: 12 },
                { label: i18n.getText("deliveryNumber"), property: "Etenr", width: 10 },
                { label: i18n.getText("callCreatedBy"), property: "CreateUname", width: 20 }

            ];
        },

        _getNoPkCallsCols: function (i18n) {
            return [
                { label: i18n.getText("callNumber"), property: "ApKey", width: 20 },
                { label: i18n.getText("orderNumber"), property: "Ebeln", width: 15 },
                { label: i18n.getText("orderItem"), property: "Ebelp", width: 10 },
                { label: i18n.getText("supplierCode"), property: "Lifnr", width: 15 },
                { label: i18n.getText("supplierName"), property: "Name1", width: 30 },
                { label: i18n.getText("materialCode"), property: "Matnr", width: 15 },
                { label: i18n.getText("materialDesc"), property: "Txt01", width: 40 },
                { label: i18n.getText("printCode"), property: "Normt", width: 15 },
                { label: i18n.getText("quantity"), property: "Menge", width: 12 },
                { label: i18n.getText("unit"), property: "Meins", width: 8 },
                { label: i18n.getText("callCreatedDate"), property: "CreateDate", type: "date", width: 15 },
                { label: i18n.getText("firmDeliveryDate"), property: "Slfdt", type: "date", width: 15 },
                { label: i18n.getText("price"), property: "Netpr", width: 12 },
                { label: i18n.getText("currency"), property: "Waers", width: 8 },
                { label: i18n.getText("deliveryNumber"), property: "Etenr", width: 10 },
                { label: i18n.getText("callCreatedBy"), property: "CreateUname", width: 20 }
            ];
        },

        _getOpenCallsCols: function (i18n) {
            return [

                { label: i18n.getText("callNumber"), property: "ApKey", width: 20 },
                { label: i18n.getText("orderNumber"), property: "Ebeln", width: 15 },
                { label: i18n.getText("orderItem"), property: "Ebelp", width: 10 },
                { label: i18n.getText("supplierCode"), property: "Lifnr", width: 15 },
                { label: i18n.getText("supplierName"), property: "Name1", width: 30 },
                { label: i18n.getText("materialCode"), property: "Matnr", width: 15 },
                { label: i18n.getText("materialDesc"), property: "Txt01", width: 40 },
                { label: i18n.getText("printCode"), property: "Normt", width: 15 },
                { label: i18n.getText("quantity"), property: "Menge", width: 12 },
                { label: i18n.getText("unit"), property: "Meins", width: 8 },
                { label: i18n.getText("callCreatedDate"), property: "CreateDate", type: "date", width: 15 },
                { label: i18n.getText("firmDeliveryDate"), property: "Slfdt", type: "date", width: 15 },
                { label: i18n.getText("openDayCount"), property: "AcikDcount", width: 12 },
                { label: i18n.getText("price"), property: "Netpr", width: 12 },
                { label: i18n.getText("currency"), property: "Waers", width: 8 },
                { label: i18n.getText("deliveryNumber"), property: "Etenr", width: 10 },
                { label: i18n.getText("callCreatedBy"), property: "CreateUname", width: 20 },

            ];
        },

        // ================= FIRMA TEYİT UPLOAD =================
        uploadFirmaTeyit: function (that, oFile, sModelPath) {
            var oExcel = this;
            var i18n = that.getView().getModel("i18n").getResourceBundle();

            sap.ui.require(["com/app/abdiibrahim/zarbambalajportali/libs/xlsx.full.min"], function (XLSX) {
                var oReader = new FileReader();
                oReader.onload = function (e) {
                    try {
                        var oWb = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
                        var oWs = oWb.Sheets[oWb.SheetNames[0]];
                        var aRows = XLSX.utils.sheet_to_json(oWs, { defval: "", raw: true });
                        oExcel._applyFirmaTeyit(that, XLSX, aRows, sModelPath, i18n);
                    } catch (err) {
                        console.error("Firma teyit excel okuma hatası:", err);
                        MessageBox.error(i18n.getText("fcErrorRead"));
                    }
                };
                oReader.readAsArrayBuffer(oFile);
            }, function () {
                MessageBox.error(i18n.getText("fcErrorLib"));
            });
        },

        _applyFirmaTeyit: function (that, XLSX, aRows, sModelPath, i18n) {
            var oExcel = this;
            var dModel = that.getView().getModel("dm");
            var aTable = dModel.getProperty("/" + sModelPath) || [];

            // Açık Çağrılar -> Firma Teslim Tarihi, Abdi Revizyon -> Revize Firma Teslim Tarihi
            var sBaseProp = sModelPath === "OrderListREVE" ? "Slfdi" : "Slfdt";

            var sColEbeln = i18n.getText("orderNumber");
            var sColEbelp = i18n.getText("orderItem");
            var sColEtenr = i18n.getText("deliveryNumber");
            var sColTeyit = i18n.getText("firmConfirm");

            if (!aRows.length) {
                MessageBox.error(i18n.getText("fcErrorEmpty"));
                return;
            }

            var aMissing = [sColEbeln, sColEbelp, sColEtenr, sColTeyit].filter(function (c) {
                return !Object.prototype.hasOwnProperty.call(aRows[0], c);
            });
            if (aMissing.length) {
                MessageBox.error(i18n.getText("fcErrorColumns", [aMissing.join(", ")]));
                return;
            }

            // Ekrandaki liste: Ebeln|Ebelp|Etenr
            var mTable = {};
            aTable.forEach(function (r) {
                mTable[r.Ebeln + "|" + r.Ebelp + "|" + r.Etenr] = r;
            });

            var iToday = oExcel._ymdLocal(new Date());
            var aUpdates = [];
            var aWarnings = [];
            var mSeen = {};

            aRows.forEach(function (x, i) {
                var vTeyit = x[sColTeyit];
                if (vTeyit === "" || vTeyit === null || vTeyit === undefined) {
                    return; // boş -> işlem yapılmayacak
                }

                var sEbeln = oExcel._pad(x[sColEbeln], 10);
                var sEbelp = oExcel._pad(x[sColEbelp], 5);
                var sEtenr = oExcel._pad(x[sColEtenr], 4);
                var sKey = sEbeln + "|" + sEbelp + "|" + sEtenr;
                var sLabel = i18n.getText("fcRowLabel", [i + 2, sEbeln + " / " + sEbelp + " / " + sEtenr]);

                if (mSeen[sKey]) {
                    aWarnings.push(sLabel + ": " + i18n.getText("fcWarnDuplicate"));
                    return;
                }
                mSeen[sKey] = true;

                var oRow = mTable[sKey];
                if (!oRow) {
                    aWarnings.push(sLabel + ": " + i18n.getText("fcWarnNotInList"));
                    return;
                }

                var oDate = oExcel._parseExcelDate(XLSX, vTeyit);
                if (!oDate) {
                    aWarnings.push(sLabel + ": " + i18n.getText("fcWarnInvalidDate"));
                    return;
                }

                // OData tarihleri UTC gece yarısı, Excel tarihi yerel -> gün bazında karşılaştır
                var iTeyit = oExcel._ymdLocal(oDate);
                var iBase = oRow[sBaseProp] ? oExcel._ymdUtc(oRow[sBaseProp]) : 0;
                var sAction = (iTeyit === iBase) ? "AC" : "RV";

                if (sAction === "RV" && iTeyit < iToday) {
                    aWarnings.push(sLabel + ": " + i18n.getText("fcWarnPastDate"));
                    return;
                }

                aUpdates.push({ row: oRow, date: oDate, action: sAction });
            });

            var sWarnHtml = "<ul>" + aWarnings.map(function (w) {
                return "<li>" + w + "</li>";
            }).join("") + "</ul>";

            if (!aUpdates.length) {
                MessageBox.error(i18n.getText("fcNoValidRows"), {
                    details: aWarnings.length ? sWarnHtml : undefined
                });
                return;
            }

            var fnApply = function () {
                // önceki yüklemeden kalanları temizle
                aTable.forEach(function (r) {
                    delete r.FirmaTeyit;
                    delete r.BulkAction;
                });
                aUpdates.forEach(function (u) {
                    u.row.FirmaTeyit = u.date;
                    u.row.BulkAction = u.action;
                });
                dModel.refresh(true);

                var iAc = aUpdates.filter(function (u) { return u.action === "AC"; }).length;
                MessageToast.show(i18n.getText("fcApplied", [aUpdates.length, iAc, aUpdates.length - iAc]));
            };

            if (aWarnings.length) {
                MessageBox.warning(i18n.getText("fcWarnTitle", [aWarnings.length]), {
                    details: sWarnHtml,
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            fnApply();
                        }
                    }
                });
            } else {
                fnApply();
            }
        },

        _parseExcelDate: function (XLSX, v) {
            if (v instanceof Date) {
                return new Date(v.getFullYear(), v.getMonth(), v.getDate());
            }
            if (typeof v === "number") {
                if (v < 1) { return null; }
                var o = XLSX.SSF.parse_date_code(v);
                return o ? this._validDate(o.y, o.m, o.d) : null;
            }
            var s = String(v).trim();
            var m = s.match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})$/); // dd.MM.yyyy - dd/MM/yyyy
            if (m) { return this._validDate(+m[3], +m[2], +m[1]); }
            m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);             // yyyy-MM-dd
            if (m) { return this._validDate(+m[1], +m[2], +m[3]); }
            return null;
        },

        _validDate: function (y, m, d) {
            var o = new Date(y, m - 1, d);
            return (o.getFullYear() === y && o.getMonth() === m - 1 && o.getDate() === d) ? o : null;
        },

        _pad: function (v, n) {
            return String(v === null || v === undefined ? "" : v).trim().padStart(n, "0");
        },

        _ymdLocal: function (d) {
            return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
        },

        _ymdUtc: function (d) {
            return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
        },


    });
});