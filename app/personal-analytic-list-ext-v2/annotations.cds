using PersonalService as service from '../../srv/personal-service';


annotate service.PerPersonal with @(UI : {
    LineItem                                    : [
        {Value : PersonalId},
        {Value : FirstName},
        {Value : LastName}
    ],
    SelectionFields                             : [Gender],
    HeaderInfo                                  : {
        TypeName       : '{i18n>Message}',
        TypeNamePlural : '{i18n>Messages}',
        Title          : {Value : FirstName},
        Description    : {Value : LastName}
    },
    PresentationVariant                         : {
        Visualizations : ['@UI.Chart#PersonsByGender', ],
        SortOrder      : [{
            $Type    : 'Common.SortOrderType',
            Property : Gender,
        }, ],
    },
    PresentationVariant #PersonsByGender        : {
        Visualizations : ['@UI.Chart#PersonsByGender', ],
        SortOrder      : [{
            $Type    : 'Common.SortOrderType',
            Property : Gender,
        }, ],
    },
    PresentationVariant #PersonsByMaritalStatus : {Visualizations : ['@UI.Chart#PersonsByMaritalStatus', ], },
    PresentationVariant #PersonsByNationality   : {Visualizations : ['@UI.Chart#PersonsByNationality', ], },
    Chart #PersonsByGender                      : {
        ![@Common.Label]    : 'Persons by Gender',
        ChartType           : #Column,
        Dimensions          : [Gender],
        DimensionAttributes : [{
            Dimension : Gender,
            Role      : #Category
        }],
        Measures            : [NumberOfPersons],
        MeasureAttributes   : [{
            Measure : NumberOfPersons,
            Role    : #Axis1
        }]
    },
    Chart #PersonsByMaritalStatus               : {
        ![@Common.Label]    : 'Persons by Marital Status',
        ChartType           : #Column,
        Dimensions          : [MaritalStatus],
        DimensionAttributes : [{
            Dimension : MaritalStatus,
            Role      : #Category
        }],
        Measures            : [NumberOfPersons],
        MeasureAttributes   : [{
            Measure : NumberOfPersons,
            Role    : #Axis1
        }]
    },
    Chart #PersonsByNationality                 : {
        ![@Common.Label]    : 'Persons by Nationality',
        ChartType           : #Column,
        Dimensions          : [Nationality],
        DimensionAttributes : [{
            Dimension : Nationality,
            Role      : #Category
        }],
        Measures            : [NumberOfPersons],
        MeasureAttributes   : [{
            Measure : NumberOfPersons,
            Role    : #Axis1
        }]
    },
});

annotate service.PerPersonal with {
    @Common.ValueListWithFixedValues
    @Common.ValueList : {
        Label                        : 'Gender',
        CollectionPath               : 'PerPersonal',
        SearchSupported              : false,
        Parameters                   : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : Gender,
                ValueListProperty : Gender
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'Gender',
            }
        ],
        PresentationVariantQualifier : 'PersonsByGender',
    }
    Gender
};
