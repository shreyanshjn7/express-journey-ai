import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { tripDateLabel, type Trip } from "@/lib/trip";

const steps = ["Search", "Choose train", "Passengers", "Pay"];

/** Light-theme frame for post-search screens: header, trip summary, 4-step progress, sticky mobile bar. */
export function BookingShell({ step, trip, back, children, bar }: {
  step: 1 | 2 | 3;
  trip: Trip;
  back?: ReactNode;
  children: ReactNode;
  bar?: ReactNode;
}) {
  return (
    <div className="flow-app">
      <header className="flow-header">
        <Link to="/" className="flow-wordmark" aria-label="Rail Daddy home">RAIL <span>DADDY</span>.</Link>
        <p className="flow-trip"><strong>{trip.from}</strong><ArrowRight size={14} aria-hidden="true" /><strong>{trip.to}</strong><span>· {tripDateLabel(trip.date)} · {trip.cls} · {trip.pax} pax</span></p>
      </header>
      <nav aria-label="Booking progress" className="flow-steps">
        <ol>
          {steps.map((label, i) => {
            const state = i < step ? "done" : i === step ? "current" : "todo";
            return (
              <li key={label} className={`flow-step ${state}`} aria-current={state === "current" ? "step" : undefined}>
                <span className="flow-dot">{state === "done" ? <Check size={14} aria-label="Completed" /> : i + 1}</span>
                <span className="flow-label">{label}</span>
              </li>
            );
          })}
        </ol>
      </nav>
      <main className="flow-main">
        {back && <div className="flow-back"><ChevronLeft size={16} aria-hidden="true" />{back}</div>}
        {children}
      </main>
      {bar && <div className="flow-bar">{bar}</div>}
    </div>
  );
}

export function FareBar({ total, note, action }: { total: string; note: string; action: ReactNode }) {
  return (
    <div className="fare-bar-inner">
      <div><span className="fare-bar-note">{note}</span><strong className="fare-bar-total">{total}</strong></div>
      {action}
    </div>
  );
}
