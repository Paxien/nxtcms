import Image from 'next/image'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <main className="flex flex-1 items-center justify-center px-8 py-20 sm:px-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm sm:text-left">
          <li className="mb-2">
            Get started by editing{' '}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">
              src/app/page.tsx
            </code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            as="a"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-transparent bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            <Image
              className="mr-2 dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </Button>

          <Button
            as="a"
            variant="outline"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-black/[.08] hover:bg-[#f2f2f2] sm:min-w-44 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Read our docs
          </Button>
        </div>
      </div>
    </main>
  )
}
