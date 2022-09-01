using {ECPersonalInformation} from './external/ECPersonalInformation.csn';

service PersonalService {

    @readonly
    @cds.persistence : {
        table,
        skip: false
    }
    @Aggregation.ApplySupported.PropertyRestrictions   : true
    @Aggregation.ApplySupported.Transformations        : [
        'aggregate',
        'topcount',
        'bottomcount',
        'identity',
        'concat',
        'groupby',
        'filter',
        'expand',
        'top',
        'skip',
        'orderby',
        'search',
        'sum'
    ]
    @Aggregation.ApplySupported.GroupableProperties    : [
        FirstName,
        LastName,
        Gender,
        Initials,
        MaritalStatus,
        Nationality
    ]
    @Aggregation.ApplySupported.AggregatableProperties : [{
        $Type                        : 'Aggregation.AggregatablePropertyType',
        RecommendedAggregationMethod : 'sum',
        SupportedAggregationMethods  : ['sum'],
        Property                     : NumberOfPersons,
        ![@Common.Label]             : 'Number of Persons',
    }, ]
    @Analytics.AggregatedProperties                    : [{
        Name                 : 'NumberOfPersonsMeasure',
        AggregationMethod    : 'sum',
        AggregatableProperty : 'NumberOfPersons',
        ![@Common.Label]     : 'Number of Persons',
    }]
    entity PerPersonal as select from ECPersonalInformation.PerPersonal {
            @Analytics.Dimension
        key personIdExternal as PersonalId,
            @Analytics.Dimension
            firstName as FirstName,
            @Analytics.Dimension
            lastName as LastName,
            @Analytics.Dimension
            initials as Initials,
            @Analytics.Dimension
            title as PersonalTitle,
            @Analytics.Dimension
            gender as Gender,
            @Analytics.Dimension
            maritalStatus as MaritalStatus,
            @Analytics.Dimension
            nationality as Nationality,
            @Analytics.Measure
            1 as NumberOfPersons : Integer
    }

}
