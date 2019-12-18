import { REST_Options } from "./REST_Options";
import { AbstractDAO } from "../DAOs/AbstractDAO";
import { REST_RequestValidator } from "./REST_RequestValidator";
import { Model, Document } from 'mongoose'; 

/**
 * @param model Mongoose model to use
 * @param validators (Optional) Set of validation rules for every request type
 * @param options (Optional) Some options to customize the API endpoint
 * @param customDAO (Optional) Custom DAO to change how objects are fetched from the database
 */
export interface REST_API_Specification {
    model: Model<Document, {}>,
    validators?: Array<REST_RequestValidator>,
    options?: REST_Options,
    customDAO?: AbstractDAO
}