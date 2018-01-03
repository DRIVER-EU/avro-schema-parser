import { IAvroSchema, AvroSchemaType } from './avro/avro-schema';
export declare const clone: <T>(obj: T) => T;
export declare const findAVSCFilesInFolder: (folder: string) => string[];
export declare const isPrimitiveAvroType: (schemaType: string | IAvroSchema | AvroSchemaType[]) => boolean;
export declare const isComplexAvroType: (schemaType: string | IAvroSchema | AvroSchemaType[]) => boolean;
