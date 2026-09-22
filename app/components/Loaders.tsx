"use client";

/* 1. PRODUCT DETAIL SKELETON (For individual product pages) */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white text-black animate-pulse">
      <main className="mx-auto max-w-[1600px] px-6 pt-28 pb-24 sm:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Gallery Skeleton */}
          <div className="flex flex-col items-center lg:col-span-7 w-full">
            <div className="aspect-[4/5] w-full max-w-[650px] bg-black/[0.04]" />
            <div className="mt-6 flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 w-16 bg-black/[0.04]" />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="flex flex-col max-w-md lg:col-span-5 lg:pt-4 w-full">
            <div className="h-4 w-3/4 bg-black/[0.08]" />
            <div className="mt-4 h-3 w-1/4 bg-black/[0.05]" />
            <div className="mt-12 border-t border-black/10 pt-8 flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-12 bg-black/[0.04]" />
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <div className="h-12 w-full bg-black/90" />
              <div className="h-12 w-full bg-black/[0.04]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* 2. CATALOG / COLLECTION LOADER (For shop or collection pages) */
export function CatalogLoadingState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-4">
        <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-black/60">
          INDEXING CATALOG
        </span>
        <div className="relative h-[1px] w-32 overflow-hidden bg-black/10">
          <div className="absolute inset-y-0 left-0 w-1/2 animate-[shimmer_1.5s_infinite] bg-black" />
        </div>
      </div>
    </div>
  );
}

/* 3. FULLSCREEN LOADER (For general page transitions or checkout) */
export function FullscreenPageLoader({ label = "INITIALIZING" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-white px-8 py-12 text-black selection:bg-none">
      <div className="w-full flex justify-between text-[9px] font-mono tracking-widest text-black/30 uppercase">
        <span>[ SYS.01 ]</span>
        <span>2026 // ED.</span>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="h-8 w-8 animate-spin rounded-full border-[1.5px] border-black/10 border-t-black" />
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-black">
            {label}
          </span>
          <span className="text-[9px] font-mono text-black/40 tracking-widest">
            PLEASE WAIT
          </span>
        </div>
      </div>

      <div className="w-full text-center text-[9px] font-mono tracking-widest text-black/30">
        ARCHIVE LOADING
      </div>
    </div>
  );
}