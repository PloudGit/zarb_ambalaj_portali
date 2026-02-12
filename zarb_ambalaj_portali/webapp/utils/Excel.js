sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/export/Spreadsheet"
], function (
    ManagedObject,
    Spreadsheet
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

            switch (sModelPath) {

                case "OrderListWeeklyDeliveries":
                    return that._excel._getSummaryCols(i18n);
                case "OrderListLateDeliveries":
                    return that._excel._getSummaryCols(i18n);
                case "OrderListFutureDeliveries":
                    return that._excel._getSummaryCols(i18n);
                case "OrderListONAY": // OK
                    return that._excel._getApprovedCallsCols(i18n);
                case "OrderListACIKCAGRI": // OK
                    return that._excel._getOpenCallsCols(i18n);
                case "OrderListPKOLMAYAN": // OK 
                    return that._excel._getNoPkCallsCols(i18n);
                case "OrderListREVF": // OK 
                    return that._excel._getRevisionCallsCols(i18n);
                case "OrderListIPTT": // OK 
                    return that._excel._getCanceledCallsCols(i18n);
                case "OrderListTUM": // OK 
                    return that._excel._getAllCallsCols(i18n);
                case "OrderListREVE": // OK
                    return that._excel._getAbdiRevisionCols(i18n);
                case "OrderListGET_TUM_SIPARIS_S": // OK 
                    return that._excel._getAllOrdersCols(i18n);
                default:
                    return "";
            }
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
        
                { label: i18n.getText("reviseFirmDeliveryDate"), property: "Eindt", type: "date", width: 15 },
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



    });
});