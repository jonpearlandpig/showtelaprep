export type OperationStatus =
  | "ACTIVE"
  | "WAITING"
  | "BLOCKED"
  | "STALE"
  | "VERIFIED";

export type DerivedState =
  | "WAITING_ON"
  | "BLOCKED_BY"
  | "NEEDS_REVIEW"
  | "STALE_72_HOURS"
  | "READY_FOR_APPROVAL"
  | "UNRESOLVED_DEPENDENCY";

export type Operation = {
  id: string;
  status: OperationStatus;
  title: string;
  venue: string;
  city: string;
  window: string;
  owner: string;
  currentMove: string;
  nextAction: string;
  dependency: string;
  authorityBoundary: string;
  relationshipContext: string;
  provenance: string;
  lastVerified: string;
  staleHours: number;
  escalationTarget?: string;
  evidence?: string;
};

export type NotificationEvent = {
  id: string;
  label: string;
  reason: string;
  operationId: string;
  time: string;
};

export type OperationEvent = NotificationEvent & {
  kind: "created" | "status" | "verification" | "escalation" | "refresh" | "note";
};

export type DotColor = "green" | "amber" | "red" | "blue" | "purple";

export type HomeUpdate = {
  id: string;
  label: string;
  text: string;
  time: string;
  dotColor: DotColor;
};

export type TeamPresence = {
  name: string;
  online: number;
  total: number;
  initials: string[];
};

export const operations: Operation[] = [
  {
    id: "op-van-load",
    status: "ACTIVE",
    title: "Backline truck load-in advancing",
    venue: "The Orpheum",
    city: "Memphis",
    window: "Today, 14:00 dock call",
    owner: "Mara L.",
    currentMove: "Confirming dock access, forklift operator, and stage-right path.",
    nextAction: "Mara confirms dock marshal by 11:30 before driver reroute.",
    dependency: "Venue operations must unlock north alley before bus arrival.",
    authorityBoundary: "Venue ops lead owns alley access; tour PM owns reroute.",
    relationshipContext: "Do not bypass Calvin at venue ops; he controls dock crew trust.",
    provenance: "Tour advance packet v3, phone confirmation logged 09:18.",
    lastVerified: "09:18 CT",
    staleHours: 2,
    escalationTarget: "Tour PM",
  },
  {
    id: "op-hospitality",
    status: "WAITING",
    title: "Hospitality rider substitutions",
    venue: "Fox Theatre",
    city: "Atlanta",
    window: "Tomorrow, 09:00 runner release",
    owner: "Inez R.",
    currentMove: "Waiting on house buyer to confirm dietary swaps.",
    nextAction: "Legitimate follow-up at 16:00 if buyer has not moved.",
    dependency: "House buyer approval before runner purchase list can lock.",
    authorityBoundary: "House buyer controls substitutions under venue contract.",
    relationshipContext: "Buyer prefers one consolidated follow-up, not thread pings.",
    provenance: "Hospitality thread, buyer acknowledged request 08:42.",
    lastVerified: "08:42 ET",
    staleHours: 5,
  },
  {
    id: "op-lighting",
    status: "BLOCKED",
    title: "Lighting plot approval",
    venue: "Moody Theater",
    city: "Austin",
    window: "Readiness gate in 6h",
    owner: "Dev S.",
    currentMove: "Designer cannot release final plot until trim height is verified.",
    nextAction: "Escalate to production manager if rigging answer is absent by 13:00.",
    dependency: "Rigging vendor must verify trim height and house points.",
    authorityBoundary: "Rigging vendor owns measurement; production manager can escalate.",
    relationshipContext: "Vendor response time is strained after last-minute scope change.",
    provenance: "CAD overlay rev B, vendor email 07:06, PM note 09:32.",
    lastVerified: "09:32 CT",
    staleHours: 3,
    escalationTarget: "Production manager",
  },
  {
    id: "op-crew",
    status: "STALE",
    title: "Local crew count for second city",
    venue: "Ryman Auditorium",
    city: "Nashville",
    window: "Crew call locks in 24h",
    owner: "Theo B.",
    currentMove: "Crew estimate has not been refreshed since routing changed.",
    nextAction: "Refresh labor count against revised load-out plan.",
    dependency: "Revised load-out timing and local steward confirmation.",
    authorityBoundary: "Local steward owns crew availability; tour PM owns labor spend.",
    relationshipContext: "Steward expects changes through Theo, not direct operator calls.",
    provenance: "Season memory object, previous tour handoff, routing update.",
    lastVerified: "Sunday 10:10 CT",
    staleHours: 76,
    escalationTarget: "Tour PM",
  },
  {
    id: "op-radio",
    status: "VERIFIED",
    title: "Comms package and radio map",
    venue: "Beacon Theatre",
    city: "New York",
    window: "Deployment preview complete",
    owner: "June K.",
    currentMove: "Radio map verified against venue zones and security channel.",
    nextAction: "Hold map until final security lead check-in.",
    dependency: "Security lead arrival time remains linked to FOH access.",
    authorityBoundary: "Security lead owns channel conflict approval.",
    relationshipContext: "Security lead is reliable but should not be disrupted pre-door.",
    provenance: "Comms map v2, venue continuity record, security desk call.",
    lastVerified: "11:04 ET",
    staleHours: 1,
    evidence: "Call recording ID COMMS-218 and signed zone map.",
  },
];

