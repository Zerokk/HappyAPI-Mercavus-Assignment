import { HobbyValidators, HobbyModel } from '../entities/Hobby';
import { RequestType } from '../enums/RequestType';
import { DefaultDAO } from '../DAOs/DefaultDAO';

/**
 * This class handles all the routes of the application, for a given Hapi server instance. It also
 * allows other parts of the app to add custom routes.
 */
export class RouteHandler {

    private hapiServerRef;

    constructor(hapiServer) {
        this.hapiServerRef = hapiServer;
        this.initialize();
    }


    private initialize() {
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

    public addRouteObject(routeObject) {
        this.hapiServerRef.route(routeObject);
    }



}
