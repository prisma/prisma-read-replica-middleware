# Prisma Read Replica Middleware

## Installation

1. `npm i prisma-read-replica-middleware --save`

## Usage

1. Create a new file adjacent to your `schema.prisma` called `read-replica-schema.prisma`.
2. Inside `read-replica-schema.prisma` add _only_ `generator` and `datasource` blocks.
3. In the `generator` block, set `output` to `read-replica-client`.
4. In the `datasource` block, add the URL of your read replica database.
5. As part of your build process locally and in all environments, run `prisma-read-replica generate` to generate the Read Replica client.
6. Wherever you instantiate Prisma using `new PrismaClient()`, instantiate `PrismaReadReplica` and apply it with `$use`. For example:

```
import { Prisma, PrismaClient } from '@prisma/client'
import PrismaReadReplicaMiddleware from 'prisma-read-replica';

const modelsToExclude = ['User'];

prisma.$use(PrismaReadReplicaMiddleware(modelsToExclude));
```

## Limitations

1. This middleware does not perform migrations against a read replica database.
2. This middleware only intercepts the following actions: find, findMany, findUnique
3. This middleware does not account for custom providers.
4. This middleware does not account for nested reads. In the following example the request will _not_ be sent to the Read Replica because `User` is an excluded model.

```
import { Prisma, PrismaClient } from '@prisma/client'
import PrismaReadReplicaMiddleware from 'prisma-read-replica';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const modelsToExclude = ['User'];

prisma.$use(PrismaReadReplicaMiddleware(modelsToExclude));

const getUsers = await prisma.user.findMany({
  where: {
    email: {
      contains: 'test',
    },
  },
  include: {
    post: true,
  },
})
```