export const notifications: NotificationEvent[] = [
  {
    id: "note-1",
    label: "Escalation window opened",
    reason: "Lighting plot remains blocked with a readiness gate inside 6 hours.",
    operationId: "op-lighting",
    time: "09:41 CT",
  },
  {
    id: "note-2",
    label: "Stale continuity threshold crossed",
    reason: "Crew count aged beyond 72 hours after routing changed.",
    operationId: "op-crew",
    time: "08:12 CT",
  },
  {
    id: "note-3",
    label: "Verification event logged",
    reason: "Comms map was verified with evidence and authority context.",
    operationId: "op-radio",
    time: "11:04 ET",
  },
];

export const initialEvents: OperationEvent[] = notifications.map((notification, index) => ({
  ...notification,
  kind: index === 2 ? "verification" : index === 1 ? "refresh" : "escalation",
}));

export function deriveStates(operation: Operation): DerivedState[] {
  const states = new Set<DerivedState>();

  if (operation.status === "WAITING") {
    states.add("WAITING_ON");
  }

  if (operation.status === "BLOCKED") {
    states.add("BLOCKED_BY");
    states.add("UNRESOLVED_DEPENDENCY");
  }

  if (operation.status === "STALE" || operation.staleHours >= 72) {
    states.add("STALE_72_HOURS");
    states.add("NEEDS_REVIEW");
  }

  if (operation.status === "ACTIVE" && operation.escalationTarget) {
    states.add("UNRESOLVED_DEPENDENCY");
  }

  if (operation.status === "VERIFIED" && operation.evidence) {
    states.add("READY_FOR_APPROVAL");
  }

  return Array.from(states);
}

export function pressureScore(operation: Operation): number {
  const statusWeight: Record<OperationStatus, number> = {
    BLOCKED: 95,
    STALE: 82,
    ACTIVE: 68,
    WAITING: 48,
    VERIFIED: 20,
  };

  const stalePressure = Math.min(operation.staleHours, 96) / 4;
  const escalationPressure = operation.escalationTarget ? 10 : 0;

  return Math.min(100, Math.round(statusWeight[operation.status] + stalePressure + escalationPressure));
}

export function getFeed(source: Operation[] = operations): Operation[] {
  return [...source].sort((a, b) => pressureScore(b) - pressureScore(a));
}

export const feed = getFeed(operations);

export const statusCopy: Record<OperationStatus, string> = {
  ACTIVE: "Moving now",
  WAITING: "Waiting on authority move",
  BLOCKED: "Blocked by dependency",
  STALE: "Refresh required",
  VERIFIED: "Evidence anchored",
};

export const statusVisual: Record<
  OperationStatus,
  { badge: "live" | "ready" | "pending" | "attention" | "complete"; dot: DotColor; label: string }
> = {
  ACTIVE: { badge: "live", dot: "green", label: "Live status" },
  WAITING: { badge: "pending", dot: "amber", label: "Waiting" },
  BLOCKED: { badge: "attention", dot: "red", label: "Attention" },
  STALE: { badge: "attention", dot: "amber", label: "Needs review" },
  VERIFIED: { badge: "complete", dot: "green", label: "Verified" },
};

export function getHeroOperation(source: Operation[] = operations): Operation {
  return getFeed(source)[0];
}

export function getHomeUpdates(
  sourceOperations: Operation[] = operations,
  sourceEvents: OperationEvent[] = initialEvents,
): HomeUpdate[] {
  return sourceEvents.slice(0, 6).map((notification) => {
    const operation = sourceOperations.find((item) => item.id === notification.operationId);
    const status = operation?.status ?? "ACTIVE";

    return {
      id: notification.id,
      label: notification.label,
      text: notification.reason,
      time: notification.time,
      dotColor: statusVisual[status].dot,
    };
  });
}

export function getNextAction(
  source: Operation[] = operations,
): { label: string; action: string; progress: number; operation: Operation } {
  const sourceFeed = getFeed(source);
  const operation = sourceFeed.find((item) => item.status !== "VERIFIED") ?? sourceFeed[0];

  return {
    label: "Next action",
    action: operation.nextAction,
    progress: Math.max(12, Math.min(88, 100 - pressureScore(operation))),
    operation,
  };
}

export function getTeamPresence(source: Operation[] = operations): TeamPresence {
  const owners = source.map((operation) => operation.owner);

  return {
    name: "Touring core team",
    online: Math.max(1, owners.length - 1),
    total: owners.length + 4,
    initials: owners.slice(0, 4).map((owner) =>
      owner
        .split(" ")
        .map((part) => part[0])
        .join("")
        .replace(".", ""),
    ),
  };
}

export function getTelaWhySummary(source: Operation[] = operations): string {
  const blocked = source.filter((operation) => operation.status === "BLOCKED").length;
  const stale = source.filter((operation) => operation.status === "STALE").length;
  const verified = source.filter((operation) => operation.status === "VERIFIED").length;

  return `${blocked} blocker, ${stale} stale continuity path, and ${verified} verified handoff are shaping today's pressure. The next move stays tied to authority, dependency, and provenance so the team does not have to reconstruct context under load.`;
}

export function formatRuntimeTime(date = new Date()): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
