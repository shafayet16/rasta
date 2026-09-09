import Link from "next/link";

export const metadata = {
  title: "Refund Policy | RASTA",
  description: "RASTA Official Refund Policy",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white pt-28 sm:pt-36 pb-24 px-6 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-3xl">
        {/* BREADCRUMB / BACK LINK */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-[9px] sm:text-[10px] font-medium tracking-[0.25em] uppercase text-black/50 hover:text-black transition-colors"
          >
            ← BACK TO HOME
          </Link>
        </div>

        {/* HEADER */}
        <header className="border-b border-black/10 pb-6 mb-10">
          <h1 className="text-xl sm:text-2xl font-medium tracking-[0.2em] uppercase text-black">
            REFUND POLICY
          </h1>
          <p className="text-[10px] tracking-[0.2em] uppercase text-black/40 mt-2">
            LAST UPDATED: {new Date().getFullYear()}
          </p>
        </header>

        {/* CONTENT */}
        <div className="space-y-6 text-[11px] sm:text-[12px] leading-relaxed tracking-wide text-black/80 font-normal">
          <p className="text-base sm:text-lg text-black font-medium tracking-tight">
            RASTA does not offer refunds unless the product arrives damaged or defective.
          </p>

          <p>
            If you receive a damaged or defective product, please contact us within{" "}
            <span className="font-semibold text-black">2 days</span> of receiving your order and provide clear photos or videos of the issue.
          </p>

          <p>
            After we inspect and confirm the damage, we will process your refund through a payment method agreed upon with you.
          </p>

          <div className="border-l-2 border-black pl-4 py-1 text-black/90 font-medium">
            No refunds will be accepted after 2 days or for products damaged due to misuse.
          </div>
        </div>

        {/* FOOTER CTA */}
        <div className="mt-16 border-t border-black/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.15em] uppercase text-black/60">
            HAVE QUESTIONS REGARDING YOUR ORDER?
          </p>
          <a
            href="https://www.facebook.com/share/19TxA6JbSV/?mibextid=wwXIfr"
            target="_blank"
            rel="noreferrer"
            className="border border-black bg-black px-6 py-3 text-[10px] font-medium tracking-[0.25em] uppercase text-white transition-all hover:bg-transparent hover:text-black"
          >
            CONTACT SUPPORT
          </a>
        </div>
      </div>
    </main>
  );
}