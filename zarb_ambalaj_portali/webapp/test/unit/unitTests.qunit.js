/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comappabdiibrahim/zarb_ambalaj_portali/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
