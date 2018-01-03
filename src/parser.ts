import * as fs from 'fs';
import * as path from 'path';
import { ICommandOptions } from './cli';
import { IAvroSchema, IAvroRecord, IAvroField, AvroSchemaType, IAvroArray } from './avro/avro-schema';
import { findAVSCFilesInFolder, isPrimitiveAvroType, isComplexAvroType, clone } from './utils';

/**
 * Process the original schema file and inline all schema's, if any.
 *
 */
export class Parser {
  private schemas: { [key: string]: IAvroSchema } = {};
  private definedSchemas: string[] = [];

  constructor(options: ICommandOptions) {
    this.loadSchemas(options.folder);
    this.flattenSchema(options.schema);
  }

  /**
   * Replace all custom schema's with inline schema's.
   * @param schemaName Name of the schema to flatten
   */
  private flattenSchema(schemaName: string) {
    if (!this.schemas.hasOwnProperty(schemaName)) { throw ReferenceError(`Schema name '${schemaName}' is not found! Did you perhaps forget to include the namespace?`); }
    const schema = this.schemas[schemaName];
    let newSchema: IAvroSchema;
    switch (schema.type) {
      case 'record':
        newSchema = this.flattenAvroRecord(schema as IAvroRecord);
        break;
      default:
        throw ReferenceError(`Cannot flatten ${schema.type}!`);
    }
    newSchema.name = schemaName;
    fs.writeFileSync(path.resolve(schemaName + '.avsc'), JSON.stringify(newSchema, null, 2), 'utf8');
  }

  private flattenAvroSchema(schema: IAvroSchema) {
    switch (schema.type) {
      case 'record':
        return this.flattenAvroRecord(schema as IAvroRecord);
      case 'array':
        return this.flattenAvroArray(schema as IAvroArray);
      case 'map':
        console.warn(`Warning: schema ${schema.name} type of map has not been tested.`);
        return schema;
      case 'fixed':
        console.warn(`Warning: schema ${schema.name} type of map has not been tested.`);
        return schema;
      case 'enum':
        return schema;
      default:
        return schema;
      // throw ReferenceError(`Cannot flatten ${schema.type}!`);
    }
  };

  /**
   * Check if we have already created this schema type, so we can reference it (instead of adding it again inline, which
   * will cause a validation error).
   *
   * @param schemaType Schema type to check
   */
  private schemaNotDefined(schemaType: string) { return this.definedSchemas.indexOf(schemaType) < 0; }

  private transpileAvroType(schemaType: AvroSchemaType | AvroSchemaType[]): AvroSchemaType | AvroSchemaType[] {
    if (schemaType instanceof Array) {
      return schemaType.map(s => this.transpileAvroType(s)) as AvroSchemaType[];
    } else if (typeof schemaType === 'string') {
      if (isPrimitiveAvroType(schemaType) || isComplexAvroType(schemaType)) { return schemaType; }
      if (this.schemas.hasOwnProperty(schemaType) && this.schemaNotDefined(schemaType)) {
        this.definedSchemas.push(schemaType);
        return this.flattenAvroSchema(this.schemas[schemaType]);
      }
      return schemaType;
    } else {
      return this.flattenAvroSchema(schemaType as IAvroSchema);
    }
  }

  private flattenAvroRecord(schema: IAvroRecord) {
    const flattenedFields = schema.fields.map(f => {
      f.type = this.transpileAvroType(f.type);
      return f;
    });
    if (!flattenedFields) { schema.fields = flattenedFields as IAvroField[]; }
    return schema;
  };

  private flattenAvroArray(schema: IAvroArray) {
    const schemaType = schema.items;
    schema.items = this.transpileAvroType(schemaType) as IAvroSchema;
    return schema;
  };

  /**
   * Load all schema files.
   *
   * @param folder Folder to look for schema files
   */
  private loadSchemas(folder: string) {
    const schemaFiles = findAVSCFilesInFolder(folder);
    if (schemaFiles.length === 0) { throw URIError(`${folder} does not contain any schema files (*.avsc).`); }
    schemaFiles.forEach(f => {
      const schemaFile = JSON.parse(fs.readFileSync(f, 'utf8')) as IAvroSchema | IAvroSchema[];
      this.storeSchema(schemaFile);
    });
  }

  /**
   * Store all the existing schemas by their full name, e.g. namespace.name
   *
   * @param schema Original schema that needs to be flattened
   */
  private storeSchema(schema: IAvroSchema | IAvroSchema[]) {
    if (schema instanceof Array) {
      schema.forEach(s => this.storeSchema(s));
    } else {
      if (!schema.name) { throw SyntaxError('Schema name is undefined: ' + JSON.stringify(schema, null, 2)); }
      const name = schema.namespace ? `${schema.namespace}.${schema.name}` : schema.name;
      this.schemas[name] = schema;
    }
  }
}
