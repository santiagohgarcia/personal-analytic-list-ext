using PersonalService as service from '../../srv/personal-service';

annotate service.PerPersonal with @(UI : {
    LineItem                                                  : [
        {Value : PersonalId},
        {Value : FirstName},
        {Value : LastName}
    ],
    SelectionFields                                           : [Gender],
    HeaderInfo                                                : {
        TypeName       : '{i18n>Message}',
        TypeNamePlural : '{i18n>Messages}',
        Title          : {Value : FirstName},
        Description    : {Value : LastName}
    },
    PresentationVariant #PersonalByGender : {
        Text           : 'Filter: Number of Personal by Gender',
        // SortOrder      : [{
        //     $Type      : 'Common.SortOrderType',
        //     Property   : NumberOfPersons,
        //     Descending : true
        // }, ],
        Visualizations : ['@UI.Chart#PersonalByGender']
    },
    PresentationVariant #PersonsByMaritalStatus               : {Visualizations : ['@UI.Chart#PersonsByMaritalStatus', ], },
    PresentationVariant #PersonsByNationality                 : {Visualizations : ['@UI.Chart#PersonsByNationality', ], },
    Chart #PersonalByGender                                    : {
        $Type               : 'UI.ChartDefinitionType',
        Title               : 'Personal by Gender',
        Description         : 'Personal by Gender',
        ChartType           : #Bar,
        Dimensions          : [Gender],
        DimensionAttributes : [{
            $Type     : 'UI.ChartDimensionAttributeType',
            Dimension : Gender,
            Role      : #Category
        }],
        Measures            : [NumberOfPersonsMeasure],
        MeasureAttributes   : [{
            $Type     : 'UI.ChartMeasureAttributeType',
            Measure   : NumberOfPersonsMeasure,
            Role      : #Axis1,
            DataPoint : '@UI.DataPoint#NumberOfPersonsMeasure'
        }]
    },
    DataPoint #NumberOfPersonsMeasure                                : {
        $Type : 'UI.DataPointType',
        Value : NumberOfPersons,
    },
    Chart #PersonsByMaritalStatus                             : {
        ![@Common.Label]    : 'Persons by Marital Status',
        ChartType           : #Column,
        Dimensions          : [MaritalStatus],
        DimensionAttributes : [{
            Dimension : MaritalStatus,
            Role      : #Category
        }],
        Measures            : [NumberOfPersonsMeasure],
        MeasureAttributes   : [{
            Measure : NumberOfPersonsMeasure,
            Role    : #Axis1
        }]
    },
    Chart #PersonsByNationality                               : {
        ![@Common.Label]    : 'Persons by Nationality',
        ChartType           : #Column,
        Dimensions          : [Nationality],
        DimensionAttributes : [{
            Dimension : Nationality,
            Role      : #Category
        }],
        Measures            : [NumberOfPersonsMeasure],
        MeasureAttributes   : [{
            Measure : NumberOfPersonsMeasure,
            Role    : #Axis1
        }]
    },
});

annotate service.PerPersonal with {
    @Common.ValueList #VisualFilter : {
        Label                        : 'Gender',
        CollectionPath               : 'PerPersonal',
        SearchSupported              : false,
        Parameters                   : [{
            $Type             : 'Common.ValueListParameterInOut',
            LocalDataProperty : Gender,
            ValueListProperty : Gender
        }],
        PresentationVariantQualifier : 'PersonalByGender',
        //DistinctValuesSupported : true,
    }
    @Common.ValueListWithFixedValues
    Gender
};
