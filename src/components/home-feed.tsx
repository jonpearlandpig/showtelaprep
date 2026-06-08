"use client";

import {
  AlertTriangle,
  Bell,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Clapperboard,
  DollarSign,
  Home,
  MapPin,
  MessageCircle,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, active: true },
  { label: "Search", icon: Search },
  { label: "Production", icon: Clapperboard },
  { label: "Messages", icon: MessageCircle, dot: true },
  { label: "Ask TELA", icon: Bot },
  { label: "My Production", icon: User },
];

const glanceRows = [
  { icon: CalendarDays, label: "Schedule readiness" },
  { icon: Clapperboard, label: "Scene registry" },
  { icon: MapPin, label: "Location status" },
  { icon: Users, label: "Cast and crew" },
  { icon: DollarSign, label: "Budget signals" },
  { icon: Clock3, label: "Timeline events" },
];

export function HomeFeed() {
  return (
    <main className="showtela-home" aria-label="ShowTELA desktop home workspace">
      <aside className="home-rail" aria-label="Primary navigation">
        <div className="brand-lockup">
          <div className="brand-mark">
            <BriefcaseBusiness size={32} strokeWidth={1.7} />
          </div>
          <div className="brand-name">
            <span>ShowTELA</span>
            <span>Film</span>
          </div>
        </div>

        <nav className="rail-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button className={item.active ? "rail-item is-active" : "rail-item"} key={item.label} type="button">
                <Icon size={18} strokeWidth={1.9} />
                <span>{item.label}</span>
                {item.dot ? <span className="rail-dot" /> : null}
              </button>
            );
          })}
        </nav>

        <div className="rail-bottom">
          <button className="production-switcher" type="button">
            <span className="switcher-avatar" />
            <span className="switcher-lines">
              <span />
              <span />
            </span>
            <ChevronDown size={14} />
          </button>
          <button className="production-switcher compact" type="button">
            <span className="switcher-square" />
            <span className="switcher-lines">
              <span />
              <span />
            </span>
            <ChevronDown size={14} />
          </button>
          <button className="rail-utility" type="button">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button className="rail-utility" type="button">
            <CircleHelp size={16} />
            <span>Help & Support</span>
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="workspace-top">
          <div className="welcome-line">
            <span>Welcome back,</span>
            <span className="welcome-name" />
            <span className="status-orb" />
          </div>
          <div className="top-actions">
            <Bell size={18} />
            <span className="status-orb small" />
          </div>
        </header>

        <div className="workspace-grid">
          <section className="main-column">
            <HeroSkeleton />
            <Shelf title="Continue Producing" count={4} />
            <AttentionShelf />
            <PosterShelf title="Locations" count={6} />
            <PosterShelf title="Scenes" count={5} />
            <PeopleShelf title="Cast" count={5} />
            <PeopleShelf title="Crew" count={5} />
            <RecentChanges />
          </section>

          <aside className="right-column" aria-label="Home intelligence panels">
            <AskTelaPanel />
            <GlancePanel />
            <TasksPanel />
          </aside>
        </div>
      </section>
    </main>
  );
}

function ViewAll() {
  return (
    <button className="view-all" type="button">
      View all
      <ChevronRight size={13} />
    </button>
  );
}

function HeroSkeleton() {
  return (
    <section className="hero-template" aria-label="Production overview slot">
      <div className="hero-lines">
        <span className="line wide" />
        <span className="line mid" />
        <span className="meta-line">
          <CalendarDays size={13} />
          <span />
        </span>
      </div>
      <div className="hero-bottom">
        <span className="hero-ring" />
        <div className="hero-stat">
          <span className="stat-dot" />
          <span className="line short" />
          <span className="line small" />
          <span className="line tiny" />
        </div>
        <div className="hero-stat">
          <span className="stat-dot" />
          <span className="line short" />
          <span className="line small" />
          <span className="line tiny" />
        </div>
        <div className="hero-stat large">
          <span className="stat-dot" />
          <span className="line short" />
          <span className="line small" />
          <span className="line long" />
        </div>
        <span className="hero-cta" />
      </div>
    </section>
  );
}

function Shelf({ title, count }: { title: string; count: number }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <ViewAll />
      </div>
      <div className="horizontal-cards">
        {Array.from({ length: count }).map((_, index) => (
          <article className="production-card" key={`${title}-${index}`}>
            <span className="thumb-square" />
            <div className="card-lines">
              <span className="line card-title" />
              <span className="line card-subtitle" />
              <span className="line card-long" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AttentionShelf() {
  return (
    <section className="content-section">
      <div className="section-heading">
        <h2>Needs Attention</h2>
        <ViewAll />
      </div>
      <div className="attention-cards">
        {Array.from({ length: 4 }).map((_, index) => (
          <article className="attention-card" key={`attention-${index}`}>
            <AlertTriangle size={22} strokeWidth={1.7} />
            <div className="attention-lines">
              <span className="line attention-title" />
              <span className="line attention-subtitle" />
            </div>
            <ChevronRight size={20} strokeWidth={1.5} />
          </article>
        ))}
      </div>
    </section>
  );
}

function PosterShelf({ title, count }: { title: string; count: number }) {
  return (
    <section className="poster-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <ViewAll />
      </div>
      <div className="poster-row">
        {Array.from({ length: count }).map((_, index) => (
          <article className="poster-card" key={`${title}-${index}`}>
            <span className="poster-image" />
            <span className="line poster-title" />
            <span className="line poster-subtitle" />
          </article>
        ))}
      </div>
    </section>
  );
}

function PeopleShelf({ title, count }: { title: string; count: number }) {
  return (
    <section className="people-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <ViewAll />
      </div>
      <div className="people-row">
        {Array.from({ length: count }).map((_, index) => (
          <article className="person-card" key={`${title}-${index}`}>
            <span className="person-avatar" />
            <span className="line person-line" />
          </article>
        ))}
      </div>
    </section>
  );
}

function RecentChanges() {
  return (
    <section className="recent-panel">
      <h2>Recent Changes</h2>
      <div className="recent-row">
        {Array.from({ length: 5 }).map((_, index) => (
          <article className="recent-item" key={`recent-${index}`}>
            <span className={index % 2 === 0 ? "recent-thumb square" : "recent-thumb round"} />
            <span className="recent-lines">
              <span className="line recent-title" />
              <span className="line recent-subtitle" />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function AskTelaPanel() {
  return (
    <section className="side-panel ask-panel">
      <div className="side-heading">
        <div className="panel-title">
          <Bot size={18} />
          <h2>Ask TELA</h2>
        </div>
        <button type="button">New Chat</button>
      </div>
      <div className="ask-input">
        <span className="line ask-line" />
        <span className="ask-orb" />
      </div>
      <p>Suggested</p>
      <div className="suggested-lines">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

function GlancePanel() {
  return (
    <section className="side-panel glance-panel">
      <div className="side-heading">
        <h2>At a Glance</h2>
        <button type="button">View all</button>
      </div>
      <div className="glance-list">
        {glanceRows.map((row) => {
          const Icon = row.icon;

          return (
            <div className="glance-row" key={row.label}>
              <Icon size={15} />
              <span className="line glance-main" />
              <span className="line glance-side" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TasksPanel() {
  return (
    <section className="side-panel tasks-panel">
      <div className="side-heading">
        <h2>My Tasks</h2>
        <button type="button">View all</button>
      </div>
      <div className="task-list">
        {Array.from({ length: 3 }).map((_, index) => (
          <label className="task-row" key={`task-${index}`}>
            <span className="task-box" />
            <span className="line task-line" />
          </label>
        ))}
      </div>
    </section>
  );
}
