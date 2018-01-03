import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
import * as npmPackage from '../package.json';
import { Parser } from './parser';

export interface ICommandOptions {
  schema: string;
  folder: string;
  help: boolean;
}

export class CommandLineInterface {
  static optionDefinitions: OptionDefinition[] = [{
    name: 'help',
    alias: 'h',
    type: Boolean,
    typeLabel: '[underline]{Boolean}',
    description: 'Show help text'
  }, {
    name: 'folder',
    alias: 'f',
    type: String,
    defaultValue: './schemas',
    typeLabel: '[underline]{String}',
    description: 'Folder or file with the referenced schema\'s'
  }, {
    name: 'schema',
    alias: 's',
    type: String,
    defaultOption: true,
    typeLabel: '[underline]{String}',
    description: 'The full name of the schema to parse/flatten by inlining all referenced schema\'s.'
  }];

  static sections = [
    {
      header: `${npmPackage.name}, v${npmPackage.version}`,
      content: `${npmPackage.license} license.

    ${npmPackage.description}

    The Kafka schema registry associates a schema ID with a topic. Therefore,
    the uploaded schema should not contain multiple definitions. On the other hand,
    creating a schema with all sub-schema's inline is also not very practical, e.g.
    you may have to add a schema twice if it can be a single or array element. This
    small tool simplifies the process by inlining all referenced schema's.

    Input is an existing schema that references other schema's.
    Output is a new schema, where all references are inlined.`
    },
    {
      header: 'Options',
      optionList: CommandLineInterface.optionDefinitions
    },
    {
      header: 'Examples',
      content: [{
        desc: '01. Create an alert.avsc from the cap.avsc schema.',
        example: '$ avro-schema-parser driver.eu.alert -f cap.avsc'
      }]
    }
  ];
}

const options: ICommandOptions = commandLineArgs(
  CommandLineInterface.optionDefinitions
);

if (options.help || !options.schema || !options.folder) {
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(0);
} else {
  const schemaParser = new Parser(options);
}
