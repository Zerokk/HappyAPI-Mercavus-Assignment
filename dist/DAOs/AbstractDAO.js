"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractDAO {
    constructor(model) {
        this.model = model;
    }
    validId(id) {
        return id.match(/^[0-9a-fA-F]{24}$/) ? true : false;
    }
}
exports.AbstractDAO = AbstractDAO;
//# sourceMappingURL=AbstractDAO.js.map