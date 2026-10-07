import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowDownUp, ArrowRight, ArrowUpRight, CalendarDays, Check, MapPin, MessageCircle, TrainFront, X, Users, Minus, Plus } from "lucide-react";
import { addDays, format, nextSaturday, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import lightsImage from "@/assets/midnight-lake.jpg";

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

const stations = ["New Delhi", "Mumbai Central", "Bengaluru", "Chennai Central", "Kolkata", "Jaipur", "Hyderabad", "Pune", "Ahmedabad", "Goa", "Varanasi", "Shimla"];

const popularRoutes = [
  { from: "New Delhi", to: "Jaipur", fromLabel: "Delhi", toLabel: "Jaipur", note: "Daddy's pick" },
  { from: "Mumbai Central", to: "Goa", fromLabel: "Mumbai", toLabel: "Goa", note: "Weekend favourite" },
  { from: "New Delhi", to: "Varanasi", fromLabel: "Delhi", toLabel: "Varanasi", note: "Overnighter" },
  { from: "Bengaluru", to: "Chennai Central", fromLabel: "Bengaluru", toLabel: "Chennai", note: "Quick getaway" },
  { from: "New Delhi", to: "Shimla", fromLabel: "Delhi", toLabel: "Shimla", note: "Hill escape" },
];

type StationFieldProps = {
  id: "source" | "destination";
  label: string;
  hint: string;
  placeholder: string;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
};

function StationField({ id, label, hint, placeholder, value, invalid, onChange }: StationFieldProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const matches = stations.filter((station) => station.toLowerCase().includes(value.trim().toLowerCase())).slice(0, 6);

  function choose(station: string) {
    onChange(station);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => Math.min(current + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && open && activeIndex >= 0) {
      event.preventDefault();
      const station = matches[activeIndex];
      if (station) choose(station);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className={`station-field ${id}-field pop${invalid ? " field-invalid" : ""}`}>
      <label htmlFor={id}><MapPin size={16} /> {label}</label>
      <input
        id={id}
        value={value}
        onChange={(event) => { onChange(event.target.value); setOpen(true); setActiveIndex(-1); }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open && matches.length > 0}
        aria-controls={`${id}-suggestions`}
        aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        aria-invalid={invalid}
      />
      <span className="field-hint">{invalid ? "This field is required" : hint}</span>
      {open && matches.length > 0 && (
        <div id={`${id}-suggestions`} className="station-suggestions" role="listbox">
          {matches.map((station, index) => (
            <Button
              id={`${id}-option-${index}`}
              key={station}
              variant="ghost"
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              className={activeIndex === index ? "active" : ""}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(station)}
            >
              <MapPin size={14} /> {station}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function Index() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const tomorrow = startOfDay(addDays(new Date(), 1));
  const [date, setDate] = useState<Date | undefined>(tomorrow);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<Date | undefined>(tomorrow);
  const [error, setError] = useState("");
  const [invalidFields, setInvalidFields] = useState({ source: false, destination: false, date: false });
  const [travelClass, setTravelClass] = useState("3A");
  const [passengers, setPassengers] = useState(2);
  const [dialog, setDialog] = useState<"journey" | "ai" | "about" | null>(null);
  function submit(event: FormEvent) {
    event.preventDefault();
    const invalid = { source: !source.trim(), destination: !destination.trim(), date: !date };
    setInvalidFields(invalid);
    if (invalid.source || invalid.destination || invalid.date) { setError("Complete the highlighted fields to search."); return; }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) { setError("Choose a destination different from your departure."); return; }
    setError(""); setDialog("journey");
  }
  return (
    <div className="railway-app">
      <header className="site-header reveal" style={{ ["--d" as string]: "0ms" }}>
        <a href="/" className="wordmark" aria-label="Rail Daddy home"><span className="wordmark-type" aria-hidden="true">RAIL <span className="wordmark-daddy">D<span className="wordmark-wink">A</span>DDY</span><span className="wordmark-stop">.</span></span></a>
        <nav aria-label="Main navigation"><Button variant="nav" className="active" onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Find a train</Button><Button variant="nav" onClick={() => setDialog("about")}>Why rail? <ArrowUpRight size={13} /></Button></nav>
        <Button variant="travel" onClick={() => setDialog("ai")}><span className="little-face"><span /><span /></span><span className="travel-copy"><span className="travel-kicker">No plan? No problem.</span><span className="travel-title">Ask Daddy AI <ArrowUpRight size={14} /></span></span></Button>
      </header>

      <main>
        <section className="journey-stage" aria-label="Find your train">
          <div className="stage-parallax"><img src={lightsImage} width={1920} height={1088} alt="" aria-hidden="true" className="lights-backdrop" /></div>
          <div className="stage-shade" />

          <div className="hero-content">
            <div className="hero-eyebrow reveal" style={{ ["--d" as string]: "100ms" }}><span className="status-dot" /> YOUR ROUTE. YOUR SEAT.</div>
            <h1><span className="line"><span>REACH YOUR <span className="h1-accent">DESTINATION.</span></span></span><span className="headline-star" aria-hidden="true">✳</span></h1>
            <p className="hero-copy reveal" style={{ ["--d" as string]: "400ms" }}>Available routes, dates and seats — sorted.<br />Daddy finds the train. You take the window seat.</p>
          </div>

          <div className="booking-area" id="booking">
            <div className="booking-intro reveal" style={{ ["--d" as string]: "550ms" }}><span><span className="mini-track" /> Start with the route. We'll find the trains.</span><span className="booking-step">01 <span>/ ROUTE BASICS</span></span></div>
            <form onSubmit={submit} className="booking-console">
              <div className="booking-form">
              <StationField id="source" label="DEPARTING FROM" hint="Where the journey begins" placeholder="Boarding station" value={source} invalid={invalidFields.source} onChange={(value) => { setSource(value); setInvalidFields((fields) => ({ ...fields, source: false })); setError(""); }} />
              <Button variant="swap" size="icon" type="button" aria-label="Swap start and destination" title="Swap start and destination" onClick={() => { setSource(destination); setDestination(source); }}><ArrowDownUp size={18} /></Button>
              <StationField id="destination" label="ARRIVING AT" hint="Where you're headed" placeholder="Destination city" value={destination} invalid={invalidFields.destination} onChange={(value) => { setDestination(value); setInvalidFields((fields) => ({ ...fields, destination: false })); setError(""); }} />
              <Button variant="date" type="button" aria-label="Open travel calendar" aria-haspopup="dialog" className={`pop${invalidFields.date ? " field-invalid" : ""}`} style={{ ["--d" as string]: "780ms" }} onClick={() => { setDraftDate(date); setCalendarOpen(true); }}><span className="field-label"><CalendarDays size={16} /> TRAVEL DATE</span><span className="date-value">{date ? format(date, "dd MMM, yyyy") : "Pick a date"}<CalendarDays size={18} /></span><span className="field-hint">{invalidFields.date ? "This field is required" : "Tap to open calendar"}</span></Button>
              </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="booking-controls reveal" style={{ ["--d" as string]: "870ms" }}>
              <div className="controls-panel">
                <span className="controls-label">Class:</span>
                <div className="vibe-chips" role="radiogroup" aria-label="Travel class">
                  {["SL", "3A", "2A", "1A"].map((name) => <Button variant="ghost" key={name} type="button" role="radio" aria-checked={travelClass === name} className={`vibe-chip ${travelClass === name ? "on" : ""}`} onClick={() => setTravelClass(name)}>{travelClass === name && <Check size={14} aria-hidden="true" />}{name}</Button>)}
                </div>
                <span className="controls-divider" aria-hidden="true" />
                <div className="crew-stepper"><Users size={15} /><span>Passengers</span><Button variant="ghost" size="icon" type="button" aria-label="Fewer passengers" onClick={() => setPassengers(c => Math.max(1, c - 1))}><Minus size={14} /></Button><strong key={passengers}>{passengers}</strong><Button variant="ghost" size="icon" type="button" aria-label="More passengers" onClick={() => setPassengers(c => Math.min(9, c + 1))}><Plus size={14} /></Button></div>
              </div>
               <Button variant="journey" type="submit" className="pop" style={{ ["--d" as string]: "960ms" }}><span className="journey-title">Find my train</span></Button>
            </div>
            </form>
          </div>

          <div className="popular-routes reveal" style={{ ["--d" as string]: "1080ms" }}>
            <div className="routes-head"><span className="routes-label">Popular routes</span><span className="routes-sub">Tap one — it fills the form</span></div>
            <div className="routes-row">
              {popularRoutes.map((route) => (
                <button key={route.from + route.to} type="button" className="route-card" onClick={() => { setSource(route.from); setDestination(route.to); setInvalidFields({ source: false, destination: false, date: false }); setError(""); }}>
                  <span className="route-names"><span>{route.fromLabel}</span><ArrowRight size={14} /><span className="route-to">{route.toLabel}</span></span>
                  <span className="route-note">{route.note}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
        <div className="route-marquee" role="group" aria-label="Pick a destination city"><div>{Array.from({ length: 2 }).map((_, k) => <span key={k} aria-hidden={k === 1 ? true : undefined}>{[["DELHI","New Delhi"],["JAIPUR","Jaipur"],["GOA","Goa"],["VARANASI","Varanasi"],["SHIMLA","Shimla"],["MUMBAI","Mumbai Central"],["KOCHI","Kochi"],["DARJEELING","Darjeeling"],["UDAIPUR","Udaipur"]].map(([label, city]) => <span key={label}><button type="button" className="marquee-city" tabIndex={k === 1 ? -1 : 0} aria-label={`Set destination to ${city}`} onClick={() => { setDestination(city); setInvalidFields((f) => ({ ...f, destination: false })); setError(""); }}>{label}</button> ✳ </span>)}</span>)}</div></div>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Rail Daddy. Trips worth the ride.</span><span>TAKE THE SCENIC ROUTE <ArrowUpRight size={13} /></span></footer>
      <Dialog open={dialog !== null} onOpenChange={(open) => { if (!open) setDialog(null); }}><DialogContent className="railway-dialog"><DialogHeader><div className="dialog-icon">{dialog === "ai" ? <MessageCircle /> : <TrainFront />}</div><DialogTitle>{dialog === "ai" ? "Hey, Daddy AI here." : dialog === "journey" ? "Your route." : "Why travel by rail?"}</DialogTitle><DialogDescription>{dialog === "ai" ? "Tell me your route, budget and dates and I’ll find the best train options for you. Live AI chat isn’t connected in this design preview." : dialog === "journey" ? `${travelClass} class for ${passengers} passenger${passengers > 1 ? "s" : ""}. Live train availability and fares aren’t connected in this design preview.` : "Rail travel means no airport stress, more scenery and a journey that’s part of the holiday. Rail Daddy finds the right train for you."}</DialogDescription></DialogHeader>{dialog === "journey" && <div className="journey-summary"><div><span>{source}</span><ArrowRight /><span>{destination}</span></div><p><CalendarDays size={16} />{date ? format(date, "EEEE, dd MMMM yyyy") : ""}</p></div>}<Button variant="travel" onClick={() => setDialog(null)}>{dialog === "journey" ? "Back to search" : "Got it"}<X size={16} /></Button></DialogContent></Dialog>
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="date-dialog" aria-label="Choose travel date">
          <div className="date-dialog-head"><span className="date-dialog-title">Travel Date</span><span className="date-dialog-nav" aria-hidden="true"><ArrowRight size={15} /></span></div>
          <div className="date-dialog-body">
            <div className="quick-dates" aria-label="Quick date choices">
              {[
                { label: "Today", value: startOfDay(new Date()) },
                { label: "Tomorrow", value: tomorrow },
                { label: "Weekend", value: nextSaturday(new Date()) },
              ].map((option) => <Button key={option.label} variant="ghost" type="button" className={draftDate && format(draftDate, "yyyy-MM-dd") === format(option.value, "yyyy-MM-dd") ? "active" : ""} onClick={() => setDraftDate(option.value)}>{option.label}</Button>)}
            </div>
            <Calendar
              mode="single"
              selected={draftDate}
              onSelect={setDraftDate}
              disabled={{ before: startOfDay(new Date()) }}
              captionLayout="dropdown"
              startMonth={new Date()}
              endMonth={new Date(new Date().getFullYear() + 1, 11)}
              className="rail-calendar"
            />
          </div>
          <div className="date-dialog-actions">
            <Button variant="journey" type="button" className="date-confirm" disabled={!draftDate} onClick={() => { if (draftDate) { setDate(draftDate); setInvalidFields((fields) => ({ ...fields, date: false })); setError(""); } setCalendarOpen(false); }}>Confirm</Button>
            <Button variant="nav" type="button" className="date-cancel" onClick={() => setCalendarOpen(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
