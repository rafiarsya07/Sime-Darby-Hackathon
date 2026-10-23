import { Logo } from "@/components/Logo";
import { LinkButton } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-start justify-center px-6">
      <Logo />
      <h1 className="mt-10 text-[28px] font-semibold tracking-[-0.02em]">This page took a wrong turn.</h1>
      <p className="mt-2 text-[16px] text-ink-2">It might have been moved, or the link was mistyped.</p>
      <LinkButton href="/" className="mt-8">Back to TownLoop</LinkButton>
    </main>
  );
}
