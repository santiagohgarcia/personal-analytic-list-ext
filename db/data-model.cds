using {ECPersonalInformation} from './external/ECPersonalInformation.csn';

@cds.persistence : {
    table,
    skip : false
}
entity PerPersonal as projection on ECPersonalInformation.PerPersonal {
    key personIdExternal as PersonalId,
        firstName        as FirstName,
        lastName         as LastName,
        initials         as Initials,
        title            as PersonalTitle,
        gender           as Gender,
        maritalStatus    as MaritalStatus,
        nationality      as Nationality,
        null             as NumberOfPersons : Integer @(title : 'Number of Persons')
}
