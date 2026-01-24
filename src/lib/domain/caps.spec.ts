import { VisaType } from '@lib/domain'
import { QualificationsSchema } from '@lib/domain/qualifications'
import {
  capGroups,
  getCapGroupPoints,
  isCapGroupMaxed,
  findCapGroupForPrompt,
  shouldSkipPrompt,
} from '@lib/domain/caps'

function createQualifications(
  visaType: VisaType,
  overrides: Record<string, unknown> = {},
) {
  return QualificationsSchema.parse({
    v: visaType,
    ...overrides,
  })
}

describe('getCapGroupPoints', () => {
  const engineerResearchCap = capGroups[VisaType.Engineer].find(
    g => g.id === 'research',
  )!

  it('returns 0 when no prompts answered', () => {
    const qualifications = createQualifications(VisaType.Engineer)
    const points = getCapGroupPoints(qualifications, engineerResearchCap)
    expect(points).toBe(0)
  })

  it('returns correct points for one answered prompt', () => {
    const qualifications = createQualifications(VisaType.Engineer, {
      patent_inventor: true,
    })
    const points = getCapGroupPoints(qualifications, engineerResearchCap)
    expect(points).toBe(15)
  })

  it('returns correct points for multiple answered prompts', () => {
    const qualifications = createQualifications(VisaType.Engineer, {
      patent_inventor: true,
      published_papers: true,
    })
    const points = getCapGroupPoints(qualifications, engineerResearchCap)
    expect(points).toBe(30)
  })

  it('ignores non-boolean values (undefined, false)', () => {
    const qualifications = createQualifications(VisaType.Engineer, {
      patent_inventor: undefined,
      published_papers: false,
      conducted_financed_projects: true,
    })
    const points = getCapGroupPoints(qualifications, engineerResearchCap)
    expect(points).toBe(15)
  })
})

describe('isCapGroupMaxed', () => {
  const engineerResearchCap = capGroups[VisaType.Engineer].find(
    g => g.id === 'research',
  )!

  it('returns false when points below cap', () => {
    const qualifications = createQualifications(VisaType.Engineer)
    expect(isCapGroupMaxed(qualifications, engineerResearchCap)).toBe(false)
  })

  it('returns true when points equal to cap', () => {
    const qualifications = createQualifications(VisaType.Engineer, {
      patent_inventor: true,
    })
    // Engineer research cap is 15, one prompt gives 15 points
    expect(isCapGroupMaxed(qualifications, engineerResearchCap)).toBe(true)
  })

  it('returns true when points exceed cap (edge case with multiple answers)', () => {
    const qualifications = createQualifications(VisaType.Engineer, {
      patent_inventor: true,
      published_papers: true,
    })
    // 30 points > 15 cap
    expect(isCapGroupMaxed(qualifications, engineerResearchCap)).toBe(true)
  })
})

describe('findCapGroupForPrompt', () => {
  it('finds research cap group for research prompts (Engineer)', () => {
    const capGroup = findCapGroupForPrompt('patent_inventor', VisaType.Engineer)
    expect(capGroup).toBeDefined()
    expect(capGroup!.id).toBe('research')
  })

  it('finds university cap group for university prompts', () => {
    const capGroup = findCapGroupForPrompt('uni_ranked', VisaType.Engineer)
    expect(capGroup).toBeDefined()
    expect(capGroup!.id).toBe('university_ranking')
  })

  it('returns undefined for prompts not in any cap group', () => {
    const capGroup = findCapGroupForPrompt(
      'some_other_prompt',
      VisaType.Engineer,
    )
    expect(capGroup).toBeUndefined()
  })

  it('returns correct cap group per visa type (different caps for Researcher vs Engineer)', () => {
    const engineerCap = findCapGroupForPrompt(
      'patent_inventor',
      VisaType.Engineer,
    )
    const researcherCap = findCapGroupForPrompt(
      'patent_inventor',
      VisaType.Researcher,
    )

    expect(engineerCap!.cap).toBe(15)
    expect(engineerCap!.pointsPerPrompt).toBe(15)

    expect(researcherCap!.cap).toBe(25)
    expect(researcherCap!.pointsPerPrompt).toBe(20)
  })
})

