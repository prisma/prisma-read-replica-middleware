import { getSchema, trimBlocksFromSchema } from "@prisma/sdk";
import { writeFile } from "fs";
import { execute } from "@getvim/execute";

import processCommand from ".";

jest.mock("fs", () => {
  return {
    writeFile: jest.fn(),
  };
});

jest.mock("@prisma/sdk", () => {
  return {
    getSchema: jest.fn(),
    trimBlocksFromSchema: jest.fn(() => {
      return {
        trim: jest.fn(),
      };
    }),
  };
});

jest.mock("@getvim/execute", () => {
  return {
    execute: jest.fn(() => {
      return {
        then: jest.fn,
      };
    }),
  };
});

test("processCommand requests schema from the schema path", async () => {
  const response = await processCommand(
    { schema: "1", readReplicaSchema: "2" },
    "3"
  );
  expect(getSchema).toBeCalledWith("1");
});

test("processCommand requests schema from the read replica schema path", async () => {
  const response = await processCommand(
    { schema: "1", readReplicaSchema: "2" },
    "3"
  );
  expect(getSchema).toBeCalledWith("2");
});

test("processCommand trims datasource and generator from original schema", async () => {
  const response = await processCommand(
    { schema: "1", readReplicaSchema: "2" },
    "3"
  );
  expect(trimBlocksFromSchema).toBeCalledWith(undefined, [
    "datasource",
    "generator",
  ]);
});

test("processCommand writes new file", async () => {
  const response = await processCommand(
    { schema: "1", readReplicaSchema: "2" },
    "3"
  );
  expect(writeFile).toBeCalled();
});

test("processCommand executes npx prisma generate with combined file path", async () => {
  const response = await processCommand(
    { schema: "1", readReplicaSchema: "2" },
    "3"
  );
  expect(execute).toBeCalledWith("npx prisma generate --schema 3");
});
