import ncpPkg from 'ncp';
const { ncp } = ncpPkg;

export default async (
    copySchemaFromPath: string, 
    copyReadReplicaSchemaFromPath: string, 
    copiedSchemaPath: string, 
    copiedReadReplicaSchemaPath: string
) => {
    ncp(`${process.cwd()}${copySchemaFromPath}`, copiedSchemaPath, function (err) {
        if (err) {
            console.log(err);
            throw new Error('Copying schema failed.');
        }

        console.log(`Copied schema to ${copiedSchemaPath}`);
    });

    ncp(`${process.cwd()}${copyReadReplicaSchemaFromPath}`, copiedReadReplicaSchemaPath, function (err) {
        if (err) {
            console.log(err);
            throw new Error('Copying read replica schema failed.');
        }

        console.log(`Copied read replica schema to ${copiedReadReplicaSchemaPath}`);
    });
}