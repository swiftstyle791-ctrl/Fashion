import { useState } from "react";
import { Scissors, Ruler, Users, Wallet, Sparkles, ArrowRight, ArrowLeft, X } from "lucide-react";

/**
 * StyleSwift onboarding tour — dependency-free (no react-joyride/intro.js needed).
 * Drop this component into your app and render it once, on first login,
 * behind a "hasSeenTour" flag in local state / your backend.
 *
 * HOW TO WIRE IT INTO YOUR REAL APP:
 * 1. Give each dashboard element you want to spotlight a matching id,
 *    e.g. <div id="tour-clients"> ... </div>
 * 2. Replace the `targetId` values below with your real element ids.
 * 3. This demo fakes a dashboard behind the tour so you can see it standalone —
 *    delete the <DemoDashboard /> and mount <OnboardingTour /> over your real one.
 */

const STEPS = [
  {
    icon: Sparkles,
    targetId: "tour-welcome",
    title: "Welcome to StyleSwift",
    body: "Your whole workshop — clients, measurements, and orders — in one place. Let's take a 30-second look around.",
  },
  {
    icon: Users,
    targetId: "tour-clients",
    title: "Every client, saved for good",
    body: "Add a client once. Their measurements and order history are there the next time they walk in — no notebook required.",
  },
  {
    icon: Ruler,
    targetId: "tour-orders",
    title: "Track orders start to finish",
    body: "See what's cut, what's sewn, and what's ready for pickup, at a glance.",
  },
  {
    icon: Wallet,
    targetId: "tour-payments",
    title: "Know what you're owed",
    body: "Every balance in one list, so nothing gets forgotten between fittings.",
  },
  {
    icon: Scissors,
    targetId: "tour-done",
    title: "You're set",
    body: "That's the whole tour. Add your first client whenever you're ready.",
  },
];

function OnboardingTour({ onClose }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1F2421]/70 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-sm bg-[#FBF8F2] rounded-2xl shadow-2xl overflow-hidden border border-[#E4DCC9]">
        {/* Progress */}
        <div className="flex gap-1.5 px-6 pt-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-[#A9752E]" : "bg-[#E4DCC9]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          aria-label="Close tour"
          className="absolute top-4 right-4 text-[#8B8375] hover:text-[#1F2421] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-5 pb-6">
          <div className="w-11 h-11 rounded-xl bg-[#1F2421] flex items-center justify-center mb-4">
            <Icon size={20} className="text-[#D9C9A3]" />
          </div>

          <h3 className="text-lg font-semibold text-[#1F2421] mb-1.5 leading-snug">
            {current.title}
          </h3>
          <p className="text-sm text-[#5A5548] leading-relaxed">
            {current.body}
          </p>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={isFirst}
              className={`flex items-center gap-1 text-sm font-medium transition-opacity ${
                isFirst ? "opacity-0 pointer-events-none" : "text-[#5A5548] hover:text-[#1F2421]"
              }`}
            >
              <ArrowLeft size={14} /> Back
            </button>

            <button
              onClick={() => (isLast ? onClose() : setStep((s) => s + 1))}
              className="flex items-center gap-1.5 bg-[#1F2421] text-[#FBF8F2] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#2C3330] transition-colors"
            >
              {isLast ? "Get started" : "Next"} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoDashboard() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] p-6">
      <div id="tour-welcome" className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2421]">Dashboard</h1>
        <p className="text-sm text-[#8B8375]">Tuesday, September 15</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div id="tour-clients" className="bg-white rounded-xl p-5 border border-[#E4DCC9]">
          <Users size={18} className="text-[#A9752E] mb-2" />
          <p className="text-sm font-medium text-[#1F2421]">Clients</p>
          <p className="text-2xl font-semibold text-[#1F2421] mt-1">0</p>
        </div>
        <div id="tour-orders" className="bg-white rounded-xl p-5 border border-[#E4DCC9]">
          <Ruler size={18} className="text-[#A9752E] mb-2" />
          <p className="text-sm font-medium text-[#1F2421]">Active orders</p>
          <p className="text-2xl font-semibold text-[#1F2421] mt-1">0</p>
        </div>
        <div id="tour-payments" className="bg-white rounded-xl p-5 border border-[#E4DCC9]">
          <Wallet size={18} className="text-[#A9752E] mb-2" />
          <p className="text-sm font-medium text-[#1F2421]">Owed to you</p>
          <p className="text-2xl font-semibold text-[#1F2421] mt-1">GH₵0</p>
        </div>
      </div>

      <div id="tour-done" className="mt-6 bg-white rounded-xl p-5 border border-[#E4DCC9] border-dashed text-center text-sm text-[#8B8375]">
        Add your first client to get started
      </div>
    </div>
  );
}

export default function App() {
  const [showTour, setShowTour] = useState(true);

  return (
    <div className="relative">
      <DemoDashboard />
      {showTour && <OnboardingTour onClose={() => setShowTour(false)} />}
    </div>
  );
}
