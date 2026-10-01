// Per-user, per-step answer drafts kept in the browser so unsent work survives
// reloads. Drafts never touch Supabase: a row in student_responses unlocks the
// next step, so only a real submit may write there.
import isEqual from "lodash/isEqual.js";
import { cleanDiagram } from "./cleanDiagram.js";

const PREFIX = "waves-ssi:draft:v1";

export const draftKey = (userId, slug) => `${PREFIX}:${userId}:${slug}`;

// Reading window.localStorage itself throws when site data is blocked.
const resolveStorage = (storage) => {
    if (storage !== undefined) return storage;
    try {
        return typeof window !== "undefined" ? window.localStorage : null;
    } catch {
        return null;
    }
};

export function saveDraft(userId, slug, content, { storage, now = Date.now } = {}) {
    const store = resolveStorage(storage);
    if (!store) return { ok: false, reason: "unavailable" };
    const savedAt = now();
    try {
        store.setItem(draftKey(userId, slug), JSON.stringify({ savedAt, content }));
        return { ok: true, savedAt };
    } catch (err) {
        return { ok: false, reason: err?.name || err?.message || "error" };
    }
}

export function loadDraft(userId, slug, { storage } = {}) {
    const store = resolveStorage(storage);
    if (!store) return null;
    let raw;
    try {
        raw = store.getItem(draftKey(userId, slug));
    } catch {
        return null;
    }
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || !parsed.content) return null;
        return { savedAt: parsed.savedAt, content: parsed.content };
    } catch {
        clearDraft(userId, slug, { storage: store });
        return null;
    }
}

export function clearDraft(userId, slug, { storage } = {}) {
    const store = resolveStorage(storage);
    if (!store) return;
    try {
        store.removeItem(draftKey(userId, slug));
    } catch {
        // Nothing to clean up if storage is blocked.
    }
}

const isDiagram = (v) =>
    v && typeof v === "object" && !Array.isArray(v) && Array.isArray(v.nodes);

const normalize = (content) => {
    if (!content || typeof content !== "object") return content;
    return Object.fromEntries(
        Object.entries(content).map(([k, v]) => [k, isDiagram(v) ? cleanDiagram(v) : v])
    );
};

export const isSameContent = (a, b) => isEqual(normalize(a), normalize(b));
