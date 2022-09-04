using {ECPersonalInformation} from './external/ECPersonalInformation.csn';

service PersonalService {

    @readonly
    @cds.persistence : {
        table,
        skip: false
    }
    @Aggregation.ApplySupported.PropertyRestrictions   : true
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
            displayName as DisplayName,

            @Analytics.Dimension
            title as PersonalTitle,

            @Analytics.Dimension               
            gender as Gender,

            @Analytics.Dimension
            @Core.Computed
            '' as GenderDescr : String,

            @Analytics.Dimension
            maritalStatus as MaritalStatus,
            
            @Analytics.Dimension
            '' as MaritalStatusDescr : String,

            @Analytics.Dimension
            nationality as Nationality, 

            @Analytics.Dimension
            '' as DateOfBirth: Date,

            @Analytics.Dimension
            @Core.Computed
            '' as YearOfBirth : Integer,
            
            @Analytics.Measure
            @Core.Computed
            @Aggregation.default : #SUM
            1 as NumberOfPersons : Integer @Common.Label : 'Number of Persons'
    }



}
