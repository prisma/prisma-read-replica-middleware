import { should } from "@prisma/sdk/dist/logger";
//@ts-ignore
import { Prisma, PrismaClient } from "../prisma/read-replica-client";

const prisma = new PrismaClient();

const lowercaseFirstLetter = (string: string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

/**
 *
 * @param modelsToExclude
 * @constructor
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

    // We need to call next() first or all subsequent middleware is skipped. See https://www.prisma.io/docs/concepts/components/prisma-client/middleware#running-order-and-the-middleware-stack
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
