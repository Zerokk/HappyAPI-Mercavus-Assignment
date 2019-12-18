"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class handles all the routes of the application, for a given Hapi server instance. It also
 * allows other parts of the app to add custom routes.
 */
class RouteHandler {
    constructor(hapiServer) {
        this.hapiServerRef = hapiServer;
        this.initialize();
    }
    initialize() {
        // Default route
        this.hapiServerRef.route({
            method: 'GET',
            path: '/',
            handler: (req, h) => h.file('index.html')
        });
        // 404 Error handling
        this.hapiServerRef.route({
            method: '*',
            path: '/{any*}',
            handler: (req, h) => 'ERROR 404: Page not found, <a href="/">return to homepage</a>'
        });
    }
    addRouteObject(routeObject) {
        this.hapiServerRef.route(routeObject);
    }
}
exports.RouteHandler = RouteHandler;
//# sourceMappingURL=RouteHandler.js.map