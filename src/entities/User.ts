import * as mongoose from 'mongoose'
import Joi = require('@hapi/joi');
import { RequestType } from '../enums/RequestType';
import { REST_RequestValidator } from '../interfaces/REST_RequestValidator';


export const UserSchema = new mongoose.Schema({
    name: String,
    hobbies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Hobby'}]
 });


export const UserModel = mongoose.model('User', UserSchema);

export const UserValidators: Array<REST_RequestValidator> = [
    {
        validators: {
            name: Joi.string().min(3).max(15),
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