"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const RequestType_1 = require("../enums/RequestType");
exports.UserSchema = new mongoose.Schema({
    name: String,
    hobbies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hobby' }]
});
exports.UserModel = mongoose.model('User', exports.UserSchema);
exports.UserValidators = [
    {
        validators: {
            name: Joi.string().min(3).max(15),
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
//# sourceMappingURL=User.js.map