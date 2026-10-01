"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { saveDraft, loadDraft, clearDraft, isSameContent, normalizeDraftContent } from "./draftStorage";

const SAVE_DELAY_MS = 1000;
const IDLE = { state: "idle" };

/**
 * Restores a step's local draft into the form and keeps it saved as the
 * student types. `baseline` is the last submitted content for this step
 * (undefined when never submitted, in which case the form defaults apply).
 *
 * status.state: "idle" | "saving" | "saved" | "unavailable"
 */
export function useDraftAutosave({ userId, slug, methods, baseline, defaults, enabled = true }) {
    const [{ status, restoredAt }, setDraftState] = useState({ status: IDLE, restoredAt: null });
    const setStatus = (next) => setDraftState((s) => ({
        ...s,
        status: typeof next === "function" ? next(s.status) : next,
    }));
    const setRestoredAt = (at) => setDraftState((s) => ({ ...s, restoredAt: at }));
    const timerRef = useRef(null);

    const cancelPending = () => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    };

    // Pick the starting content whenever the step, user or submitted answer changes.
    useEffect(() => {
        if (!enabled) return;
        cancelPending();
        const draft = userId ? loadDraft(userId, slug) : null;
        const useDraft = draft && !isSameContent(draft.content, baseline ?? defaults);
        if (useDraft) {
            methods.reset(draft.content);
        } else {
            if (draft) clearDraft(userId, slug);
            // Explicit values: a bare reset() would return to whatever was last reset, e.g. a draft.
            methods.reset(baseline ?? defaults);
        }
        // Mirrors what was just read from localStorage (an external store) into the banner.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraftState({ status: IDLE, restoredAt: useDraft ? draft.savedAt : null });
    }, [userId, slug, baseline, defaults, methods, enabled]);

    const saveNow = useCallback(() => {
        cancelPending();
        if (!userId) return;
        const values = normalizeDraftContent(methods.getValues());
        if (isSameContent(values, baseline ?? defaults)) {
            clearDraft(userId, slug);
            setStatus(IDLE);
            return;
        }
        const result = saveDraft(userId, slug, values);
        setStatus(result.ok ? { state: "saved", savedAt: result.savedAt } : { state: "unavailable" });
    }, [userId, slug, methods, baseline, defaults]);

    // Save shortly after the student stops typing; resets (no field name) are not edits.
    useEffect(() => {
        if (!enabled || !userId) return;
        const subscription = methods.watch((_values, { name }) => {
            if (!name) return;
            setStatus((s) => (s.state === "unavailable" ? s : { state: "saving" }));
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(saveNow, SAVE_DELAY_MS);
        });
        // Flush a pending save if the tab is hidden or closed before the delay ends.
        const flush = () => { if (timerRef.current) saveNow(); };
        const onVisibility = () => { if (document.visibilityState === "hidden") flush(); };
        window.addEventListener("pagehide", flush);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            subscription.unsubscribe();
            flush();
            window.removeEventListener("pagehide", flush);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [enabled, userId, methods, saveNow]);

    // Called after a successful submit: the server copy is now the source of truth.
    const clear = useCallback(() => {
        cancelPending();
        if (userId) clearDraft(userId, slug);
        setDraftState({ status: IDLE, restoredAt: null });
    }, [userId, slug]);

    const discardDraft = useCallback(() => {
        clear();
        methods.reset(baseline ?? defaults);
    }, [clear, baseline, defaults, methods]);

    return { status, restoredAt, clear, discardDraft, dismissRestored: () => setRestoredAt(null) };
}
