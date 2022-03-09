import PrismaReadReplica from ".";

test("PrismaReadReplica returns a middleware function", () => {
    expect(PrismaReadReplica()).toHaveProperty('middleware');
});

test("PrismaReadReplica calls next if the model is undefined", async () => {
    const nextMock = jest.fn();
    const middleware = PrismaReadReplica().middleware({ action: "count", args: '', dataPath: [], runInTransaction: false}, nextMock)

    expect(nextMock).toBeCalled();
});

test("PrismaReadReplica calls next if the action called should be ignored", async () => {
    const nextMock = jest.fn();
    const middleware = PrismaReadReplica().middleware({ action: "create", args: '', dataPath: [], runInTransaction: false}, nextMock)

    expect(nextMock).toBeCalled();
});