"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const RequestType_1 = require("../enums/RequestType");
exports.HobbySchema = new mongoose.Schema({
    name: String,
    passionLevel: Number,
    year: Number,
});
exports.HobbyModel = mongoose.model('Hobby', exports.HobbySchema);
exports.HobbyValidators = [
    {
        validators: {
            name: Joi.string().min(3).max(25),
            passionLevel: Joi.number().min(0).max(5),
            year: Joi.number().required()
        },
        requestType: RequestType_1.RequestType.POST
    },
    {
        validators: { _id: Joi.required() },
        requestType: RequestType_1.RequestType.PUT
    },
    {
        validators: { _id: Joi.required() },
        requestType: RequestType_1.RequestType.DELETE
    },
];
//# sourceMappingURL=Hobby.js.map