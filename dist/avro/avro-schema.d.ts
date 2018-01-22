import { IAvroSchema } from './avro-schema';
export declare type AvroPrimitiveType = 'null' | 'boolean' | 'int' | 'long' | 'float' | 'double' | 'string' | 'bytes';
export declare type AvroComplexType = 'record' | 'enum' | 'array' | 'map' | 'union' | 'fixed';
export declare type AvroType = AvroPrimitiveType | AvroComplexType;
export declare type AvroSchemaType = string | AvroType | IAvroSchema;
export interface IAvroSchema {
    name: string;
    namespace?: string;
    aliases?: string[];
    type: AvroType | AvroType[];
    doc?: string;
}
export interface IAvroRecord extends IAvroSchema {
    type: 'record';
    fields: IAvroField[];
}
export interface IAvroEnum extends IAvroSchema {
    type: 'enum';
    symbols: string[];
}
export interface IAvroArray extends IAvroSchema {
    type: 'array';
    items: AvroType | IAvroSchema;
}
export interface IAvroMap extends IAvroSchema {
    type: 'map';
    values: AvroType | IAvroSchema;
}
export interface IAvroField {
    name: string;
    type: AvroSchemaType | AvroSchemaType[];
    doc?: string;
    default?: null | 'null' | string | number;
}
