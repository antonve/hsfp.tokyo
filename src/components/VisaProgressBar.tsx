import { VisaProgress, SectionName } from '@lib/domain/form'

export function VisaProgressBar({
    progress,
}: {
    progress: VisaProgress
}) {
    console.log("hi mom", progress)
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
        < div className="relative h-100 w-2 bg-gray-200 mx-auto" >
            <div
                style={{ height: `${matchSections(progress)}` }}
            >
                <div className={`h-full w-full bg-red-500 animate-progress`} />
            </div>
        </div >
    )
}
