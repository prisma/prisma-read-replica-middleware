import { Prisma, PrismaClient } from "./prisma/read-replica-client";

const prisma = new PrismaClient();

const lowercaseFirstLetter = (string: string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

/**
 *
 * @param modelsToExclude
 * @constructor
 *
 * Requirements:
 * 1. User must be able to exclude models from the read-replica
 * 2. The middleware must only intercept requests with models and find* actions
 * 3. The user must be able to provide a RR datasource
 * 4. The user must be able to provide a RR client provider
 */

const PrismaReadReplica = (modelsToExclude: string[] = []) => {
  const middleware = async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>
  ) => {
    const actionsToIntercept = ["find", "findMany", "findUnique"];

    if (params.model === undefined) {
      return await next(params);
    }

    const shouldIgnoreAction = actionsToIntercept.indexOf(params.action) < 0;

    if (shouldIgnoreAction) {
      return await next(params);
    }

    const shouldIgnoreModel = modelsToExclude.indexOf(params.model) > -1;

    if (shouldIgnoreModel) {
      return await next(params);
    }

    // We need to call next() or all subsequent middleware is skipped. See https://www.prisma.io/docs/concepts/components/prisma-client/middleware#running-order-and-the-middleware-stack
    await next(params);

    // @ts-ignore
    return prisma[lowercaseFirstLetter(params.model)][params.action](
      params.args
    );
  };

  return {
    middleware,
  };
};

export default PrismaReadReplica;
