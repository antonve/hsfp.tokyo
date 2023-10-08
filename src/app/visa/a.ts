import {
    CategoryVisaC,
    CriteriaMatcher,
    Criteria,
    CareerQualification,
    matchMaxPoints,
    AnnualSalaryQualification,
    AgeQualification,
    errorMessages,
    matchAny,
    LicensesQualification,
    mapById,
    CategoryVisaA,
} from '@app/domain'


export const QualificationIds = {
    AcademicBackground: {
        doctor: 'doctor',
        master: 'master',
        bachelor: 'bachelor',
        dualDegree: 'dual_degree',
    },
    Career: {
        salary: 'salary',
        experience: 'experience',
        age: 'age',
    },
}

export const matchersForVisaA: {
    [categroy in CategoryVisaA]: CriteriaMatcher
} = {
    ACADEMIC_BACKGROUND: {
        criteria: [
            { id: 'doctor', points: 30 },
            { id: 'master', points: 20 },
            { id: 'bachelor', points: 10 },
            { id: 'dual_degree', points: 5 },
        ],
        match: (criteria, allQualifications) => {
            const qualifications = allQualifications
                .filter(q => q.category === 'ACADEMIC_BACKGROUND')
                .map(q => q.id)

            const degrees = criteria.filter(c => qualifications.includes(c.id))
            const bonus = degrees.find(d => d.id === 'dual_degree')
            const [highestDegree] = degrees
                .filter(d => d.id != 'dual_degree')
                .sort((a, b) => b.points - a.points)

            let points = 0
            let matches: Criteria[] = []

            if (highestDegree) {
                points += highestDegree.points
                matches.push(highestDegree)
            }

            if (bonus) {
                points += bonus.points
                matches.push(bonus)
            }

            return { matches, points }
        }
    },
    CAREER: {
        criteria: [
            { id: '7_years_or_more', points: 15, match: exp => exp >= 7 },
            { id: '5_years_or_more', points: 10, match: exp => exp >= 5 },
            { id: '3_years_or_more', points: 5, match: exp => exp >= 3 },
        ],
        match: (criteria, qualifications) => {
            const match = qualifications.find(q => q.category === 'CAREER') as
                | CareerQualification
                | undefined
            const yearsOfExperience = match?.yearsOfExperience ?? 0

            return matchMaxPoints(criteria, yearsOfExperience)
        },
    },
    ANNUAL_SALARY: {
        criteria: [
            {
                id: '10m_or_more',
                points: 40,
                match: ({ salary }) => salary >= 10_000_000,
            },
            {
                id: '9m_or_more',
                points: 35,
                match: ({ salary }) => salary >= 9_000_000,
            },
            {
                id: '8m_or_more',
                points: 30,
                match: ({ salary }) => salary >= 8_000_000,
            },
            {
                id: '7m_or_more',
                points: 25,
                match: ({ salary, age }) => salary >= 7_000_000 && age < 40,
            },
            {
                id: '6m_or_more',
                points: 20,
                match: ({ salary, age }) => salary >= 6_000_000 && age < 40,
            },
            {
                id: '5m_or_more',
                points: 15,
                match: ({ salary, age }) => salary >= 5_000_000 && age < 35,
            },
            {
                id: '4m_or_more',
                points: 10,
                match: ({ salary, age }) => salary >= 4_000_000 && age < 30,
            },
        ],
        match: (criteria, qualifications) => {
            const matchSalary = qualifications.find(
                q => q.category === 'ANNUAL_SALARY',
            ) as AnnualSalaryQualification | undefined
            const matchAge = qualifications.find(q => q.category === 'AGE') as
                | AgeQualification
                | undefined

            if (matchSalary === undefined || matchAge == undefined) {
                return { matches: [], points: 0 }
            }

            const age = matchAge.age
            const salary = matchSalary.salary

            return matchMaxPoints(criteria, { salary, age })
        },
    },
    AGE: {
        criteria: [
            { id: 'less_than_30', points: 15, match: age => age < 30 },
            { id: 'less_than_35', points: 10, match: age => age < 35 },
            { id: 'less_than_40', points: 5, match: age => age < 40 },
        ],
        match: (criteria, qualifications) => {
            const match = qualifications.find(q => q.category === 'AGE') as
                | AgeQualification
                | undefined

            if (match === undefined) {
                return { matches: [], points: 0 }
            }

            const age = match.age
            return matchMaxPoints(criteria, age)
        },
    },
    RESEARCH_ACHIEVEMENTS: {
        criteria: [
            { id: 'patent_inventor', points: 20 },
            { id: 'conducted_financed_projects_three_times', points: 20 },
            { id: 'has_published_three_papers', points: 20 },
            { id: 'research_recognized_by_japan', points: 20 },
        ],
        match: (criteria, allQualifications) => {
            // if there are 2 or more then award 25 points
            let points = 0
            let matches: Criteria[] = []
            const qualifications = allQualifications.filter(
                q => q.category === 'RESEARCH_ACHIEVEMENTS',
            )
            // need to think about this a bit more.
            if (qualifications.length >= 2) {
                matches.push({
                    id: 'two_or_more_achievements',
                    points: 5
                })
            }
        }
    }

}