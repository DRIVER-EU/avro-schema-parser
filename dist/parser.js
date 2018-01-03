"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var utils_1 = require("./utils");
var Parser = (function () {
    function Parser(options) {
        this.schemas = {};
        this.definedSchemas = [];
        this.loadSchemas(options.folder);
        this.flattenSchema(options.schema);
    }
    Parser.prototype.flattenSchema = function (schemaName) {
        if (!this.schemas.hasOwnProperty(schemaName)) {
            throw ReferenceError("Schema name '" + schemaName + "' is not found! Did you perhaps forget to include the namespace?");
        }
        var schema = this.schemas[schemaName];
        var newSchema;
        switch (schema.type) {
            case 'record':
                newSchema = this.flattenAvroRecord(schema);
                break;
            default:
                throw ReferenceError("Cannot flatten " + schema.type + "!");
        }
        newSchema.name = schemaName;
        fs.writeFileSync(path.resolve(schemaName + '.avsc'), JSON.stringify(newSchema, null, 2), 'utf8');
    };
    Parser.prototype.flattenAvroSchema = function (schema) {
        switch (schema.type) {
            case 'record':
                return this.flattenAvroRecord(schema);
            case 'array':
                return this.flattenAvroArray(schema);
            case 'map':
                console.warn("Warning: schema " + schema.name + " type of map has not been tested.");
                return schema;
            case 'fixed':
                console.warn("Warning: schema " + schema.name + " type of map has not been tested.");
                return schema;
            case 'enum':
                return schema;
            default:
                return schema;
        }
    };
    ;
    Parser.prototype.schemaNotDefined = function (schemaType) { return this.definedSchemas.indexOf(schemaType) < 0; };
    Parser.prototype.transpileAvroType = function (schemaType) {
        var _this = this;
        if (schemaType instanceof Array) {
            return schemaType.map(function (s) { return _this.transpileAvroType(s); });
        }
        else if (typeof schemaType === 'string') {
            if (utils_1.isPrimitiveAvroType(schemaType) || utils_1.isComplexAvroType(schemaType)) {
                return schemaType;
            }
            if (this.schemas.hasOwnProperty(schemaType) && this.schemaNotDefined(schemaType)) {
                this.definedSchemas.push(schemaType);
                return this.flattenAvroSchema(this.schemas[schemaType]);
            }
            return schemaType;
        }
        else {
            return this.flattenAvroSchema(schemaType);
        }
    };
    Parser.prototype.flattenAvroRecord = function (schema) {
        var _this = this;
        var flattenedFields = schema.fields.map(function (f) {
            f.type = _this.transpileAvroType(f.type);
            return f;
        });
        if (!flattenedFields) {
            schema.fields = flattenedFields;
        }
        return schema;
    };
    ;
    Parser.prototype.flattenAvroArray = function (schema) {
        var schemaType = schema.items;
        schema.items = this.transpileAvroType(schemaType);
        return schema;
    };
    ;
    Parser.prototype.loadSchemas = function (folder) {
        var _this = this;
        var schemaFiles = utils_1.findAVSCFilesInFolder(folder);
        if (schemaFiles.length === 0) {
            throw URIError(folder + " does not contain any schema files (*.avsc).");
        }
        schemaFiles.forEach(function (f) {
            var schemaFile = JSON.parse(fs.readFileSync(f, 'utf8'));
            _this.storeSchema(schemaFile);
        });
    };
    Parser.prototype.storeSchema = function (schema) {
        var _this = this;
        if (schema instanceof Array) {
            schema.forEach(function (s) { return _this.storeSchema(s); });
        }
        else {
            if (!schema.name) {
                throw SyntaxError('Schema name is undefined: ' + JSON.stringify(schema, null, 2));
            }
            var name = schema.namespace ? schema.namespace + "." + schema.name : schema.name;
            this.schemas[name] = schema;
        }
    };
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map