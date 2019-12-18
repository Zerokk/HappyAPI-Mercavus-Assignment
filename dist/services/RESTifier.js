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
const RequestType_1 = require("../enums/RequestType");
const DefaultDAO_1 = require("../DAOs/DefaultDAO");
/**
 *  This class provides functionality to dynamically build REST API endpoints.
 *  It consists of the following methods, all of them extendable from subclasses:
 *  - [RESTifyModel]: wraps everything up. This is the method that will be used from external parts of the app.
 *  - [applyDefaults]: applies default functionalities that don't need to be provided at every API definition.
 *  - [buildHandler]: builds the handlers for every REST endpoint (GET, POST, PUT, DELETE).
 *  - [addValidators]: applies the given validators to every endpoint. Normally you wouldn't modify this.
 */
class RESTifier {
    constructor(routeHandler) {
        this.routeHandler = routeHandler;
    }
    /**
     * This method builds all routes for handling CRUD operations through a REST API to a given model. It
     * consists of the following parameters:
     * - model: Mongoose model to use
     * - validators (Optional) Set of validation rules for every request type
     * - options (Optional) Some options to customize the API endpoint
     * - customDAO (Optional) Custom DAO to change how objects are fetched from the database
     *
     * @param apiSpec API Specification object (see definition above).
     */
    RESTifyModel(apiSpec) {
        // Set default values for optional parameters
        this.applyDefaults(apiSpec);
        // Create Route Objects (but not apply yet) and build their handlers
        const apiPathName = apiSpec.model.modelName.toLowerCase();
        const GET_Route = {
            method: 'GET',
            path: `/${apiPathName}/{id?}`,
            handler: this.buildHandler(RequestType_1.RequestType.GET, apiSpec.customDAO, apiSpec.options)
        };
        const POST_Route = {
            method: 'POST',
            path: `/${apiPathName}`,
            handler: this.buildHandler(RequestType_1.RequestType.POST, apiSpec.customDAO, apiSpec.options)
        };
        const PUT_Route = {
            method: 'PUT',
            path: `/${apiPathName}`,
            handler: this.buildHandler(RequestType_1.RequestType.PUT, apiSpec.customDAO, apiSpec.options)
        };
        const DELETE_Route = {
            method: 'DELETE',
            path: `/${apiPathName}/{id?}`,
            handler: this.buildHandler(RequestType_1.RequestType.DELETE, apiSpec.customDAO, apiSpec.options)
        };
        // Register validators (if any)
        /* ERROR: As this part is failing (lack of experience with Hapi and Joi, maybe...!, I'm commenting it)
        if (apiSpec.validators) {
            this.addValidators(GET_Route, apiSpec.validators, RequestType.GET);
            this.addValidators(POST_Route, apiSpec.validators, RequestType.POST);
            this.addValidators(PUT_Route, apiSpec.validators, RequestType.PUT);
            this.addValidators(DELETE_Route, apiSpec.validators, RequestType.DELETE);
        }
        */
        // Finally register routes
        this.routeHandler.addRouteObject(GET_Route);
        this.routeHandler.addRouteObject(POST_Route);
        this.routeHandler.addRouteObject(PUT_Route);
        this.routeHandler.addRouteObject(DELETE_Route);
    }
    applyDefaults(apiSpec) {
        if (!apiSpec.options)
            apiSpec.options = { GET_pageSize: 0, logThis: false };
        if (!apiSpec.customDAO)
            apiSpec.customDAO = new DefaultDAO_1.DefaultDAO(apiSpec.model);
    }
    buildHandler(reqType, dao, options) {
        switch (reqType) {
            case RequestType_1.RequestType.GET:
                return (req, h) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (options.logThis) {
                            console.info(`[INFO] (${new Date().toUTCString()}) >> ${req.info.remoteAddress}   --->  GET on ${dao.model.modelName}`);
                        }
                        const id = req.params.id;
                        const page = req.params.page ? Number(req.param.size) : 0;
                        const result = yield dao.read(id);
                        if (result instanceof Array && options.GET_pageSize != 0) {
                            return result.slice(page * options.GET_pageSize, options.GET_pageSize);
                        }
                        else {
                            return result;
                        }
                    }
                    catch (err) {
                        console.log(`[API ERROR] for model ${dao.model.modelName.toLowerCase()}: ${err}`);
                        return `[500] ${err}; <a href='/'>go back to index.</a> `;
                    }
                });
            case RequestType_1.RequestType.POST:
                return (req, h) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (options.logThis) {
                            console.info(`[INFO] (${new Date().toUTCString()}) >> ${req.info.remoteAddress}   --->  POST on ${dao.model.modelName}`);
                        }
                        const payload = req.payload;
                        if (payload) {
                            const id = yield dao.create(payload);
                            return id;
                        }
                        else {
                            throw "Something wrong happened";
                        }
                    }
                    catch (err) {
                        console.log(`[API ERROR] for model ${dao.model.modelName.toLowerCase()}: ${err}`);
                        return `[500] ${err}; <a href='/'>go back to index.</a> `;
                    }
                });
            case RequestType_1.RequestType.PUT:
                return (req, h) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (options.logThis) {
                            console.info(`[INFO] (${new Date().toUTCString()}) >> ${req.info.remoteAddress}   --->  PUT on ${dao.model.modelName}`);
                        }
                        const payload = req.payload;
                        if (payload) {
                            yield dao.update(payload.id, payload);
                            return true;
                        }
                        else {
                            throw "Something wrong happened";
                        }
                    }
                    catch (err) {
                        console.log(`[API ERROR] for model ${dao.model.modelName.toLowerCase()}: ${err}`);
                        return `[500] ${err}; <a href='/'>go back to index.</a> `;
                    }
                });
            case RequestType_1.RequestType.DELETE:
                return (req, h) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (options.logThis) {
                            console.info(`[INFO] (${new Date().toUTCString()}) >> ${req.info.remoteAddress}   --->  DELETE on ${dao.model.modelName}`);
                        }
                        const id = req.params.id;
                        if (id) {
                            yield dao.delete(id);
                            return true;
                        }
                        else {
                            throw "Something wrong happened";
                        }
                    }
                    catch (err) {
                        console.log(`[API ERROR] for model ${dao.model.modelName.toLowerCase()}: ${err}`);
                        return `[500] ${err}; <a href='/'>go back to index.</a> `;
                    }
                });
        }
    }
    addValidators(routeObj, validators, reqType) {
        let validatorObj;
        if (validatorObj = validators.find(v => v.requestType == reqType)) {
            if (reqType == RequestType_1.RequestType.GET || reqType == RequestType_1.RequestType.DELETE) {
                Object.assign(routeObj, {
                    options: {
                        validate: {
                            params: validatorObj
                        }
                    }
                });
            }
            else if (reqType == RequestType_1.RequestType.POST || reqType == RequestType_1.RequestType.PUT) {
                Object.assign(routeObj, {
                    options: {
                        validate: {
                            payload: validatorObj
                        }
                    }
                });
            }
        }
    }
}
exports.RESTifier = RESTifier;
//# sourceMappingURL=RESTifier.js.map