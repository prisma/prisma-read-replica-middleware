import fs from 'fs';
import { getSchema, trimBlocksFromSchema } from "@prisma/sdk";
import copySchemas from "./copySchemas";
import combineSchemas from "./combineSchemas";
import { execute } from "@getvim/execute";

export default async (
    argv: { schema: string, readReplicaSchema: string },  
    copiedSchemaPath: string, 
    copiedReadReplicaSchemaPath: string,
    combinedReadReplicaSchemaPath: string
) => {
    await copySchemas(argv.schema, argv.readReplicaSchema, copiedSchemaPath, copiedReadReplicaSchemaPath);

    const copiedSchema = await getSchema(copiedSchemaPath);
    const readReplicaSchema = await getSchema(copiedReadReplicaSchemaPath);
    const trimmedSchema = trimBlocksFromSchema(copiedSchema, ['datasource', 'generator']).trim();

    fs.writeFile(combinedReadReplicaSchemaPath, combineSchemas(trimmedSchema, readReplicaSchema), err => {
        if (err) {
            console.error(err)
            return
        }
    })

    await execute(`npx prisma generate --schema ${combinedReadReplicaSchemaPath}`)
        .then(console.log);
}