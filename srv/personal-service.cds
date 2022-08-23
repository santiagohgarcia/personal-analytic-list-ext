using {PerPersonal} from '../db/data-model';

service PersonalService {

    @readonly
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
        PersonalId,
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
    entity Personal as projection on PerPersonal {
            @Analytics.Dimension
        key PersonalId,
            @Analytics.Dimension
            FirstName,
            @Analytics.Dimension
            LastName,
            @Analytics.Dimension
            Initials,
            @Analytics.Dimension
            PersonalTitle,
            @Analytics.Dimension
            Gender,
            @Analytics.Dimension
            MaritalStatus,
            @Analytics.Dimension
            Nationality,
            @Analytics.Measure
            NumberOfPersons
    }

}
