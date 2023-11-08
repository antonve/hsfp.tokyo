import { test, expect } from '@playwright/experimental-ct-react';

import { VisaProgressBar } from '@components/VisaProgressBar';
import { FormConfig } from '@lib/domain/form'
import { VisaType } from '@lib/domain'
import { Qualifications } from '@lib/domain/qualifications'

test.use({ viewport: { width: 500, height: 500 } });

const config: FormConfig = {
    "visaType": VisaType.Engineer,
    "sections": {
        "education": [
            {
                "id": "degree",
                "type": "CHOICE",
                "options": [
                    "doctor",
                    "mba_mot",
                    "master",
                    "bachelor",
                    "none"
                ]
            },
            {
                "id": "dual_degree",
                "type": "BOOLEAN"
            }
        ],
        "job": [
            {
                "id": "experience",
                "type": "NUMBER"
            },
            {
                "id": "age",
                "type": "NUMBER"
            },
            {
                "id": "salary",
                "type": "NUMBER"
            }
        ],
        "research": [
            {
                "id": "patent_inventor",
                "type": "BOOLEAN"
            },
            {
                "id": "conducted_financed_projects",
                "type": "BOOLEAN"
            },
            {
                "id": "published_papers",
                "type": "BOOLEAN"
            },
            {
                "id": "recognized_research",
                "type": "BOOLEAN"
            }
        ],
        "employer": [
            {
                "id": "org_promotes_innovation",
                "type": "BOOLEAN"
            },
            {
                "id": "org_smb",
                "type": "BOOLEAN"
            },
            {
                "id": "org_promotes_highly_skilled",
                "type": "BOOLEAN"
            },
            {
                "id": "high_rnd_expenses",
                "type": "BOOLEAN"
            },
            {
                "id": "growth_field",
                "type": "BOOLEAN"
            }
        ],
        "university": [
            {
                "id": "certification",
                "type": "NUMBER"
            },
            {
                "id": "jp",
                "type": "CHOICE",
                "options": [
                    "jp_major",
                    "n1",
                    "n2",
                    "none"
                ]
            },
            {
                "id": "jp_uni_grad",
                "type": "BOOLEAN"
            },
            {
                "id": "uni_ranked",
                "type": "BOOLEAN"
            },
            {
                "id": "uni_funded",
                "type": "BOOLEAN"
            },
            {
                "id": "uni_partner",
                "type": "BOOLEAN"
            }
        ],
        "bonus": [
            {
                "id": "foreign_qualification",
                "type": "BOOLEAN"
            },
            {
                "id": "training_jica",
                "type": "BOOLEAN"
            },
            {
                "id": "investment_management",
                "type": "BOOLEAN"
            }
        ]
    },
    "order": [
        "education",
        "job",
        "research",
        "employer",
        "university",
        "bonus"
    ]
}

const qualifications: Qualifications = {
    "v": VisaType.Engineer,
    "completed": 0
}
test('should work', async ({ mount }) => {
    const component = await mount(<VisaProgressBar
        config={config} qualifications={qualifications}

    />);
    // progress bar should be at 0 length
    await expect(component).toBeVisible
    const progressBar = component.getByTestId('progress-bar')
    await expect(progressBar).toHaveCSS('width', '0px')

});