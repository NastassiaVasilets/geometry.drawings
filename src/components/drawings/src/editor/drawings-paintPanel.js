/**
 * Paint panel.
 */

Drawings.PaintPanel = function (containerId, model) {
    this.containerId = containerId;

    this.model = model;

    this.controller = null;

    this.board = null;

    this.rendererMap = {};
};

Drawings.PaintPanel.prototype = {

    init: function () {
        this._initMarkup(this.containerId);

        this.board = this._createBoard();

        this._configureModel();

        this.controller = new Drawings.Controller(this, this.model);

        this.rendererMap["Point"] = new Drawings.PointRenderer(this.board);
        this.rendererMap["Line"] = new Drawings.LineRenderer(this.board);
        this.rendererMap["Segment"] = new Drawings.SegmentRenderer(this.board);
        this.rendererMap["Triangle"] = new Drawings.TriangleRenderer(this.board);
        this.rendererMap["Polygon"] = new Drawings.PolygonRenderer(this.board);
        this.rendererMap["Circle"] = new Drawings.CircleRenderer(this.board);
        this.rendererMap["Angle"] = new Drawings.AngleRenderer(this.board);
    },

    getBoard: function () {
        return this.board;
    },

    getJxgObjects: function (event) {
        return this.board.getAllObjectsUnderMouse(event);
    },

    getJxgPoint: function (event) {
        var jxgObjects = this.getJxgObjects(event);

        var jxgPoints = jxgObjects.filter(function (jxgObject) {
            return jxgObject instanceof JXG.Point;
        });

        return jxgPoints.length > 0 ? jxgPoints[0] : null;
    },

    getMouseCoordinates: function (event) {
        var coordinates = this.board.getUsrCoordsOfMouse(event);
        return [coordinates[0], coordinates[1]];
    },

    _initMarkup: function (containerId) {
        var container = $('#' + containerId);
        var paintPanel = this;

        // root element
        container.append('<div id="geometryEditor" class="sc-no-default-cmd geometryEditor"></div>');
        var editor = $('#geometryEditor');

        SCWeb.core.Server.resolveScAddr(['ui_geometry_editor',
        ], function (keynodes) {
            editor.attr("sc_addr", keynodes['ui_geometry_editor']);
        });
        this._initApplet();
    },

    _initApplet: function() {
        var parameters = {
            "showToolBar":true,
            "borderColor":null,
            "showMenuBar":false,
            "showAlgebraInput":false,
            "showResetIcon":true,
            "enableLabelDrags":true,
            "enableShiftDragZoom":true,
            "enableRightClick":true,
            "enableDialogActive":true,
            "capturingThreshold":null,
            "showToolBarHelp":false,
            "errorDialogsActive":true,
            "useBrowserForJS":true,
            "showLogging":true,
            "allowStyleBar":false,
            "enable3d":true
            //"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"
        };
        var applet = new GGBApplet(parameters, '5.0');
        applet.inject('geometryEditor');
    }
};
