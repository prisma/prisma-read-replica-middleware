import cliCommand from ".";

const yargsMock = {
  positional: jest.fn(),
};

test("cliCommand sets two positionals", () => {
  cliCommand(yargsMock);

  expect(yargsMock.positional).toBeCalledTimes(2);
});

test("cliCommand requires a schema path", () => {
  cliCommand(yargsMock);

  expect(yargsMock.positional).toBeCalledWith("schema", {
    describe: "Relative path to your Prisma schema",
    type: "string",
  });
});

test("cliCommand requires a read replica schema path", () => {
  cliCommand(yargsMock);

  expect(yargsMock.positional).toBeCalledWith("readReplicaSchema", {
    describe: "Relative path to your Prisma Read Replica schema",
    type: "string",
  });
});
