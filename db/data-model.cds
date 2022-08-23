 using {ECPersonalInformation} from './external/ECPersonalInformation.csn';
 
 entity PerPersonal as projection on ECPersonalInformation.PerPersonal {
            @Analytics.Dimension
        key personIdExternal as PersonalId,
            @Analytics.Dimension
            firstName        as FirstName,
            @Analytics.Dimension
            lastName         as LastName,
            @Analytics.Dimension
            initials         as Initials,
            @Analytics.Dimension
            title            as PersonalTitle,
            @Analytics.Dimension
            gender           as Gender,
            @Analytics.Dimension
            maritalStatus    as MaritalStatus,
            @Analytics.Dimension
            nationality      as Nationality,
            @Analytics.Measure
            null             as NumberOfPersons : Integer @(title : 'Number of Persons')
    }