// Read TotalCount of Query
async function getTotalCount(tx, query) {
    //OData v2 total query
    const v2TotalCountQuery = query.clone().columns({
        func: "count",
        args: [
            {
                val: "1",
            },
        ],
        as: "$count",
    });
    const totalCountResult = await tx.run(v2TotalCountQuery);
    return totalCountResult[0] ? totalCountResult[0].$count : 0;
}

// Aggregator 
async function getAggregatedResults(entity, query, externalResults) {
    let groupByFields = [];
    //Insert records into SQLLITE to execute query using framework
    await DELETE.from(entity);
    await INSERT.into(entity).entries(externalResults);

    //TODO: groupby was not working completely, so we do it like this for now
    if (query.groupBy) {
        groupByFields = query.groupBy.map(groupByObject => groupByObject.ref[0]);
    }

    const aggrResults = await SELECT
        .from(entity)
        .columns(query.columns)
        .groupBy(...groupByFields)
        .limit(query.limit)
        .orderBy(query.orderBy);

    await DELETE.from(entity);
    
    return aggrResults;

}


module.exports = {
    getTotalCount,
    getAggregatedResults
}