import { Criteria, Qualification } from "@app/domain";

export const filterUniqueQualifications = (criteria: Criteria[], allQualifications: Qualification[], category: String) => {
    const qualifications = allQualifications
        .filter(q => q.category === category)
        .map(q => q.id)
    const matches = criteria.filter(c => qualifications.includes(c.id))
    const points = matches.reduce(
        (accumulator, current) => accumulator + current.points,
        0,
    )
    return { matches, points }
}