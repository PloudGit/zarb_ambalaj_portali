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
            var oSmartFilterBar = this.byId("smartFilterBar");

            var aFilters = oSmartFilterBar.getFilters();

            this._oData.getOrderList(this, aFilters);

        },

       
    });
});
