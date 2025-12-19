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
            // this._Router.getRoute("Display").attachMatched(this._onRouteMatchedDisplay, this);

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

        _onRouteMatchedDisplay: function (oEvent) {
            // Route matched işlemleri
            var that = this;


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
            var dModel= this.getOModel(this, "dm");
            dModel.setProperty("/sSelectedEbelnRowData", oRowData);


            this._selectedRow = oRowData;

            this._main.setDetailPopupVisibility(this); 


            this._orderDetailPopup(selectedKey).open();

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

        



    });
});
