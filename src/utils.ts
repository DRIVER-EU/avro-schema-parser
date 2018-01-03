import { IAvroSchema, IAvroRecord, IAvroField, AvroSchemaType } from './avro/avro-schema';
import * as fs from 'fs';
import * as path from 'path';

export const clone = <T>(obj: T) => JSON.parse(JSON.stringify(obj)) as T;

/**
 * Get all AVSC files in a folder
 *
 * @param {string} folder
 * @returns {string[]} All AVSC file names
 */
export const findAVSCFilesInFolder = (folder: string) => {
  folder = path.resolve(folder);
  return fs.statSync(folder).isFile()
    ? path.extname(folder).toLowerCase() === '.avsc' ? [folder] : []
    : fs.readdirSync(folder).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ext && (ext.toLowerCase() === '.avsc');
  }).map(f => path.join(folder, f));
};

/**
 * Check if the type is one of the primitive AVRO types.
 * @param schemaType Name of the type
 */
export const isPrimitiveAvroType = (schemaType: AvroSchemaType | AvroSchemaType[]) => {
  const primitiveTypes = ['null', 'boolean', 'int', 'long', 'float', 'double', 'string', 'bytes'];
  return typeof schemaType === 'string' && primitiveTypes.indexOf(schemaType.toLowerCase()) >= 0;
};

/**
 * Check if the type is one of the complex AVRO types.
 * @param schemaType Name of the type
 */
export const isComplexAvroType = (schemaType: AvroSchemaType | AvroSchemaType[]) => {
  const complexTypes = ['record', 'enum', 'array', 'map', 'union', 'fixed'];
  return typeof schemaType === 'string' && complexTypes.indexOf(schemaType.toLowerCase()) >= 0;
};
