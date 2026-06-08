"use client";

import type { ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  Home,
  MessageSquare,
  PlaySquare,
  Radio,
  UserCircle,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, active: true },
  { label: "Play", icon: PlaySquare, active: false },
  { label: "Messages", icon: MessageSquare, active: false, dot: true },
  { label: "Calendar", icon: CalendarDays, active: false },
  { label: "Profile", icon: UserCircle, active: false },
];

export function MobileRuntime({ children }: { children: ReactNode }) {
  return (
    <main
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(196,151,58,0.12), transparent 34%), var(--color-void)",
        color: "var(--color-cream)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: 430,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <header
          style={{
            alignItems: "center",
            background: "linear-gradient(180deg, #f7eddf 0%, #eae0d2 100%)",
            color: "var(--color-void)",
            display: "flex",
            height: 112,
            justifyContent: "space-between",
            padding: "44px var(--space-screen-edge) 14px",
            position: "relative",
            zIndex: "var(--z-raised)",
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: "var(--space-3)" }}>
            <span
              aria-hidden
              style={{
                alignItems: "center",
                border: "1px solid rgba(10, 14, 23, 0.16)",
                borderRadius: 10,
                display: "flex",
                height: 34,
                justifyContent: "center",
                width: 34,
              }}
            >
              <Radio size={18} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 26,
                fontWeight: "var(--weight-bold)",
                letterSpacing: "-0.02em",
              }}
            >
              ShowTELA
            </span>
          </div>
          <button
            aria-label="Open governed notifications"
            style={{
              alignItems: "center",
              background: "transparent",
              border: "none",
              color: "var(--color-void)",
              display: "flex",
              height: "var(--touch-min)",
              justifyContent: "center",
              minWidth: "var(--touch-min)",
              position: "relative",
            }}
            type="button"
          >
            <Bell aria-hidden size={24} />
            <span
              aria-hidden
              style={{
                alignItems: "center",
                background: "var(--color-status-amber)",
                borderRadius: "var(--radius-full)",
                color: "var(--color-void)",
                display: "flex",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: "var(--weight-bold)",
                height: 18,
                justifyContent: "center",
                position: "absolute",
                right: 4,
                top: 4,
                width: 18,
              }}
            >
              3
            </span>
          </button>
        </header>

        <div
          style={{
            background: "var(--color-void)",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            marginTop: -16,
            minHeight: "calc(100vh - 96px)",
            padding: "var(--space-screen-edge)",
            paddingBottom: "calc(var(--nav-height) + var(--space-8))",
            position: "relative",
            zIndex: "var(--z-base)",
          }}
        >
          {children}
        </div>

        <BottomNav />
      </div>
    </main>
  );
}

function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      style={{
        backdropFilter: "blur(16px)",
        background: "rgba(10, 14, 23, 0.9)",
        border: "1px solid var(--color-glass-border)",
        borderRadius: "24px 24px 0 0",
        bottom: 0,
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        height: "var(--nav-height)",
        left: 0,
        margin: "0 auto",
        maxWidth: 430,
        padding: "8px 10px var(--nav-safe-padding)",
        position: "fixed",
        right: 0,
        zIndex: "var(--z-nav)",
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            aria-label={item.active ? `${item.label}, current tab` : item.label}
            key={item.label}
            style={{
              alignItems: "center",
              background: item.active ? "var(--color-gold-bg)" : "transparent",
              border: "none",
              borderRadius: 16,
              color: item.active ? "var(--color-gold)" : "var(--color-cream-muted)",
              display: "flex",
              flexDirection: "column",
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: "var(--weight-medium)",
              gap: 3,
              justifyContent: "center",
              minHeight: "var(--touch-min)",
              position: "relative",
            }}
            type="button"
          >
            <Icon aria-hidden size={23} strokeWidth={item.active ? 2.4 : 2} />
            <span>{item.label}</span>
            {item.dot ? (
              <span
                aria-hidden
                style={{
                  background: "var(--color-status-amber)",
                  borderRadius: "var(--radius-full)",
                  height: 8,
                  position: "absolute",
                  right: "25%",
                  top: 9,
                  width: 8,
                }}
              />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
