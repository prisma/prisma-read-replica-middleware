export default (schema, readReplicaSchema) => {
    return `${readReplicaSchema}\n\n${schema}`
}