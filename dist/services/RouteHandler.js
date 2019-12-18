"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Index_Controller_1 = require("../controllers/Index_Controller");
const PageNotFound_Controller_1 = require("../controllers/PageNotFound_Controller");
/**
 * This class handles all the routes of the application, for a given Hapi server instance. It also
 * allows other parts of the app to add custom routes.
 */
class RouteHandler {
    constructor(hapiServer) {
        this.hapiServerRef = hapiServer;
        this.initializeControllers();
    }
    initializeControllers() {
        // Default route (index)
        this.hapiServerRef.route({
            method: 'GET',
            path: '/',
            handler: Index_Controller_1.Index_Controller
        });
        // 404 Error handling
        this.hapiServerRef.route({
            method: '*',
            path: '/{any*}',
            handler: PageNotFound_Controller_1.PageNotFound_Controller
        });
    }
    addRouteObject(routeObject) {
        this.hapiServerRef.route(routeObject);
    }
}
exports.RouteHandler = RouteHandler;
//# sourceMappingURL=RouteHandler.js.map