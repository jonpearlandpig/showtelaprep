"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight, Clock3, MapPin } from "lucide-react";

import type { DotColor } from "@/lib/showtela";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

type StatusType = "live" | "ready" | "pending" | "attention" | "complete";

const dotColorMap: Record<DotColor, string> = {
  green: "var(--color-status-green)",
  amber: "var(--color-status-amber)",
  red: "var(--color-status-red)",
  blue: "var(--color-status-blue)",
  purple: "var(--color-status-purple)",
};

const statusBadgeStyle: Record<StatusType, React.CSSProperties> = {
  live: { background: "var(--color-status-live)", color: "var(--color-white)" },
  ready: { background: "var(--color-status-green-bg)", color: "var(--color-status-green)" },
  pending: { background: "var(--color-status-amber-bg)", color: "var(--color-status-amber)" },
  attention: { background: "var(--color-status-red-bg)", color: "var(--color-status-red)" },
  complete: { background: "var(--color-status-green-bg)", color: "var(--color-status-green)" },
};

export function TELAStatusBadge({
  status,
  label,
}: {
  status: StatusType;
  label: string;
}) {
  return (
    <span className="tela-badge" style={statusBadgeStyle[status]}>
      {label}
    </span>
  );
}

export function TELAHeroCard({
  status,
  statusLabel,
  title,
  subtitle,
  location,
  milestone,
  imageUrl,
  delay = 0,
}: {
  status: StatusType;
  statusLabel: string;
  title: string;
  subtitle?: string;
  location?: string;
  milestone?: string;
  imageUrl: string;
  delay?: number;
}) {
  return (
    <motion.article
      animate="visible"
      custom={delay}
      initial={false}
      variants={fadeUp}
      style={{
        border: "1px solid var(--color-navy-border-active)",
        borderRadius: "var(--radius-card-lg)",
        minHeight: 232,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Image
        alt=""
        className="object-cover"
        fill
        priority
        sizes="430px"
        src={imageUrl}
      />
      <div style={{ background: "var(--gradient-hero)", inset: 0, position: "absolute" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          justifyContent: "flex-end",
          minHeight: 232,
          padding: "var(--space-card)",
          position: "relative",
        }}
      >
        <div style={{ left: "var(--space-card)", position: "absolute", top: "var(--space-card)" }}>
          <TELAStatusBadge label={statusLabel} status={status} />
        </div>

        <div>
          <h1
            style={{
              color: "var(--color-white)",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 8vw, 38px)",
              fontWeight: "var(--weight-bold)",
              letterSpacing: "var(--tracking-tight)",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              style={{
                color: "var(--color-gold)",
                fontFamily: "var(--font-display)",
                fontSize: 21,
                fontStyle: "italic",
                lineHeight: 1.15,
                margin: "3px 0 0",
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: "var(--space-1)" }}>
          {location ? <MetaRow icon={<MapPin aria-hidden size={14} />} text={location} /> : null}
          {milestone ? <MetaRow icon={<Clock3 aria-hidden size={14} />} text={milestone} /> : null}
        </div>
      </div>
    </motion.article>
  );
}

function MetaRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: 7 }}>
      <span style={{ color: "var(--color-cream)", display: "inline-flex", opacity: 0.75 }}>
        {icon}
      </span>
      <span
        style={{
          color: "var(--color-cream)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-small)",
          opacity: 0.88,
        }}
      >
        {text}
      </span>
    </div>
  );
}

export function TELAUpdateItem({
  icon,
  text,
  time,
  dotColor,
  delay = 0,
}: {
  icon: ReactNode;
  text: string;
  time: string;
  dotColor: DotColor;
  delay?: number;
}) {
  return (
    <motion.div
      animate="visible"
      custom={delay}
      initial={false}
      variants={fadeUp}
      style={{
        alignItems: "center",
        display: "flex",
        gap: "var(--space-3)",
        minHeight: "var(--touch-min)",
        paddingBlock: "var(--space-2)",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "var(--color-gold-bg)",
          borderRadius: 10,
          color: "var(--color-gold)",
          display: "flex",
          flexShrink: 0,
          height: 36,
          justifyContent: "center",
          width: 36,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            color: "var(--color-cream)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            fontWeight: "var(--weight-medium)",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {text}
        </p>
        <span
          style={{
            color: "var(--color-cream-muted)",
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono)",
            marginTop: 2,
          }}
        >
          {time}
        </span>
      </div>
      <div className="tela-status-dot" style={{ background: dotColorMap[dotColor] }} />
    </motion.div>
  );
}

export function TELANextAction({
  label,
  action,
  progress,
  onPress,
  delay = 0,
}: {
  label: string;
  action: string;
  progress: number;
  onPress?: () => void;
  delay?: number;
}) {
  return (
    <motion.article
      animate="visible"
      className="tela-card"
      custom={delay}
      initial={false}
      variants={fadeUp}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "var(--space-3)",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="tela-label">{label}</span>
          <h2
            style={{
              color: "var(--color-cream)",
              fontFamily: "var(--font-body)",
              fontSize: 20,
              fontWeight: "var(--weight-semibold)",
              lineHeight: 1.2,
              margin: "4px 0 12px",
            }}
          >
            {action}
          </h2>
          <div
            style={{
              background: "rgba(196, 151, 58, 0.20)",
              borderRadius: 2,
              height: 3,
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              style={{
                background: "var(--color-gold)",
                borderRadius: 2,
                height: "100%",
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: delay + 0.2 }}
            />
          </div>
        </div>
        <button
          aria-label={`Proceed: ${action}`}
          onClick={onPress}
          style={{
            alignItems: "center",
            background: "var(--color-gold)",
            border: "none",
            borderRadius: 14,
            color: "var(--color-void)",
            display: "flex",
            flexShrink: 0,
            height: 52,
            justifyContent: "center",
            minWidth: 52,
            transition: "background var(--duration-fast) var(--ease-out)",
            width: 52,
          }}
          type="button"
        >
          <ArrowRight aria-hidden size={24} strokeWidth={2.4} />
        </button>
      </div>
    </motion.article>
  );
}

export function MotionCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      animate="visible"
      className={className}
      custom={delay}
      initial={false}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}
