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
const AbstractDAO_1 = require("./AbstractDAO");
class DefaultDAO extends AbstractDAO_1.AbstractDAO {
    create(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield this.model.create(obj);
            created.save();
            return created._id;
        });
    }
    read(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_id) {
                if (!this.validId(_id)) {
                    throw "Invalid ID provided";
                }
                return this.model.findById(_id).exec();
            }
            else {
                return this.model.find().exec();
            }
        });
    }
    update(_id, newObj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validId(_id)) {
                yield this.model.updateOne({ _id: _id }, newObj);
            }
            else {
                throw "This object did not previously exist";
            }
        });
    }
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validId(_id)) {
                yield this.model.deleteOne({ _id: _id });
            }
            else {
                throw "This object did not previously exist";
            }
        });
    }
}
exports.DefaultDAO = DefaultDAO;
//# sourceMappingURL=DefaultDAO.js.map