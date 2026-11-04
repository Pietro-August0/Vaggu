/** Exibe o memorial independente dentro da navegação pública da VAGGU. */
export function MemorialPage() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <iframe
        className="block h-dvh min-h-screen w-full border-0"
        src="/memorial/index.html"
        title="Memorial da equipe VAGGU"
      />
    </main>
  )
}
