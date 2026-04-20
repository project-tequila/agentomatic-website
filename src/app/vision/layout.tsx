/**
 * Vision route uses the same marketing fonts as the static HTML (loaded in root `layout.tsx`).
 */
export default function VisionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#080C18] text-[#E8EDF8] antialiased [font-family:var(--font-marketing-dm),system-ui,sans-serif]">
      {children}
    </div>
  );
}
