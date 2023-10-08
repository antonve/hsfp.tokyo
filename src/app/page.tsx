import Link from 'next/link'

export default function Page() {
  return (
    <>
      <header className="py-6 px-4 flex justify-between space-x-8">
        <h1 className="font-bold font-sans">
          <span className="text-red-500 text-2xl">HSFP</span>
          <span className="text-white/40">.</span>
          <span className="text-gray-50">tokyo</span>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/start">Points calculator</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>
      </header>

      <div>
        <Link href="/calculator/researcher">
          Start research point calculation
        </Link>
        <br />
        <Link href="/calculator/engineer">
          Start engineer point calculation
        </Link>
        <br />
        <Link href="/calculator/business-manager">
          Start business manager point calculation
        </Link>
      </div>
    </>
  )
}
