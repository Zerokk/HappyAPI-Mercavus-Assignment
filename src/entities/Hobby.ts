import * as mongoose from 'mongoose'
import { REST_RequestValidator } from '../interfaces/REST_RequestValidator';
import * as Joi from '@hapi/joi';
import { RequestType } from '../enums/RequestType';


export const HobbySchema = new mongoose.Schema({
    name: String,
    passionLevel: Number,
    year: Number,
});


export const HobbyModel = mongoose.model('Hobby', HobbySchema);


export const HobbyValidators: Array<REST_RequestValidator> = [
    {
        validators: {
            name: Joi.string().min(3).max(25),
            passionLevel: Joi.number().min(0).max(5),
            year: Joi.number().required()
        },
        requestType: RequestType.POST
    },
    {
        validators: {_id: Joi.required()},
        requestType: RequestType.PUT
    },
    {
        validators: { _id: Joi.required()},
        requestType: RequestType.DELETE
    },
]