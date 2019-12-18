import * as Hapi from 'hapi';
import * as Path from "path";
import * as env from './Environment';
import { RouteHandler } from './services/RouteHandler';
import { MongoConnector } from './services/MongoConnector';
import { RESTifier } from './services/RESTifier';
import { HobbyModel, HobbyValidators } from './entities/Hobby';
import { UserModel, UserValidators } from './entities/User';





// Declare function for initializing server
const initializeServer = async () => {
    console.log("*** STARTING SERVER ***\n\n[1] - Initial setup and plugin registering")

    // Setup Hapi instance
    const server = Hapi.server({
        host: 'localhost',
        port: 3000,
        routes: {
            files: {
                relativeTo: Path.resolve('public')
            }
        }
    });

    // Plugin registering
    await server.register(require('inert'));

    // Connect to Mongo
    console.log("[2] - Connecting to Mongo database")
    const mongoHandler = new MongoConnector(env.MONGO_IP, env.MONGO_PORT, env.MONGO_DBNAME);
    mongoHandler.connect();

    // Assign routes and create REST API endpoints
    console.log("[3] - Loading default routes")
    const routeHandler = new RouteHandler(server);
    const restifier = new RESTifier(routeHandler);

    console.log("[4] - Creating REST API endpoints")
    restifier.RESTifyModel({ model: HobbyModel, validators: HobbyValidators });
    restifier.RESTifyModel({ model: UserModel, validators: UserValidators });



    // Start server
    console.log("[5] - Starting server");
    await server.start(env.PORT);

    console.log('[SUCCESS] - Server running at:', server.info.uri);
};

initializeServer();