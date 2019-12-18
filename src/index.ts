import * as Hapi from 'hapi';
import * as Path from "path";
import * as env from './Environment';
import { RouteHandler } from './services/RouteHandler';
import { MongoConnector } from './services/MongoConnector';
import { RESTifier } from './services/RESTifier';
import { HobbyModel, HobbyValidators } from './entities/Hobby';
import { UserModel, UserValidators } from './entities/User';
import { REST_Options } from './interfaces/REST_Options';


// Functions are split so testing becomes easier

export async function setupHapi() {
    console.log("*** STARTING SERVER ***\n\n[1] - Initial setup and plugin registering")
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
    return server;
}


export function connectToMongo() { // not async as Mongoose acts synchronically
    console.log("[2] - Connecting to Mongo database");
    const mongoHandler = new MongoConnector(env.MONGO_IP, env.MONGO_PORT, env.MONGO_DBNAME);
    mongoHandler.connect();
}



// Wrapper async function for initializing server with ease
export const initializeServer = async () => {
    try {
        // Setup Hapi server instance
        const server = await setupHapi();

        // Connect to Mongo
        connectToMongo();

        // Assign routes and create REST API endpoints
        console.log("[3] - Loading default routes")
        const routeHandler = new RouteHandler(server);
        const restifier = new RESTifier(routeHandler);
    
        console.log("[4] - Creating REST API endpoints")
        const options: REST_Options = {logThis: true};
        restifier.RESTifyModel({ model: HobbyModel, validators: HobbyValidators, options: options });
        restifier.RESTifyModel({ model: UserModel, validators: UserValidators, options: options  });

        // Start server
        console.log("[5] - Starting server");
        await server.start(env.PORT);

        console.log('[SUCCESS] - Server running at:', server.info.uri);
    } catch (err) {
        console.error("[STARTUP ERROR] initializeServer() -> ", err)
    }

};

initializeServer();