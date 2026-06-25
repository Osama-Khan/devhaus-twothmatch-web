import Image from "next/image";

/** Marketing panel shown on the left of auth split layouts (desktop only). */
export function AuthSidePanel() {
  return (
    <aside className="relative bg-primary hidden min-h-svh w-1/2 shrink-0 overflow-hidden lg:block">
      <Image
        src="/img/auth_side.svg"
        alt=""
        fill
        priority
        className="object-contain object-center"
      />

      <div className="absolute flex flex-col items-center inset-x-0 bottom-0 bg-linear-to-t from-[#7a3fc4]/90 via-[#7a3fc4]/40 to-transparent px-10 pb-12 pt-24 text-center">
        <h2 className="max-w-md text-3xl font-extrabold leading-tight text-white">
          Find the best clinical/dental jobs near you
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/90">
          Connect with local clinics and dental hospitals to explore job
          opportunities
        </p>
      </div>
    </aside>
  );
}
