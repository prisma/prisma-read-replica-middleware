import fs from "fs";
import { getSchema, trimBlocksFromSchema } from "@prisma/sdk";
import combineSchemas from "../combineSchemas";
import { execute } from "@getvim/execute";

export default async (
  argv: { schema: string; readReplicaSchema: string },
  combinedReadReplicaSchemaPath: string
) => {
  const { schema, readReplicaSchema } = argv;
  const schemaString = await getSchema(schema);
  const readReplicaSchemaString = await getSchema(readReplicaSchema);
  const trimmedSchema = trimBlocksFromSchema(schemaString, [
    "datasource",
    "generator",
  ]).trim();

  fs.writeFile(
    combinedReadReplicaSchemaPath,
    combineSchemas(trimmedSchema, readReplicaSchemaString),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );

  await execute(
    `npx prisma generate --schema ${combinedReadReplicaSchemaPath}`
  ).then(console.log);
};
