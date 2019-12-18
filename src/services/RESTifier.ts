import { RouteHandler } from "./RouteHandler";
import { REST_Options } from '../interfaces/REST_Options';
import { REST_RequestValidator } from '../interfaces/REST_RequestValidator';
import * as mongoose from 'mongoose';
import { RequestType } from "../enums/RequestType";
import { DefaultDAO } from "../DAOs/DefaultDAO";
import { AbstractDAO } from "../DAOs/AbstractDAO";
import { REST_API_Specification } from "../interfaces/REST_APISpec";


/**
 *  This class provides functionality to dynamically build REST API endpoints. 
 *  It consists of the following methods, all of them extendable from subclasses:
 *  - [RESTifyModel]: wraps everything up. This is the method that will be used from external parts of the app.
 *  - [applyDefaults]: applies default functionalities that don't need to be provided at every API definition.
 *  - [buildHandler]: builds the handlers for every REST endpoint (GET, POST, PUT, DELETE).
 *  - [addValidators]: applies the given validators to every endpoint. Normally you wouldn't modify this.
 */
export class RESTifier {

    routeHandler: RouteHandler;

    constructor(routeHandler: RouteHandler) {
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
    public RESTifyModel(apiSpec: REST_API_Specification) {

        // Set default values for optional parameters
        this.applyDefaults(apiSpec);

        // Create Route Objects (but not apply yet) and build their handlers
        const apiPathName = apiSpec.model.modelName.toLowerCase();
        const GET_Route = {
            method: 'GET',
            path: `/${apiPathName}/{id?}`,
            handler: this.buildHandler(RequestType.GET, apiSpec.customDAO, apiSpec.options)
        }

        const POST_Route = {
            method: 'POST',
            path: `/${apiPathName}`,
            handler: this.buildHandler(RequestType.POST, apiSpec.customDAO, apiSpec.options)
        }

        const PUT_Route = {
            method: 'PUT',
            path: `/${apiPathName}`,
            handler: this.buildHandler(RequestType.PUT, apiSpec.customDAO, apiSpec.options)
        }

        const DELETE_Route = {
            method: 'DELETE',
            path: `/${apiPathName}/{id?}`,
            handler: this.buildHandler(RequestType.DELETE, apiSpec.customDAO, apiSpec.options)
        }

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


    protected applyDefaults(apiSpec: REST_API_Specification) {
        if (!apiSpec.options) apiSpec.options = { GET_pageSize: 50, logThis: false };
        if (!apiSpec.customDAO) apiSpec.customDAO = new DefaultDAO(apiSpec.model);
    }

    protected buildHandler(reqType: RequestType, dao: AbstractDAO, options: REST_Options, ) {
        switch (reqType) {
            case RequestType.GET:
                return async (req, h) => {
                    try {
                        const id = req.params.id;
                        const page = req.params.page ? Number(req.param.size) : 0;

                        const result = await dao.read(id);
                        if (result instanceof Array) {
                            return result.slice(page * options.GET_pageSize, options.GET_pageSize);
                        } else {
                            return result;
                        }
                    } catch (err) {
                        console.log(`[API ERROR] for model ${dao.model.modelName.toLowerCase()}: ${err}`);
                        return `[500] ${err}; <a href='/'>go back to index.</a> `;
                    }
                }

            case RequestType.POST:
                return async (req, h) => {
                    try {
                        const payload = req.payload;
                        if (payload) {
                            await dao.create(payload);
                            return true;
                        } else {
                            throw "Something wrong happened";
                        }

                    } catch (err) {
                        console.log(`[API ERROR] for model ${dao.model.modelName.toLowerCase()}: ${err}`);
                        return `[500] ${err}; <a href='/'>go back to index.</a> `;
                    }
                }
            case RequestType.PUT:
                return async (req, h) => {
                    try {
                        const payload = req.payload;
                        if (payload) {
                            await dao.update(payload.id, payload);
                            return true;
                        } else {
                            throw "Something wrong happened";
                        }

                    } catch (err) {
                        console.log(`[API ERROR] for model ${dao.model.modelName.toLowerCase()}: ${err}`);
                        return `[500] ${err}; <a href='/'>go back to index.</a> `;
                    }
                }
            case RequestType.DELETE:
                return async (req, h) => {
                    try {
                        const id = req.params.id;
                        if (id) {
                            await dao.delete(id);
                            return true;
                        } else {
                            throw "Something wrong happened";
                        }

                    } catch (err) {
                        console.log(`[API ERROR] for model ${dao.model.modelName.toLowerCase()}: ${err}`);
                        return `[500] ${err}; <a href='/'>go back to index.</a> `;
                    }
                }
        }

    }

    private addValidators(routeObj: any, validators: Array<REST_RequestValidator>, reqType: RequestType) {
        let validatorObj;
        if (validatorObj = validators.find(v => v.requestType == reqType)) {
            if (reqType == RequestType.GET || reqType == RequestType.DELETE) {
                Object.assign(routeObj, {
                    options: {
                        validate: {
                            params: validatorObj
                        }
                    }
                })
            } else if (reqType == RequestType.POST || reqType == RequestType.PUT) {
                Object.assign(routeObj, {
                    options: {
                        validate: {
                            payload: validatorObj
                        }
                    }
                })
            }
        }
    }
}