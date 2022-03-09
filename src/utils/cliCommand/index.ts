export default (yargs: { positional: any }) => {
    yargs.positional('schema', {
        type: 'string',
        describe: 'Relative path to your Prisma schema'
    });

    yargs.positional('readReplicaSchema', {
        type: 'string',
        describe: 'Relative path to your Prisma Read Replica schema'
    })
}