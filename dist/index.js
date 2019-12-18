"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hapi = require("hapi");
const Path = require("path");
const env = require("./Environment");
const RouteHandler_1 = require("./services/RouteHandler");
const MongoConnector_1 = require("./services/MongoConnector");
const RESTifier_1 = require("./services/RESTifier");
const Hobby_1 = require("./entities/Hobby");
const User_1 = require("./entities/User");
// Declare function for initializing server
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("*** STARTING SERVER ***\n\n[1] - Initial setup and plugin registering");
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
    yield server.register(require('inert'));
    // Connect to Mongo
    console.log("[2] - Connecting to Mongo database");
    const mongoHandler = new MongoConnector_1.MongoConnector(env.MONGO_IP, env.MONGO_PORT, env.MONGO_DBNAME);
    mongoHandler.connect();
    // Assign routes and create REST API endpoints
    console.log("[3] - Loading default routes");
    const routeHandler = new RouteHandler_1.RouteHandler(server);
    const restifier = new RESTifier_1.RESTifier(routeHandler);
    console.log("[4] - Creating REST API endpoints");
    restifier.RESTifyModel({ model: Hobby_1.HobbyModel, validators: Hobby_1.HobbyValidators });
    restifier.RESTifyModel({ model: User_1.UserModel, validators: User_1.UserValidators });
    // Start server
    console.log("[5] - Starting server");
    yield server.start(env.PORT);
    console.log('[SUCCESS] - Server running at:', server.info.uri);
});
initializeServer();
//# sourceMappingURL=index.js.map