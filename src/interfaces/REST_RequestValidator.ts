import { RequestType } from "../enums/RequestType";

export interface REST_RequestValidator {
    requestType: RequestType,
    validators: any;
}