import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowDownUp, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, MapPin, MessageCircle, MoveRight, TrainFront, X } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import trainImage from "@/assets/night-train.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "railway — Your next journey starts here" },
    { name: "description", content: "A little further. A little freer. Plan your train journey with railway: choose your departure, destination and date." },
    { property: "og:title", content: "railway — Your next journey starts here" },
    { property: "og:description", content: "Choose a destination. Find your next train journey." },
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
  const [dialog, setDialog] = useState<"journey" | "ai" | "about" | null>(null);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!source.trim() || !destination.trim() || !date) { setError("Choose your departure, destination and travel date."); return; }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) { setError("Choose a destination different from your departure."); return; }
    setError(""); setDialog("journey");
  }
  return (
    <div className="railway-app">
      <header className="site-header">
        <a href="/" className="wordmark" aria-label="railway home"><span className="brand-icon"><TrainFront size={21} strokeWidth={2.5} /></span>railway<span className="brand-dot">®</span></a>
        <nav aria-label="Main navigation"><Button variant="nav" className="active" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Book a journey</Button><Button variant="nav" onClick={() => setDialog("about")}>The railway way <ArrowUpRight size={13} /></Button></nav>
        <Button variant="travel" onClick={() => setDialog("ai")}><span className="little-face"><span /><span /></span>Chat with AI <ArrowUpRight /></Button>
      </header>

      <main>
        <section className="journey-stage" aria-label="Book your train journey">
          <img src={trainImage} width={1536} height={1024} alt="A sleek modern train with mint-colored headlights emerging from the dark" className="train-backdrop" />
          <div className="stage-shade" />
          <div className="hero-content">
            <div className="hero-eyebrow"><span className="status-dot" /> LESS SCROLLING. MORE GOING.</div>
            <h1>GO A LITTLE<br /><span>FURTHER.</span><span className="headline-star" aria-hidden="true">✳</span></h1>
            <p className="hero-copy">Big cities. Small towns. Somewhere new.<br />Your next good story starts with a train ride.</p>
          </div>
          <div className="train-note"><span className="note-line" /><span>THE JOURNEY IS THE GOOD PART.</span></div>

          <div className="booking-area" id="booking">
            <div className="booking-intro"><span><span className="mini-track" /> A one-way ticket to what's next.</span><span className="booking-step">01 <span>/ LET'S GET YOU THERE</span></span></div>
            <form onSubmit={submit} className="booking-form">
              <div className="station-field source-field"><label htmlFor="source"><MapPin size={16} /> FROM</label><input id="source" list="stations" value={source} onChange={(event) => { setSource(event.target.value); setError(""); }} placeholder="Where from?" autoComplete="off" /><span className="field-hint">Your starting point</span></div>
              <Button variant="swap" size="icon" type="button" aria-label="Swap departure and destination" title="Swap departure and destination" onClick={() => { setSource(destination); setDestination(source); }}><ArrowDownUp size={18} /></Button>
              <div className="station-field destination-field"><label htmlFor="destination"><MapPin size={16} /> TO</label><input id="destination" list="stations" value={destination} onChange={(event) => { setDestination(event.target.value); setError(""); }} placeholder="Where to?" autoComplete="off" /><span className="field-hint">Somewhere worth going</span></div>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}><PopoverTrigger asChild><Button variant="date" type="button" aria-label="Choose travel date"><span className="field-label"><CalendarDays size={16} /> WHEN</span><span className="date-value">{date ? format(date, "dd MMM, yyyy") : "Pick a date"}<ChevronDown size={18} /></span><span className="field-hint">A day to look forward to</span></Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="center"><Calendar mode="single" selected={date} onSelect={(value) => { setDate(value); setCalendarOpen(false); setError(""); }} disabled={{ before: startOfDay(new Date()) }} className="pointer-events-auto" /></PopoverContent></Popover>
              <Button variant="journey" type="submit"><span>Find my train</span><ArrowUpRight size={24} /><span className="search-subtitle">Next stop: adventure</span></Button>
              <datalist id="stations">{["New Delhi", "Mumbai Central", "Bengaluru", "Chennai Central", "Kolkata", "Jaipur", "Hyderabad", "Pune", "Ahmedabad", "Goa"].map(station => <option key={station} value={station} />)}</datalist>
            </form>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="booking-bottom"><span><Check size={13} /> A better day starts on a train.</span><span>WINDOW SEAT ENERGY. <span aria-hidden="true">↗</span></span></div>
          </div>
        </section>

        <section className="little-nudge"><div><span className="nudge-symbol" aria-hidden="true">✳</span><p>A little less ordinary.<br /><strong>A little more out there.</strong></p></div><Button variant="nav" onClick={() => setDialog("ai")}>Not sure where to go? <span>Let's dream it up <MoveRight size={18} /></span></Button></section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} railway. Made for the way there.</span><span>TAKE THE SCENIC ROUTE <ArrowUpRight size={13} /></span></footer>
      <Dialog open={dialog !== null} onOpenChange={(open) => { if (!open) setDialog(null); }}><DialogContent className="railway-dialog"><DialogHeader><div className="dialog-icon">{dialog === "ai" ? <MessageCircle /> : <TrainFront />}</div><DialogTitle>{dialog === "ai" ? "A little help finding your way." : dialog === "journey" ? "Your next journey." : "The railway way."}</DialogTitle><DialogDescription>{dialog === "ai" ? "Your AI travel companion will help you find somewhere worth going. Live AI chat isn’t connected in this design preview." : dialog === "journey" ? "Your journey details are ready. Live train availability and ticket booking aren’t connected in this design preview." : "For the big-city weekends, the slow mornings and the places you haven’t met yet. We believe the way there is part of the adventure."}</DialogDescription></DialogHeader>{dialog === "journey" && <div className="journey-summary"><div><span>{source}</span><ArrowRight /><span>{destination}</span></div><p><CalendarDays size={16} />{date ? format(date, "EEEE, dd MMMM yyyy") : ""}</p></div>}<Button variant="travel" onClick={() => setDialog(null)}>{dialog === "journey" ? "Back to my journey" : "Got it"}<X size={16} /></Button></DialogContent></Dialog>
    </div>
  );
}
