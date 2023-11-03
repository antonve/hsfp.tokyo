import { VisaProgress, SectionName, FormConfig } from '@lib/domain/form'
import { didCompleteSection } from '@lib/visa/prompts'


export function VisaProgressBar({
    progress,
    config
}: {
    progress: VisaProgress
    config: FormConfig
}) {
    const allSections: { [K in SectionName]: string } = {
        education: '20%',
        job: '40%',
        'research-achievements': '60%',
        licenses: '80%',
        bonus: '100%',
    };
    const matchSections = (progress: VisaProgress) => {
        if (allSections.hasOwnProperty(progress.section)) {
            const value = allSections[progress.section];
            return value
        }
    }
    return (
        < div className=" h-2 bg-gray-200 mx-auto" >
            <div style={{ width: `${matchSections(progress)}` }}
            >
                <div className={`h-2 bg-red-500 animate-progress`} />
            </div>
        </div >
    )
}
