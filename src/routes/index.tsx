import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, type FormEvent, type MouseEvent } from "react";
import { ArrowDownUp, ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, MapPin, MessageCircle, TrainFront, X, Users, Minus, Plus } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import lightsImage from "@/assets/night-vista.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Rail Daddy — Find train routes & book tickets across India" },
    { name: "description", content: "Rail Daddy shows you available train routes and tickets: pick where from, where to, when, and your class." },
    { property: "og:title", content: "Rail Daddy — Find train routes & book tickets across India" },
    { property: "og:description", content: "Available train routes and tickets in one place: route, date, class and passengers." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [error, setError] = useState("");
  const [travelClass, setTravelClass] = useState("3A");
  const [passengers, setPassengers] = useState(2);
  const stageRef = useRef<HTMLElement>(null);
  function tilt(e: MouseEvent<HTMLElement>) {
    const el = stageRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", String((e.clientX - r.left) / r.width - .5));
    el.style.setProperty("--my", String((e.clientY - r.top) / r.height - .5));
  }
  const [dialog, setDialog] = useState<"journey" | "ai" | "about" | null>(null);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!source.trim() || !destination.trim() || !date) { setError("Choose your departure, destination and travel date."); return; }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) { setError("Choose a destination different from your departure."); return; }
    setError(""); setDialog("journey");
  }
  return (
    <div className="railway-app">
      <header className="site-header reveal" style={{ ["--d" as string]: "0ms" }}>
        <a href="/" className="wordmark" aria-label="Rail Daddy home"><span className="brand-icon"><TrainFront size={21} strokeWidth={2.5} /></span>rail<span className="wordmark-accent">daddy</span></a>
        <nav aria-label="Main navigation"><Button variant="nav" className="active" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Find a train</Button><Button variant="nav" onClick={() => setDialog("about")}>Why rail? <ArrowUpRight size={13} /></Button></nav>
        <Button variant="travel" onClick={() => setDialog("ai")}><span className="little-face"><span /><span /></span><span className="travel-copy"><span className="travel-kicker">No plan? No problem.</span><span className="travel-title">Ask Daddy AI <ArrowUpRight size={14} /></span></span></Button>
      </header>

      <main>
        <section ref={stageRef} onMouseMove={tilt} className="journey-stage" aria-label="Find your train">
          <div className="stage-parallax"><img src={lightsImage} width={1600} height={1200} alt="" aria-hidden="true" className="lights-backdrop" /></div>
          <div className="stage-shade" />

          <div className="hero-content">
            <div className="hero-eyebrow reveal" style={{ ["--d" as string]: "100ms" }}><span className="status-dot" /> YOUR ROUTE. YOUR SEAT.</div>
            <h1><span className="line"><span>REACH YOUR</span></span><span className="line accent"><span>DESTINATION.</span></span><span className="headline-star" aria-hidden="true">✳</span></h1>
            <p className="hero-copy reveal" style={{ ["--d" as string]: "400ms" }}>Available routes, dates and seats — sorted.<br />Daddy finds the train. You take the window seat.</p>
          </div>

          <div className="booking-area" id="booking">
            <div className="booking-intro reveal" style={{ ["--d" as string]: "550ms" }}><span><span className="mini-track" /> Start with the route. We'll find the trains.</span><span className="booking-step">01 <span>/ ROUTE BASICS</span></span></div>
            <form onSubmit={submit} className="booking-form">
              <div className="station-field source-field pop" style={{ ["--d" as string]: "620ms" }}><label htmlFor="source"><MapPin size={16} /> DEPARTING FROM</label><input id="source" list="stations" value={source} onChange={(event) => { setSource(event.target.value); setError(""); }} placeholder="Boarding station" autoComplete="off" /><span className="field-hint">Where the journey begins</span></div>
              <Button variant="swap" size="icon" type="button" aria-label="Swap start and destination" title="Swap start and destination" onClick={() => { setSource(destination); setDestination(source); }}><ArrowDownUp size={18} /></Button>
              <div className="station-field destination-field pop" style={{ ["--d" as string]: "700ms" }}><label htmlFor="destination"><MapPin size={16} /> ARRIVING AT</label><input id="destination" list="stations" value={destination} onChange={(event) => { setDestination(event.target.value); setError(""); }} placeholder="Destination station" autoComplete="off" /><span className="field-hint">Where you're headed</span></div>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}><PopoverTrigger asChild><Button variant="date" type="button" aria-label="Choose travel date" className="pop" style={{ ["--d" as string]: "780ms" }}><span className="field-label"><CalendarDays size={16} /> TRAVEL DATE</span><span className="date-value">{date ? format(date, "dd MMM, yyyy") : "Pick a date"}<ChevronDown size={18} /></span><span className="field-hint">Countdown begins now</span></Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="center"><Calendar mode="single" selected={date} onSelect={(value) => { setDate(value); setCalendarOpen(false); setError(""); }} disabled={{ before: startOfDay(new Date()) }} className="pointer-events-auto" /></PopoverContent></Popover>
              <datalist id="stations">{["New Delhi", "Mumbai Central", "Bengaluru", "Chennai Central", "Kolkata", "Jaipur", "Hyderabad", "Pune", "Ahmedabad", "Goa", "Varanasi", "Shimla"].map(station => <option key={station} value={station} />)}</datalist>
            </form>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="booking-controls reveal" style={{ ["--d" as string]: "870ms" }}>
              <div className="controls-panel">
                <span className="controls-label">Class:</span>
                <div className="vibe-chips" role="radiogroup" aria-label="Travel class">
                  {["SL", "3A", "2A", "1A"].map((name) => <button key={name} type="button" role="radio" aria-checked={travelClass === name} className={`vibe-chip ${travelClass === name ? "on" : ""}`} onClick={() => setTravelClass(name)}>{name}</button>)}
                </div>
                <span className="controls-divider" aria-hidden="true" />
                <div className="crew-stepper"><Users size={15} /><span>Passengers</span><button type="button" aria-label="Fewer passengers" onClick={() => setPassengers(c => Math.max(1, c - 1))}><Minus size={14} /></button><strong key={passengers}>{passengers}</strong><button type="button" aria-label="More passengers" onClick={() => setPassengers(c => Math.min(9, c + 1))}><Plus size={14} /></button></div>
              </div>
              <Button variant="journey" type="submit" className="pop" style={{ ["--d" as string]: "960ms" }}><span className="journey-copy"><span className="journey-title">Find my train</span><span className="search-subtitle">Routes + seats + fares</span></span><span className="journey-arrow"><ArrowUpRight size={20} /></span></Button>
            </div>
          </div>
        </section>
        <div className="route-marquee" aria-hidden="true"><div>{Array.from({ length: 2 }).map((_, k) => <span key={k}>DELHI ✳ JAIPUR ✳ GOA ✳ VARANASI ✳ SHIMLA ✳ MUMBAI ✳ KOCHI ✳ DARJEELING ✳ UDAIPUR ✳ </span>)}</div></div>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Rail Daddy. Trips worth the ride.</span><span>TAKE THE SCENIC ROUTE <ArrowUpRight size={13} /></span></footer>
      <Dialog open={dialog !== null} onOpenChange={(open) => { if (!open) setDialog(null); }}><DialogContent className="railway-dialog"><DialogHeader><div className="dialog-icon">{dialog === "ai" ? <MessageCircle /> : <TrainFront />}</div><DialogTitle>{dialog === "ai" ? "Hey, Daddy AI here." : dialog === "journey" ? "Your route." : "Why travel by rail?"}</DialogTitle><DialogDescription>{dialog === "ai" ? "Tell me your route, budget and dates and I’ll find the best train options for you. Live AI chat isn’t connected in this design preview." : dialog === "journey" ? `${travelClass} class for ${passengers} passenger${passengers > 1 ? "s" : ""}. Live train availability and fares aren’t connected in this design preview.` : "Rail travel means no airport stress, more scenery and a journey that’s part of the holiday. Rail Daddy finds the right train for you."}</DialogDescription></DialogHeader>{dialog === "journey" && <div className="journey-summary"><div><span>{source}</span><ArrowRight /><span>{destination}</span></div><p><CalendarDays size={16} />{date ? format(date, "EEEE, dd MMMM yyyy") : ""}</p></div>}<Button variant="travel" onClick={() => setDialog(null)}>{dialog === "journey" ? "Back to search" : "Got it"}<X size={16} /></Button></DialogContent></Dialog>
    </div>
  );
}
