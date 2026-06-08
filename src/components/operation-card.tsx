"use client";

import { Clock3, Link2, MapPin, UserRound } from "lucide-react";

import {
  deriveStates,
  pressureScore,
  statusCopy,
  statusVisual,
  type Operation,
  type OperationStatus,
} from "@/lib/showtela";
import { MotionCard, TELAStatusBadge } from "@/components/tela-card";

export function OperationCard({
  operation,
  delay = 0,
  onEscalate,
  onRefresh,
  onTransition,
  onVerify,
}: {
  operation: Operation;
  delay?: number;
  onEscalate?: (operationId: string) => void;
  onRefresh?: (operationId: string) => void;
  onTransition?: (operationId: string, status: OperationStatus) => void;
  onVerify?: (operationId: string) => void;
}) {
  const derivedStates = deriveStates(operation);
  const visual = statusVisual[operation.status];

  return (
    <MotionCard className="tela-card-glow" delay={delay}>
      <article style={{ display: "grid", gap: "var(--space-4)" }}>
        <div style={{ alignItems: "start", display: "flex", gap: "var(--space-3)" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              <TELAStatusBadge label={operation.status} status={visual.badge} />
              <span className="tela-badge" style={{ background: "var(--color-gold-bg)", color: "var(--color-gold)" }}>
                {statusCopy[operation.status]}
              </span>
            </div>
            <h2
              style={{
                color: "var(--color-cream)",
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: "var(--weight-bold)",
                letterSpacing: "var(--tracking-tight)",
                lineHeight: 1.12,
                margin: "var(--space-3) 0 0",
              }}
            >
              {operation.title}
            </h2>
          </div>
          <div
            style={{
              alignItems: "center",
              background: "rgba(234, 224, 210, 0.05)",
              border: "1px solid var(--color-navy-border)",
              borderRadius: 14,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              minWidth: 72,
              padding: "var(--space-2)",
            }}
          >
            <span className="tela-label" style={{ fontSize: 9 }}>
              Pressure
            </span>
            <strong
              style={{
                color: "var(--color-cream)",
                fontFamily: "var(--font-mono)",
                fontSize: 22,
                lineHeight: 1.1,
              }}
            >
              {pressureScore(operation)}
            </strong>
          </div>
        </div>

        <div style={{ display: "grid", gap: "var(--space-2)" }}>
          <Meta icon={<MapPin aria-hidden size={14} />} text={`${operation.venue}, ${operation.city}`} />
          <Meta icon={<Clock3 aria-hidden size={14} />} text={operation.window} />
          <Meta icon={<UserRound aria-hidden size={14} />} text={operation.owner} />
        </div>

        <div
          style={{
            borderTop: "1px solid var(--color-navy-border)",
            display: "grid",
            gap: "var(--space-3)",
            paddingTop: "var(--space-3)",
          }}
        >
          <ContinuityLine label="Current move" value={operation.currentMove} />
          <ContinuityLine label="Dependency" value={operation.dependency} />
          <ContinuityLine label="Authority" value={operation.authorityBoundary} />
          <ContinuityLine label="Provenance" value={operation.provenance} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {derivedStates.map((state) => (
            <span
              className="tela-badge"
              key={state}
              style={{
                background: "rgba(234, 224, 210, 0.04)",
                border: "1px solid var(--color-navy-border)",
                color: "var(--color-cream-muted)",
                gap: 6,
              }}
            >
              <Link2 aria-hidden size={12} />
              {state}
            </span>
          ))}
        </div>

        <p
          style={{
            color: "var(--color-cream-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono)",
            margin: 0,
          }}
        >
          Last verified <strong style={{ color: "var(--color-cream)" }}>{operation.lastVerified}</strong>
        </p>

        <div
          style={{
            borderTop: "1px solid var(--color-navy-border)",
            display: "grid",
            gap: "var(--space-2)",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            paddingTop: "var(--space-3)",
          }}
        >
          <ActionButton
            accessibleLabel={`Verify ${operation.title}`}
            label="Verify"
            onClick={() => onVerify?.(operation.id)}
            tone="green"
          />
          <ActionButton
            accessibleLabel={`Refresh ${operation.title}`}
            label="Refresh"
            onClick={() => onRefresh?.(operation.id)}
            tone="gold"
          />
          <ActionButton
            accessibleLabel={`Escalate ${operation.title}`}
            label="Escalate"
            onClick={() => onEscalate?.(operation.id)}
            tone="red"
          />
          <ActionButton
            accessibleLabel={`${operation.status === "WAITING" ? "Mark active" : "Mark waiting"} ${operation.title}`}
            label={operation.status === "WAITING" ? "Mark Active" : "Mark Waiting"}
            onClick={() =>
              onTransition?.(operation.id, operation.status === "WAITING" ? "ACTIVE" : "WAITING")
            }
            tone="amber"
          />
        </div>
      </article>
    </MotionCard>
  );
}

function ActionButton({
  accessibleLabel,
  label,
  onClick,
  tone,
}: {
  accessibleLabel: string;
  label: string;
  onClick: () => void;
  tone: "amber" | "gold" | "green" | "red";
}) {
  const colors = {
    amber: ["var(--color-status-amber-bg)", "var(--color-status-amber)"],
    gold: ["var(--color-gold-bg)", "var(--color-gold)"],
    green: ["var(--color-status-green-bg)", "var(--color-status-green)"],
    red: ["var(--color-status-red-bg)", "var(--color-status-red)"],
  };

  return (
    <button
      aria-label={accessibleLabel}
      onClick={onClick}
      style={{
        background: colors[tone][0],
        border: "1px solid var(--color-navy-border)",
        borderRadius: "var(--radius-sm)",
        color: colors[tone][1],
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-label)",
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "var(--tracking-label)",
        minHeight: "var(--touch-min)",
        textTransform: "uppercase",
      }}
      type="button"
    >
      {label}
    </button>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      style={{
        alignItems: "center",
        color: "var(--color-cream-muted)",
        display: "flex",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-small)",
        gap: "var(--space-2)",
      }}
    >
      <span style={{ color: "var(--color-gold)", display: "inline-flex" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function ContinuityLine({ label, value }: { label: string; value: string }) {
  return (
    <section>
      <p className="tela-label" style={{ margin: 0 }}>
        {label}
      </p>
      <p
        style={{
          color: "var(--color-cream)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-small)",
          lineHeight: 1.45,
          margin: "4px 0 0",
        }}
      >
        {value}
      </p>
    </section>
  );
}
