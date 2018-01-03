"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
exports.clone = function (obj) { return JSON.parse(JSON.stringify(obj)); };
exports.findAVSCFilesInFolder = function (folder) {
    folder = path.resolve(folder);
    return fs.statSync(folder).isFile()
        ? path.extname(folder).toLowerCase() === '.avsc' ? [folder] : []
        : fs.readdirSync(folder).filter(function (f) {
            var ext = path.extname(f).toLowerCase();
            return ext && (ext.toLowerCase() === '.avsc');
        }).map(function (f) { return path.join(folder, f); });
};
exports.isPrimitiveAvroType = function (schemaType) {
    var primitiveTypes = ['null', 'boolean', 'int', 'long', 'float', 'double', 'string', 'bytes'];
    return typeof schemaType === 'string' && primitiveTypes.indexOf(schemaType.toLowerCase()) >= 0;
};
exports.isComplexAvroType = function (schemaType) {
    var complexTypes = ['record', 'enum', 'array', 'map', 'union', 'fixed'];
    return typeof schemaType === 'string' && complexTypes.indexOf(schemaType.toLowerCase()) >= 0;
};
//# sourceMappingURL=utils.js.map