describe('shouldSkipPrompt', () => {
  it('returns false for prompts not in any cap group', () => {
    const qualifications = createQualifications(VisaType.Engineer)
    expect(
      shouldSkipPrompt('some_other_prompt', VisaType.Engineer, qualifications),
    ).toBe(false)
  })

  it('returns false when cap group not maxed', () => {
    const qualifications = createQualifications(VisaType.Engineer)
    expect(
      shouldSkipPrompt('patent_inventor', VisaType.Engineer, qualifications),
    ).toBe(false)
  })

  it('returns true when cap group is maxed and prompt not answered', () => {
    const qualifications = createQualifications(VisaType.Engineer, {
      patent_inventor: true,
    })
    // Cap is maxed (15/15), published_papers not answered
    expect(
      shouldSkipPrompt('published_papers', VisaType.Engineer, qualifications),
    ).toBe(true)
  })

  it('returns false when prompt itself was answered "yes" (contributed to cap)', () => {
    const qualifications = createQualifications(VisaType.Engineer, {
      patent_inventor: true,
    })
    // patent_inventor contributed to maxing the cap, so don't skip it
    expect(
      shouldSkipPrompt('patent_inventor', VisaType.Engineer, qualifications),
    ).toBe(false)
  })

  describe('Engineer research cap', () => {
    it('1 "yes" → other 3 research prompts skipped', () => {
      const qualifications = createQualifications(VisaType.Engineer, {
        patent_inventor: true,
      })

      // patent_inventor answered yes - should NOT be skipped
      expect(
        shouldSkipPrompt('patent_inventor', VisaType.Engineer, qualifications),
      ).toBe(false)

      // Other 3 research prompts should be skipped
      expect(
        shouldSkipPrompt(
          'conducted_financed_projects',
          VisaType.Engineer,
          qualifications,
        ),
      ).toBe(true)
      expect(
        shouldSkipPrompt('published_papers', VisaType.Engineer, qualifications),
      ).toBe(true)
      expect(
        shouldSkipPrompt(
          'recognized_research',
          VisaType.Engineer,
          qualifications,
        ),
      ).toBe(true)
    })
  })

  describe('Researcher research cap', () => {
    it('1 "yes" → not skipped (cap=25, points=20)', () => {
      const qualifications = createQualifications(VisaType.Researcher, {
        patent_inventor: true,
      })

      // 20 points < 25 cap, nothing should be skipped
      expect(
        shouldSkipPrompt(
          'conducted_financed_projects',
          VisaType.Researcher,
          qualifications,
        ),
      ).toBe(false)
      expect(
        shouldSkipPrompt(
          'published_papers',
          VisaType.Researcher,
          qualifications,
        ),
      ).toBe(false)
    })

    it('2 "yes" → other prompts skipped', () => {
      const qualifications = createQualifications(VisaType.Researcher, {
        patent_inventor: true,
        published_papers: true,
      })

      // 40 points >= 25 cap, unanswered prompts should be skipped
      expect(
        shouldSkipPrompt(
          'conducted_financed_projects',
          VisaType.Researcher,
          qualifications,
        ),
      ).toBe(true)
      expect(
        shouldSkipPrompt(
          'recognized_research',
          VisaType.Researcher,
          qualifications,
        ),
      ).toBe(true)

      // Answered prompts should NOT be skipped
      expect(
        shouldSkipPrompt(
          'patent_inventor',
          VisaType.Researcher,
          qualifications,
        ),
      ).toBe(false)
      expect(
        shouldSkipPrompt(
          'published_papers',
          VisaType.Researcher,
          qualifications,
        ),
      ).toBe(false)
    })
  })

  describe('University ranking cap', () => {
    it('1 "yes" → other 2 university prompts skipped (all visa types)', () => {
      const visaTypes = [
        VisaType.Engineer,
        VisaType.Researcher,
        VisaType.BusinessManager,
      ]

      for (const visaType of visaTypes) {
        const qualifications = createQualifications(visaType, {
          uni_ranked: true,
        })

        // uni_ranked answered yes - should NOT be skipped
        expect(shouldSkipPrompt('uni_ranked', visaType, qualifications)).toBe(
          false,
        )

        // Other 2 university prompts should be skipped
        expect(shouldSkipPrompt('uni_funded', visaType, qualifications)).toBe(
          true,
        )
        expect(shouldSkipPrompt('uni_partner', visaType, qualifications)).toBe(
          true,
        )
      }
    })
  })
})
