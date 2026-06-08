"use client";

import { type FormEvent } from "react";
import { CheckCircle2, FileCheck2, ShieldAlert, Sparkles, UsersRound } from "lucide-react";

import { OperationCard } from "@/components/operation-card";
import {
  MotionCard,
  TELAHeroCard,
  TELANextAction,
  TELAUpdateItem,
} from "@/components/tela-card";
import {
  getFeed,
  getHeroOperation,
  getHomeUpdates,
  getNextAction,
  getTeamPresence,
  getTelaWhySummary,
  statusVisual,
} from "@/lib/showtela";
import { useShowtelaStore } from "@/hooks/use-showtela-store";

const heroImage =
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=900&q=80";

export function HomeFeed() {
  const store = useShowtelaStore();
  const runtimeFeed = getFeed(store.operations);
  const hero = getHeroOperation(store.operations);
  const visual = statusVisual[hero.status];
  const updates = getHomeUpdates(store.operations, store.events);
  const nextAction = getNextAction(store.operations);
  const team = getTeamPresence(store.operations);
  const summary = getTelaWhySummary(store.operations);

  function handleAddOperation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    store.addOperation({
      city: String(data.get("city") ?? ""),
      nextAction: String(data.get("nextAction") ?? ""),
      owner: String(data.get("owner") ?? ""),
      title: String(data.get("title") ?? ""),
      venue: String(data.get("venue") ?? ""),
    });
    form.reset();
  }

  return (
    <div style={{ display: "grid", gap: "var(--space-section)" }}>
      <TELAHeroCard
        imageUrl={heroImage}
        location={`${hero.venue}, ${hero.city}`}
        milestone={`Next move: ${hero.window}`}
        status={visual.badge}
        statusLabel={visual.label}
        subtitle={hero.status === "BLOCKED" ? "Requires authority move." : "Show ready."}
        title={hero.title}
      />

      <MotionCard className="tela-card" delay={0.08}>
        <section>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "var(--space-3)",
            }}
          >
            <span className="tela-label">Since you were last here</span>
            <span
              className="tela-badge"
              style={{ background: "var(--color-gold-bg)", color: "var(--color-cream)" }}
            >
              {updates.length} updates
            </span>
          </div>
          <div style={{ display: "grid" }}>
            {updates.map((update, index) => (
              <div key={update.id}>
                <TELAUpdateItem
                  delay={0.12 + index * 0.04}
                  dotColor={update.dotColor}
                  icon={iconForUpdate(index)}
                  text={update.label}
                  time={update.time}
                />
                <p
                  style={{
                    color: "var(--color-cream-muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-small)",
                    lineHeight: 1.35,
                    margin: "-4px 0 var(--space-2) 48px",
                  }}
                >
                  {update.text}
                </p>
                {index < updates.length - 1 ? (
                  <div style={{ background: "var(--color-navy-border)", height: 1 }} />
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </MotionCard>

      <MotionCard className="tela-card-glow" delay={0.24}>
        <section>
          <div style={{ alignItems: "center", display: "flex", gap: "var(--space-2)" }}>
            <Sparkles aria-hidden color="var(--color-status-green)" size={20} />
            <h2
              style={{
                color: "var(--color-status-green)",
                fontFamily: "var(--font-body)",
                fontSize: 20,
                fontWeight: "var(--weight-semibold)",
                margin: 0,
              }}
            >
              TELAwhy Summary
            </h2>
          </div>
          <p
            style={{
              color: "var(--color-cream)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body)",
              lineHeight: 1.45,
              margin: "var(--space-2) 0 0",
            }}
          >
            {summary}
          </p>
        </section>
      </MotionCard>

      <div style={{ marginBottom: "calc(var(--nav-height) * 0.45)" }}>
        <TELANextAction
          action={nextAction.action}
          delay={0.32}
          label={nextAction.label}
          onPress={() => store.executeNextAction(nextAction.operation.id)}
          progress={nextAction.progress}
        />
      </div>

      <MotionCard className="tela-card" delay={0.4}>
        <section
          style={{
            alignItems: "center",
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", minWidth: 0 }}>
            {team.initials.map((initials, index) => (
              <span
                aria-label={initials}
                key={`${initials}-${index}`}
                style={{
                  alignItems: "center",
                  background: avatarBackground(index),
                  border: "2px solid var(--color-navy)",
                  borderRadius: "var(--radius-full)",
                  color: "var(--color-void)",
                  display: "flex",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: "var(--weight-bold)",
                  height: 40,
                  justifyContent: "center",
                  marginLeft: index === 0 ? 0 : -10,
                  width: 40,
                }}
              >
                {initials}
              </span>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                color: "var(--color-cream)",
                fontFamily: "var(--font-body)",
                fontSize: 17,
                fontWeight: "var(--weight-semibold)",
                margin: 0,
              }}
            >
              {team.name}
            </h2>
            <p
              style={{
                color: "var(--color-cream-muted)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-small)",
                margin: "2px 0 0",
              }}
            >
              <strong style={{ color: "var(--color-status-green)" }}>{team.online} online</strong>
              {" · "}
              {team.total} total
            </p>
          </div>
          <UsersRound aria-hidden color="var(--color-gold)" size={24} />
        </section>
      </MotionCard>

      <section style={{ display: "grid", gap: "var(--space-item)" }}>
        <div style={{ alignItems: "end", display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p className="tela-label" style={{ margin: 0 }}>
              Operational feed
            </p>
            <h2
              style={{
                color: "var(--color-cream)",
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: "var(--weight-bold)",
                letterSpacing: "var(--tracking-tight)",
                lineHeight: 1.1,
                margin: "4px 0 0",
              }}
            >
              Reprioritized by pressure
            </h2>
          </div>
          <button
            onClick={store.resetRuntime}
            style={{
              background: "transparent",
              border: "1px solid var(--color-navy-border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-cream-muted)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-label)",
              minHeight: 36,
              padding: "0 var(--space-3)",
            }}
            type="button"
          >
            Reset
          </button>
        </div>

        <MotionCard className="tela-card" delay={0.44}>
          <form onSubmit={handleAddOperation} style={{ display: "grid", gap: "var(--space-3)" }}>
            <div>
              <span className="tela-label">Add operation</span>
              <p
                style={{
                  color: "var(--color-cream-muted)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-small)",
                  lineHeight: 1.35,
                  margin: "4px 0 0",
                }}
              >
                Persist a new live move into this runtime.
              </p>
            </div>
            <RuntimeInput label="Title" name="title" />
            <div style={{ display: "grid", gap: "var(--space-2)", gridTemplateColumns: "1fr 1fr" }}>
              <RuntimeInput label="Venue" name="venue" />
              <RuntimeInput label="City" name="city" />
            </div>
            <RuntimeInput label="Owner" name="owner" />
            <RuntimeInput label="Next action" name="nextAction" />
            <button
              style={{
                background: "var(--color-gold)",
                border: "none",
                borderRadius: 12,
                color: "var(--color-void)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-body)",
                fontWeight: "var(--weight-semibold)",
                minHeight: "var(--touch-min)",
              }}
              type="submit"
            >
              Add to runtime
            </button>
          </form>
        </MotionCard>

        {runtimeFeed.map((operation, index) => (
          <OperationCard
            delay={0.48 + index * 0.04}
            key={operation.id}
            onEscalate={store.escalateOperation}
            onRefresh={store.refreshOperation}
            onTransition={store.transitionOperation}
            onVerify={store.verifyOperation}
            operation={operation}
          />
        ))}
      </section>
    </div>
  );
}

function RuntimeInput({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  return (
    <label style={{ display: "grid", gap: 5 }}>
      <span className="tela-label">{label}</span>
      <input
        name={name}
        style={{
          background: "rgba(234, 224, 210, 0.04)",
          border: "1px solid var(--color-navy-border)",
          borderRadius: "var(--radius-sm)",
          color: "var(--color-cream)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-body)",
          minHeight: "var(--touch-min)",
          outline: "none",
          padding: "0 var(--space-3)",
          width: "100%",
        }}
      />
    </label>
  );
}

function iconForUpdate(index: number) {
  const icons = [
    <ShieldAlert aria-hidden key="shield" size={18} />,
    <FileCheck2 aria-hidden key="file" size={18} />,
    <CheckCircle2 aria-hidden key="check" size={18} />,
  ];

  return icons[index % icons.length];
}

function avatarBackground(index: number) {
  const backgrounds = [
    "var(--color-gold)",
    "var(--color-status-green)",
    "var(--color-status-blue)",
    "var(--color-cream)",
  ];

  return backgrounds[index % backgrounds.length];
}
