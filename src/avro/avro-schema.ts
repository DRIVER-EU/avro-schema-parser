import { IAvroRecord, IAvroEnum, IAvroSchema } from './avro-schema';
export type AvroPrimitiveType = 'null' | 'boolean' | 'int' | 'long' | 'float' | 'double' | 'string' | 'bytes';

export type AvroComplexType = 'record' | 'enum' | 'array' | 'map' | 'union' | 'fixed';

export type AvroType = AvroPrimitiveType | AvroComplexType;

export type AvroSchemaType = string | AvroType | IAvroSchema;

export interface IAvroSchema {
  /** The name of the record */
  name: string;
  /** Optional namespace to qualify the name: full name is namespace.name */
  namespace?: string;
  /** Slternate names for this record */
  aliases?: string[];
  type: AvroType;
  /** Documentation to the user of this schema */
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
  values: AvroType;
}

export interface IAvroField {
  /** Name of the field */
  name: string;
  /** A schema, or a record definition */
  type: AvroSchemaType | AvroSchemaType[];
  /** Documentation to the user of this schema */
  doc?: string;
  /** Optional default value: its type should match the first AvroType type. */
  default?: null | 'null' | string | number;
}
