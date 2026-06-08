"use client";

import { useEffect, useMemo, useState } from "react";

import {
  formatRuntimeTime,
  initialEvents,
  operations as seedOperations,
  type Operation,
  type OperationEvent,
  type OperationStatus,
} from "@/lib/showtela";

const STORAGE_KEY = "showtela.runtime.v1";

type RuntimeState = {
  operations: Operation[];
  events: OperationEvent[];
};

type NewOperationInput = {
  title: string;
  venue: string;
  city: string;
  owner: string;
  nextAction: string;
};

const seedState: RuntimeState = {
  operations: seedOperations,
  events: initialEvents,
};

export function useShowtelaStore() {
  const [state, setState] = useState<RuntimeState>(seedState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RuntimeState;
        if (Array.isArray(parsed.operations) && Array.isArray(parsed.events)) {
          setState(parsed);
        }
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  return useMemo(
    () => ({
      ...state,
      hydrated,
      addOperation: (input: NewOperationInput) =>
        setState((current) => addOperation(current, input)),
      executeNextAction: (operationId: string) =>
        setState((current) => transitionOperation(current, operationId, nextExecutableStatus(current, operationId))),
      transitionOperation: (operationId: string, status: OperationStatus) =>
        setState((current) => transitionOperation(current, operationId, status)),
      verifyOperation: (operationId: string) =>
        setState((current) => verifyOperation(current, operationId)),
      escalateOperation: (operationId: string) =>
        setState((current) => escalateOperation(current, operationId)),
      refreshOperation: (operationId: string) =>
        setState((current) => refreshOperation(current, operationId)),
      resetRuntime: () => setState(seedState),
    }),
    [hydrated, state],
  );
}

function addOperation(current: RuntimeState, input: NewOperationInput): RuntimeState {
  const now = formatRuntimeTime();
  const operation: Operation = {
    id: `op-${Date.now()}`,
    status: "ACTIVE",
    title: input.title.trim() || "New operational move",
    venue: input.venue.trim() || "Venue TBD",
    city: input.city.trim() || "City TBD",
    window: "Newly added",
    owner: input.owner.trim() || "Unassigned",
    currentMove: "New operation added to runtime and awaiting first verification.",
    nextAction: input.nextAction.trim() || "Assign owner and verify the next legitimate move.",
    dependency: "Dependency not yet recorded.",
    authorityBoundary: "Authority boundary requires confirmation.",
    relationshipContext: "Relationship continuity requires first note.",
    provenance: `Created in ShowTELA runtime at ${now}.`,
    lastVerified: now,
    staleHours: 0,
  };

  return {
    operations: [operation, ...current.operations],
    events: [
      makeEvent(operation.id, "created", "Operation created", `${operation.title} entered the runtime.`, now),
      ...current.events,
    ],
  };
}

function transitionOperation(
  current: RuntimeState,
  operationId: string,
  status: OperationStatus,
): RuntimeState {
  const now = formatRuntimeTime();
  const operation = current.operations.find((item) => item.id === operationId);
  if (!operation) {
    return current;
  }

  return {
    operations: current.operations.map((item) =>
      item.id === operationId
        ? {
            ...item,
            status,
            lastVerified: now,
            staleHours: status === "STALE" ? 72 : 0,
            currentMove: statusCopyForTransition(status, item),
          }
        : item,
    ),
    events: [
      makeEvent(operationId, "status", `${status} state logged`, `${operation.title} moved to ${status}.`, now),
      ...current.events,
    ],
  };
}

function verifyOperation(current: RuntimeState, operationId: string): RuntimeState {
  const now = formatRuntimeTime();
  const operation = current.operations.find((item) => item.id === operationId);
  if (!operation) {
    return current;
  }

  return {
    operations: current.operations.map((item) =>
      item.id === operationId
        ? {
            ...item,
            status: "VERIFIED",
            evidence: item.evidence ?? `Operator verification logged at ${now}.`,
            lastVerified: now,
            staleHours: 0,
            currentMove: "Operation verified and evidence anchored in runtime.",
          }
        : item,
    ),
    events: [
      makeEvent(operationId, "verification", "Verification logged", `${operation.title} is verified.`, now),
      ...current.events,
    ],
  };
}

function escalateOperation(current: RuntimeState, operationId: string): RuntimeState {
  const now = formatRuntimeTime();
  const operation = current.operations.find((item) => item.id === operationId);
  if (!operation) {
    return current;
  }

  return {
    operations: current.operations.map((item) =>
      item.id === operationId
        ? {
            ...item,
            status: "BLOCKED",
            escalationTarget: item.escalationTarget ?? "Production lead",
            lastVerified: now,
            currentMove: "Escalation opened because the operation cannot legitimately move.",
          }
        : item,
    ),
    events: [
      makeEvent(operationId, "escalation", "Escalation opened", `${operation.title} now needs authority movement.`, now),
      ...current.events,
    ],
  };
}

function refreshOperation(current: RuntimeState, operationId: string): RuntimeState {
  const now = formatRuntimeTime();
  const operation = current.operations.find((item) => item.id === operationId);
  if (!operation) {
    return current;
  }

  return {
    operations: current.operations.map((item) =>
      item.id === operationId
        ? {
            ...item,
            status: "ACTIVE",
            lastVerified: now,
            staleHours: 0,
            currentMove: "Continuity refreshed; operation is active again.",
          }
        : item,
    ),
    events: [
      makeEvent(operationId, "refresh", "Continuity refreshed", `${operation.title} has a fresh runtime check.`, now),
      ...current.events,
    ],
  };
}

function nextExecutableStatus(current: RuntimeState, operationId: string): OperationStatus {
  const operation = current.operations.find((item) => item.id === operationId);

  if (!operation) {
    return "ACTIVE";
  }

  if (operation.status === "BLOCKED") {
    return "WAITING";
  }

  if (operation.status === "STALE") {
    return "ACTIVE";
  }

  if (operation.status === "VERIFIED") {
    return "ACTIVE";
  }

  return "VERIFIED";
}

function statusCopyForTransition(status: OperationStatus, operation: Operation): string {
  if (status === "WAITING") {
    return `Waiting on ${operation.authorityBoundary}`;
  }

  if (status === "BLOCKED") {
    return `Blocked by ${operation.dependency}`;
  }

  if (status === "STALE") {
    return "Continuity is stale and requires a refresh path.";
  }

  if (status === "VERIFIED") {
    return "Operation verified and evidence anchored in runtime.";
  }

  return operation.nextAction;
}

function makeEvent(
  operationId: string,
  kind: OperationEvent["kind"],
  label: string,
  reason: string,
  time: string,
): OperationEvent {
  return {
    id: `event-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind,
    label,
    operationId,
    reason,
    time,
  };
}
