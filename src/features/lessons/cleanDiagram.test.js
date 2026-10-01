import test from "node:test";
import assert from "node:assert/strict";
import { cleanDiagram } from "./cleanDiagram.js";

test("cleanDiagram keeps persisted fields and drops React Flow runtime fields", () => {
    const diagram = {
        nodes: [{
            id: "n1", position: { x: 1, y: 2 }, data: { label: "Ikan" }, style: { width: 120 },
            measured: { width: 120, height: 40 }, selected: true, dragging: false, type: "custom",
        }],
        edges: [{
            id: "e1", source: "n1", target: "n2", sourceHandle: "r", targetHandle: "l",
            data: { relation: "-" }, label: "-", selected: true, animated: true,
        }],
    };
    assert.deepEqual(cleanDiagram(diagram), {
        nodes: [{ id: "n1", position: { x: 1, y: 2 }, data: { label: "Ikan" }, style: { width: 120 } }],
        edges: [{ id: "e1", source: "n1", target: "n2", sourceHandle: "r", targetHandle: "l", data: { relation: "-" }, label: "-" }],
    });
});

test("cleanDiagram omits empty optional fields and tolerates missing arrays", () => {
    assert.deepEqual(cleanDiagram({ nodes: [{ id: "a", position: { x: 0, y: 0 }, data: {} }] }), {
        nodes: [{ id: "a", position: { x: 0, y: 0 }, data: {} }],
        edges: [],
    });
});

test("cleanDiagram returns non-objects unchanged", () => {
    assert.equal(cleanDiagram(null), null);
    assert.equal(cleanDiagram(undefined), undefined);
});
