// This stub is necessary to allow tests to pass. It will be overwritten on `prisma-read-replica generate`
class PrismaClient {
    constructor() {}
}

namespace Prisma {
    export class MiddlewareParams {
        model?: any
        action: any
        args: any
        dataPath: any
        runInTransaction: any
    }
}

export {
    PrismaClient,
    Prisma
}