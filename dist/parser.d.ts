import { ICommandOptions } from './cli';
export declare class Parser {
    private schemas;
    private definedSchemas;
    constructor(options: ICommandOptions);
    private flattenSchema(schemaName);
    private flattenAvroSchema(schema);
    private schemaNotDefined(schemaType);
    private transpileAvroType(schemaType);
    private flattenAvroRecord(schema);
    private flattenAvroArray(schema);
    private flattenAvroMap(schema);
    private loadSchemas(folder);
    private storeSchema(schema);
}
