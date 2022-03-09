#!/usr/bin/env node
import yargs from 'yargs';
import { getInstalledPath } from "get-installed-path";

const installedPath = await getInstalledPath('prisma-read-replica', { local: true });
const schemaPath = `${installedPath}/prisma`
const copiedSchemaPath = `${schemaPath}/schema.prisma`
const copiedReadReplicaSchemaPath = `${schemaPath}/read-replica-schema.prisma`
const combinedReadReplicaSchemaPath = `${schemaPath}/combined-read-replica-schema.prisma`

yargs(process.argv.slice(2))
    .scriptName("prisma-read-replica")
    .usage('$0 <cmd> [args]')
    .command(
        'generate [schema] [readReplicaSchema]', 
        'Prisma Read Replica', 
        command, 
        processCommand.bind(undefined, copiedSchemaPath, copiedReadReplicaSchemaPath, combinedReadReplicaSchemaPath)
    )
    .demandOption('schema', 'Please provide a relative path to your Prisma Schema.')
    .demandOption('readReplicaSchema', 'Please provide a relative path to your read replica Prisma Schema.')
    .argv