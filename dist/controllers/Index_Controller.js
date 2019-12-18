"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index_Controller = (req, h) => {
    console.log(`[INFO] (${new Date().toUTCString()}) >> ${req.info.remoteAddress} visited the index page.`);
    return h.file('index.html');
};
//# sourceMappingURL=Index_Controller.js.map