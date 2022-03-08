# Prisma Read Replica

## Installation

1. `npm i prisma-read-replica --save` (or local path)

## Usage

1. Create a new file adjacent to your `schema.prisma` called `read-replica-schema.prisma`.
2. Inside `read-replica-schema.prisma` add _only_ `generator` and `datasource` blocks.
3. In the `generator` block, set `output` to `read-replica-client`.
4. In the `datasource` block, add the URL of your read replica database.
5. Wherever you instantiate Prisma using `new PrismaClient()`, instantiate `PrismaReadReplica` and apply it with `$use`. For example:
```
import { Prisma, PrismaClient } from '@prisma/client'
import PrismaReadReplica from 'prisma-read-replica';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const modelsToExclude = ['user'];

const readReplica = PrismaReadReplica(modelsToExclude);

prisma.$use(readReplica.middleware);

```

## Limitations

1. This middleware does not perform migrations against a read replica database.
2. This middleware does not account for custom providers.