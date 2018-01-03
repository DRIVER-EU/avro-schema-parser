"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commandLineArgs = require("command-line-args");
var npmPackage = require("../package.json");
var parser_1 = require("./parser");
var CommandLineInterface = (function () {
    function CommandLineInterface() {
    }
    CommandLineInterface.optionDefinitions = [{
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
    CommandLineInterface.sections = [
        {
            header: npmPackage.name + ", v" + npmPackage.version,
            content: npmPackage.license + " license.\n\n    " + npmPackage.description + "\n\n    The Kafka schema registry associates a schema ID with a topic. Therefore,\n    the uploaded schema should not contain multiple definitions. On the other hand,\n    creating a schema with all sub-schema's inline is also not very practical, e.g.\n    you may have to add a schema twice if it can be a single or array element. This\n    small tool simplifies the process by inlining all referenced schema's.\n\n    Input is an existing schema that references other schema's.\n    Output is a new schema, where all references are inlined."
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
    return CommandLineInterface;
}());
exports.CommandLineInterface = CommandLineInterface;
var options = commandLineArgs(CommandLineInterface.optionDefinitions);
if (options.help || !options.schema || !options.folder) {
    var getUsage = require('command-line-usage');
    var usage = getUsage(CommandLineInterface.sections);
    console.log(usage);
    process.exit(0);
}
else {
    var schemaParser = new parser_1.Parser(options);
}
//# sourceMappingURL=cli.js.map