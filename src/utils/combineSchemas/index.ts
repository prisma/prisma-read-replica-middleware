export default (schema: string, readReplicaSchema: string) => {
  return `${readReplicaSchema}\n\n${schema}`;
};
