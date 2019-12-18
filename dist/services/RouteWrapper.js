"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This function wraps all the controllers in their respectives routes.
 *
 * @param hapiServer Instance of the Hapi server object to add the routes to
 */
function RouteWrapper(hapiServer) {
    hapiServer.route({
        method: 'GET',
        path: '/',
        handler: (req, h) => h.file('index.html')
    });
}
exports.RouteWrapper = RouteWrapper;
//# sourceMappingURL=RouteWrapper.js.map