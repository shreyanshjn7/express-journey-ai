import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, type FormEvent, type MouseEvent } from "react";
import { ArrowDownUp, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, MapPin, MessageCircle, MoveRight, TrainFront, X, Mountain, Waves, Landmark, Coffee, Users, Minus, Plus } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import lightsImage from "@/assets/night-rails.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Rail Daddy — Plan trips by train across India" },
    { name: "description", content: "Rail Daddy plans your whole trip by rail: pick where from, where to, when, and your travel vibe." },
    { property: "og:title", content: "Rail Daddy — Plan trips by train across India" },
    { property: "og:description", content: "Plan your next rail trip: route, dates, crew and vibe in one place." },
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
  const [vibe, setVibe] = useState("Hills");
  const [crew, setCrew] = useState(2);
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
        <nav aria-label="Main navigation"><Button variant="nav" className="active" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Plan a trip</Button><Button variant="nav" onClick={() => setDialog("about")}>Why rail? <ArrowUpRight size={13} /></Button></nav>
        <Button variant="travel" onClick={() => setDialog("ai")}><span className="little-face"><span /><span /></span>Ask Daddy AI <ArrowUpRight /></Button>
      </header>

      <main>
        <section ref={stageRef} onMouseMove={tilt} className="journey-stage" aria-label="Plan your rail trip">
          <div className="stage-parallax"><img src={lightsImage} width={1536} height={1024} alt="" aria-hidden="true" className="lights-backdrop" /></div>
          <div className="stage-shade" />

          <div className="hero-content">
            <div className="hero-eyebrow reveal" style={{ ["--d" as string]: "100ms" }}><span className="status-dot" /> YOUR TRIP. OUR TRACKS.</div>
            <h1><span className="line"><span>PLAN THE</span></span><span className="line accent"><span>TRIP.</span></span><span className="headline-star" aria-hidden="true">✳</span></h1>
            <p className="hero-copy reveal" style={{ ["--d" as string]: "400ms" }}>Routes, dates, crew and vibe — sorted.<br />Daddy handles the planning. You handle the window seat.</p>
          </div>

          <div className="booking-area" id="booking">
            <div className="booking-intro reveal" style={{ ["--d" as string]: "550ms" }}><span><span className="mini-track" /> Start with the route. We'll build the trip.</span><span className="booking-step">01 <span>/ TRIP BASICS</span></span></div>
            <form onSubmit={submit} className="booking-form">
              <div className="station-field source-field pop" style={{ ["--d" as string]: "620ms" }}><label htmlFor="source"><MapPin size={16} /> STARTING FROM</label><input id="source" list="stations" value={source} onChange={(event) => { setSource(event.target.value); setError(""); }} placeholder="Home base" autoComplete="off" /><span className="field-hint">Where the trip begins</span></div>
              <Button variant="swap" size="icon" type="button" aria-label="Swap start and destination" title="Swap start and destination" onClick={() => { setSource(destination); setDestination(source); }}><ArrowDownUp size={18} /></Button>
              <div className="station-field destination-field pop" style={{ ["--d" as string]: "700ms" }}><label htmlFor="destination"><MapPin size={16} /> HEADING TO</label><input id="destination" list="stations" value={destination} onChange={(event) => { setDestination(event.target.value); setError(""); }} placeholder="Dream spot" autoComplete="off" /><span className="field-hint">Your next story</span></div>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}><PopoverTrigger asChild><Button variant="date" type="button" aria-label="Choose trip start date" className="pop" style={{ ["--d" as string]: "780ms" }}><span className="field-label"><CalendarDays size={16} /> TRIP STARTS</span><span className="date-value">{date ? format(date, "dd MMM, yyyy") : "Pick a date"}<ChevronDown size={18} /></span><span className="field-hint">Countdown begins now</span></Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="center"><Calendar mode="single" selected={date} onSelect={(value) => { setDate(value); setCalendarOpen(false); setError(""); }} disabled={{ before: startOfDay(new Date()) }} className="pointer-events-auto" /></PopoverContent></Popover>
              <datalist id="stations">{["New Delhi", "Mumbai Central", "Bengaluru", "Chennai Central", "Kolkata", "Jaipur", "Hyderabad", "Pune", "Ahmedabad", "Goa", "Varanasi", "Shimla"].map(station => <option key={station} value={station} />)}</datalist>
            </form>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="booking-controls reveal" style={{ ["--d" as string]: "870ms" }}>
              <div className="controls-panel">
                <span className="controls-label">The vibe:</span>
                <div className="vibe-chips" role="radiogroup" aria-label="Trip vibe">
                  {[["Hills", Mountain], ["Beach", Waves], ["Heritage", Landmark], ["Chill", Coffee]].map(([name, Icon]) => { const I = Icon as typeof Mountain; return <button key={name as string} type="button" role="radio" aria-checked={vibe === name} className={`vibe-chip ${vibe === name ? "on" : ""}`} onClick={() => setVibe(name as string)}><I size={15} />{name as string}</button>; })}
                </div>
                <span className="controls-divider" aria-hidden="true" />
                <div className="crew-stepper"><Users size={15} /><span>Crew</span><button type="button" aria-label="Fewer travellers" onClick={() => setCrew(c => Math.max(1, c - 1))}><Minus size={14} /></button><strong key={crew}>{crew}</strong><button type="button" aria-label="More travellers" onClick={() => setCrew(c => Math.min(9, c + 1))}><Plus size={14} /></button></div>
              </div>
              <Button variant="journey" type="submit" className="pop" style={{ ["--d" as string]: "960ms" }}><span className="journey-copy"><span className="journey-title">Plan my trip</span><span className="search-subtitle">Routes + stays + stops</span></span><span className="journey-arrow"><ArrowUpRight size={20} /></span></Button>
            </div>
          </div>
          <div className="train-note reveal" style={{ ["--d" as string]: "1100ms" }}><span className="note-line" /><span>NOW BOARDING YOUR NEXT ESCAPE</span></div>
        </section>

        <div className="route-marquee" aria-hidden="true"><div>{Array.from({ length: 2 }).map((_, k) => <span key={k}>DELHI ✳ JAIPUR ✳ GOA ✳ VARANASI ✳ SHIMLA ✳ MUMBAI ✳ KOCHI ✳ DARJEELING ✳ UDAIPUR ✳ </span>)}</div></div>

        <section className="little-nudge"><div><span className="nudge-symbol" aria-hidden="true">✳</span><p>No plan? No problem.<br /><strong>Daddy's got a few ideas.</strong></p></div><Button variant="nav" onClick={() => setDialog("ai")}>Tell us your mood <span>Let's plan it together <MoveRight size={18} /></span></Button></section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Rail Daddy. Trips worth the ride.</span><span>TAKE THE SCENIC ROUTE <ArrowUpRight size={13} /></span></footer>
      <Dialog open={dialog !== null} onOpenChange={(open) => { if (!open) setDialog(null); }}><DialogContent className="railway-dialog"><DialogHeader><div className="dialog-icon">{dialog === "ai" ? <MessageCircle /> : <TrainFront />}</div><DialogTitle>{dialog === "ai" ? "Hey, Daddy AI here." : dialog === "journey" ? "Your trip plan." : "Why plan by rail?"}</DialogTitle><DialogDescription>{dialog === "ai" ? "Tell me your budget, mood and dates and I’ll sketch a rail trip for you. Live AI chat isn’t connected in this design preview." : dialog === "journey" ? `A ${vibe.toLowerCase()} trip for ${crew}. Live trains, stays and itineraries aren’t connected in this design preview.` : "Rail trips mean no airport stress, more scenery and a journey that’s part of the holiday. Rail Daddy plans the whole thing around the train."}</DialogDescription></DialogHeader>{dialog === "journey" && <div className="journey-summary"><div><span>{source}</span><ArrowRight /><span>{destination}</span></div><p><CalendarDays size={16} />{date ? format(date, "EEEE, dd MMMM yyyy") : ""}</p></div>}<Button variant="travel" onClick={() => setDialog(null)}>{dialog === "journey" ? "Back to planning" : "Got it"}<X size={16} /></Button></DialogContent></Dialog>
    </div>
  );
}
