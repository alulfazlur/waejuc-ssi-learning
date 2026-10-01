import test from "node:test";
import assert from "node:assert/strict";
import { draftKey, saveDraft, loadDraft, clearDraft, isSameContent } from "./draftStorage.js";

const memoryStorage = () => {
    const map = new Map();
    return {
        getItem: (k) => (map.has(k) ? map.get(k) : null),
        setItem: (k, v) => map.set(k, String(v)),
        removeItem: (k) => map.delete(k),
        map,
    };
};

const throwingStorage = () => ({
    getItem: () => { throw new Error("SecurityError"); },
    setItem: () => { throw new Error("QuotaExceededError"); },
    removeItem: () => { throw new Error("SecurityError"); },
});

test("draftKey is scoped per user and per step", () => {
    assert.equal(draftKey("u1", "initial"), "waves-ssi:draft:v1:u1:initial");
    assert.notEqual(draftKey("u1", "initial"), draftKey("u2", "initial"));
    assert.notEqual(draftKey("u1", "initial"), draftKey("u1", "decision"));
});

test("saveDraft then loadDraft round-trips content with a timestamp", () => {
    const storage = memoryStorage();
    const content = { initial_main_issue_analysis: "<p>Isu</p>" };
    const result = saveDraft("u1", "initial", content, { storage, now: () => 1000 });
    assert.deepEqual(result, { ok: true, savedAt: 1000 });
    assert.deepEqual(loadDraft("u1", "initial", { storage }), { savedAt: 1000, content });
});

test("loadDraft does not leak drafts between users or steps", () => {
    const storage = memoryStorage();
    saveDraft("u1", "initial", { a: 1 }, { storage });
    assert.equal(loadDraft("u2", "initial", { storage }), null);
    assert.equal(loadDraft("u1", "decision", { storage }), null);
});

test("loadDraft returns null and removes the key when stored JSON is corrupt", () => {
    const storage = memoryStorage();
    storage.setItem(draftKey("u1", "initial"), "{not json");
    assert.equal(loadDraft("u1", "initial", { storage }), null);
    assert.equal(storage.map.has(draftKey("u1", "initial")), false);
});

test("loadDraft returns null for a well-formed value without content", () => {
    const storage = memoryStorage();
    storage.setItem(draftKey("u1", "initial"), JSON.stringify({ savedAt: 1 }));
    assert.equal(loadDraft("u1", "initial", { storage }), null);
});

test("clearDraft removes only that step's draft", () => {
    const storage = memoryStorage();
    saveDraft("u1", "initial", { a: 1 }, { storage });
    saveDraft("u1", "decision", { b: 2 }, { storage });
    clearDraft("u1", "initial", { storage });
    assert.equal(loadDraft("u1", "initial", { storage }), null);
    assert.notEqual(loadDraft("u1", "decision", { storage }), null);
});

test("storage failures are reported instead of thrown", () => {
    const storage = throwingStorage();
    const result = saveDraft("u1", "initial", { a: 1 }, { storage });
    assert.equal(result.ok, false);
    assert.equal(typeof result.reason, "string");
    assert.equal(loadDraft("u1", "initial", { storage }), null);
    assert.doesNotThrow(() => clearDraft("u1", "initial", { storage }));
});

test("missing storage is reported as unavailable", () => {
    assert.deepEqual(saveDraft("u1", "initial", { a: 1 }, { storage: null }), { ok: false, reason: "unavailable" });
    assert.equal(loadDraft("u1", "initial", { storage: null }), null);
});

test("isSameContent compares HTML, tables and ratings by value", () => {
    const a = {
        initial_main_issue_analysis: "<p>Isu</p>",
        decision_strategy: [{ name: "A", role: "B" }],
        reflection_website: 4,
    };
    assert.equal(isSameContent(a, structuredClone(a)), true);
    assert.equal(isSameContent(a, { ...a, initial_main_issue_analysis: "<p>Isu lain</p>" }), false);
    assert.equal(isSameContent(a, { ...a, decision_strategy: [{ name: "A", role: "C" }] }), false);
    assert.equal(isSameContent(a, { ...a, reflection_website: 5 }), false);
});

test("isSameContent ignores React Flow runtime fields in diagrams", () => {
    const saved = {
        qual_analysis_anomaly_diagram: {
            nodes: [{ id: "n1", position: { x: 0, y: 0 }, data: { label: "Plastik" } }],
            edges: [{ id: "e1", source: "n1", target: "n2", data: { relation: "+" }, label: "+" }],
        },
    };
    const live = {
        qual_analysis_anomaly_diagram: {
            nodes: [{ ...saved.qual_analysis_anomaly_diagram.nodes[0], measured: { width: 80, height: 40 }, selected: true, dragging: false }],
            edges: [{ ...saved.qual_analysis_anomaly_diagram.edges[0], selected: false }],
        },
    };
    assert.equal(isSameContent(saved, live), true);

    const moved = structuredClone(live);
    moved.qual_analysis_anomaly_diagram.nodes[0].position = { x: 10, y: 0 };
    assert.equal(isSameContent(saved, moved), false);
});

test("isSameContent treats null baseline as different from any draft", () => {
    assert.equal(isSameContent(null, { a: 1 }), false);
    assert.equal(isSameContent(null, null), true);
});
