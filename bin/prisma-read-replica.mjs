#!/usr/bin/env node
import yargs from 'yargs';
import ncpPkg from 'ncp';
import { getInstalledPath } from "get-installed-path";
import { execute } from "@getvim/execute";
import { getSchema, trimBlocksFromSchema } from "@prisma/sdk";
import fs from 'fs'

const { ncp } = ncpPkg;
const installedPath = await getInstalledPath('prisma-read-replica', { local: true });
const schemaPath = `${installedPath}/prisma`
const copiedSchemaPath = `${schemaPath}/schema.prisma`
const copiedReadReplicaSchemaPath = `${schemaPath}/read-replica-schema.prisma`
const combinedReadReplicaSchemaPath = `${schemaPath}/combined-read-replica-schema.prisma`

const copySchemas = async (copySchemaFromPath, copyReadReplicaSchemaFromPath) => {
    ncp(`${process.cwd()}${copySchemaFromPath}`, copiedSchemaPath, function (err) {
        if (err) {
            console.log(err);
            throw new Error('Copying schema failed.');
        }

        console.log(`Copied schema to ${copiedSchemaPath}`);
    });

    ncp(`${process.cwd()}${copyReadReplicaSchemaFromPath}`, copiedReadReplicaSchemaPath, function (err) {
        if (err) {
            console.log(err);
            throw new Error('Copying read replica schema failed.');
        }

        console.log(`Copied read replica schema to ${copiedReadReplicaSchemaPath}`);
    });
}

const combineSchemas = (schema, readReplicaSchema) => {
    return `${readReplicaSchema}\n\n${schema}`
} 

yargs(process.argv.slice(2))
    .scriptName("prisma-read-replica")
    .usage('$0 <cmd> [args]')
    .command('generate [schema] [readReplicaSchema]', 'Prisma Read Replica', (yargs) => {
        yargs.positional('schema', {
            type: 'string',
            describe: 'Relative path to your Prisma schema'
        });

        yargs.positional('readReplicaSchema', {
            type: 'string',
            describe: 'Relative path to your Prisma Read Replica schema'
        })
    }, async function (argv) {
        await copySchemas(argv.schema, argv.readReplicaSchema);

        const copiedSchema = await getSchema(copiedSchemaPath);
        const readReplicaSchema = await getSchema(copiedReadReplicaSchemaPath);
        const trimmedSchema = trimBlocksFromSchema(copiedSchema, ['datasource', 'generator']).trim();
        const combinedSchema = combineSchemas(trimmedSchema, readReplicaSchema);

        fs.writeFile(combinedReadReplicaSchemaPath, combineSchemas(trimmedSchema, readReplicaSchema), err => {
            if (err) {
                console.error(err)
                return
            }
        })

        await execute(`npx prisma generate --schema ${combinedReadReplicaSchemaPath}`)
            .then(console.log);
    })
    .demand(['schema', 'readReplicaSchema'], 'Please provide relative paths to your schema and readReplicaSchema.')
    .argv

/**
 * Limitations:
 * 1. Does not work with custom providers 
 */