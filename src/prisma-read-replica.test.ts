import PrismaReadReplica from ".";

jest.mock("../prisma/read-replica-client", () => {
  return {
    PrismaClient: jest.fn(() => {
      return {
        user: {
          findMany: jest.fn(() => {
            return "function hit";
          }),
        },
      };
    }),
  };
});

test("PrismaReadReplica returns a middleware function", () => {
  expect(PrismaReadReplica()).toHaveProperty("middleware");
});

test("PrismaReadReplica calls next if the model is undefined", async () => {
  const nextMock = jest.fn();
  const middleware = PrismaReadReplica().middleware(
    { action: "count", args: "", dataPath: [], runInTransaction: false },
    nextMock
  );

  expect(nextMock).toBeCalled();
});

test("PrismaReadReplica calls next if the action called should be ignored", async () => {
  const nextMock = jest.fn();

  // @ts-ignore
  const middleware = PrismaReadReplica().middleware(
    {
      action: "create",
      model: "",
      args: "",
      dataPath: [],
      runInTransaction: false,
    },
    nextMock
  );

  expect(nextMock).toBeCalled();
});

test("PrismaReadReplica calls next if the model called should be ignored", async () => {
  const nextMock = jest.fn();

  // @ts-ignore
  const middleware = PrismaReadReplica(["User"]).middleware(
    {
      action: "find",
      model: "User",
      args: "",
      dataPath: [],
      runInTransaction: false,
    },
    nextMock
  );

  expect(nextMock).toBeCalled();
});

test("PrismaReadReplica calls new prisma client if other checks pass", async () => {
  const nextMock = jest.fn();

  // @ts-ignore
  const middleware = PrismaReadReplica(["User"]).middleware(
    {
      action: "find",
      model: "User",
      args: "",
      dataPath: [],
      runInTransaction: false,
    },
    nextMock
  );

  expect(nextMock).toBeCalled();
});

test("PrismaReadReplica calls new prisma client if other checks pass (and prisma client is generated)", async () => {
  const nextMock = jest.fn();

  // @ts-ignore
  const middleware = await PrismaReadReplica([]).middleware(
    {
      action: "findMany",
      model: "User",
      args: "",
      dataPath: [],
      runInTransaction: false,
    },
    nextMock
  );

  expect(middleware).toEqual("function hit");
});
