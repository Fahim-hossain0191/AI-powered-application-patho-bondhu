import Link from "next/link";

const tiers = [
  ["Foundation", "NCTB concept clarity এবং formula fluency"],
  ["Problem Solving", "Pattern spotting, proof, factorization, graph thinking"],
  ["Challenge Set", "Timed mixed questions and explanation review"],
];

export default function OlympiadPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">Olympiad</p>
          <h1 className="mt-1 text-3xl font-black">Olympiad Preparation</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            এই section future Olympiad route-এর জন্য frontend-ready. Backend route না থাকায় এখন Math Tutor-এর concept/formula/practice flow-তে পাঠানো হচ্ছে।
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {tiers.map(([title, body]) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xl font-black">{title}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{body}</p>
            </div>
          ))}
        </div>
        <Link href="/math" className="mt-6 inline-block rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white">
          গণিত Tutor দিয়ে শুরু করো
        </Link>
      </section>
    </main>
  );
}
