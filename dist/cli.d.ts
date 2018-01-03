/// <reference types="command-line-args" />
import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
export interface ICommandOptions {
    schema: string;
    folder: string;
    help: boolean;
}
export declare class CommandLineInterface {
    static optionDefinitions: OptionDefinition[];
    static sections: ({
        header: string;
        content: string;
    } | {
        header: string;
        optionList: commandLineArgs.OptionDefinition[];
    } | {
        header: string;
        content: {
            desc: string;
            example: string;
        }[];
    })[];
}
