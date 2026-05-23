/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import {
    ReactFlow,
    Controls,
    Background,
    BackgroundVariant,
    Panel,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
    Handle,
    Position,
    ConnectionMode,
} from "@xyflow/react";
import { useController } from "react-hook-form";
import { Plus, Trash2, Sparkles, Undo2, Redo2, RotateCcw } from "lucide-react";
import "@xyflow/react/dist/style.css";
import { useTranslation } from "react-i18next";
import Button from "@components/Button";

/* ---------------- Custom Node ---------------- */

function CausalNode({ data, selected }) {
    const handles = [
        { id: "t", pos: Position.Top },
        { id: "r", pos: Position.Right },
        { id: "b", pos: Position.Bottom },
        { id: "l", pos: Position.Left },
    ];
    return (
        <div
            className={`
                relative group px-4 py-2.5 rounded-xl
                bg-linear-to-br from-(--background) via-(--background) to-(--secondary)/5
                border-2 transition-all duration-200 cursor-grab active:cursor-grabbing
                ${selected
                    ? "border-(--secondary) shadow-lg shadow-(--secondary)/20 scale-[1.04]"
                    : "border-(--border) shadow-sm hover:border-(--secondary)/40 hover:shadow-md"
                }
            `}
        >
            <span className="text-xs font-bold text-(--primary) whitespace-nowrap select-none">
                {data.label}
            </span>
            {handles.map(({ id, pos }) => (
                <Handle
                    key={id}
                    id={id}
                    type="source"
                    position={pos}
                    className="w-2.5! h-2.5! bg-(--secondary)! border-2! border-(--background)! opacity-40! group-hover:opacity-100! transition-opacity duration-200"
                />
            ))}
        </div>
    );
}

const nodeTypes = { causal: CausalNode };

/* ---------------- Edge factory + hydration ---------------- */

const EDGE_COLORS = {
    "+": { stroke: "#10b981", bg: "#d1fae5", text: "#065f46" },
    "-": { stroke: "#ef4444", bg: "#fee2e2", text: "#991b1b" },
};

const makeEdge = ({ id, source, target, sourceHandle, targetHandle }, relation) => {
    const c = EDGE_COLORS[relation] ?? EDGE_COLORS["+"];
    return {
        id: id ?? `e-${source}-${target}-${Date.now()}`,
        source, target, sourceHandle, targetHandle,
        type: "smoothstep",
        label: relation,
        labelStyle: { fill: c.text, fontWeight: 900, fontSize: 13 },
        labelBgStyle: { fill: c.bg, stroke: c.stroke, strokeWidth: 1.5 },
        labelBgPadding: [10, 10],
        labelBgBorderRadius: 14,
        animated: true,
        style: { stroke: c.stroke, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: c.stroke, width: 20, height: 20 },
        data: { relation },
    };
};

const hydrateEdge = (e) => {
    if (e.style && e.markerEnd) return e;
    const relation = e.data?.relation ?? e.label ?? "+";
    return makeEdge({
        id: e.id, source: e.source, target: e.target,
        sourceHandle: e.sourceHandle, targetHandle: e.targetHandle,
    }, relation);
};

const hydrateNode = (n) => {
    if (n.type === "causal" && !n.style) return n;
    const { style, ...rest } = n; // eslint-disable-line no-unused-vars
    return { ...rest, type: "causal" };
};

// Strip runtime/UI-only props sebelum disimpan ke history
const stripRuntime = (item) => {
    const { selected, dragging, ...rest } = item; // eslint-disable-line no-unused-vars
    return rest;
};

/* ---------------- Defaults ---------------- */

// const DEFAULT_NODES = [
//     { id: "1", type: "causal", position: { x: 60, y: 130 }, data: { label: "Sampah Plastik" } },
//     { id: "2", type: "causal", position: { x: 320, y: 60 }, data: { label: "Mikroplastik" } },
//     { id: "3", type: "causal", position: { x: 320, y: 210 }, data: { label: "Ekosistem Laut" } },
// ];

const HISTORY_LIMIT = 50;

/* ---------------- Modals ---------------- */

function RelationModal({ open, onConfirm, onCancel }) {
    const [rel, setRel] = useState("+");
    useEffect(() => { if (open) setRel("+"); }, [open]);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onCancel}>
            <div className="bg-(--card) border border-(--border) rounded-2xl shadow-2xl p-6 w-80 max-w-[90vw] animate-in fade-in zoom-in-95 duration-150"
                onClick={e => e.stopPropagation()}>
                <h3 className="text-sm font-bold text-(--primary) mb-1">Tentukan Hubungan</h3>
                <p className="text-xs text-(--muted) mb-4">Bagaimana pengaruh variabel asal terhadap tujuan?</p>
                <div className="grid grid-cols-1 gap-2.5 mb-5">
                    {[
                        { val: "+", label: "Searah (+)", sub: "Asal naik → Tujuan ikut naik", emerald: true },
                        { val: "-", label: "Berbalik (−)", sub: "Asal naik → Tujuan justru turun", emerald: false },
                    ].map(({ val, label, sub, emerald }) => {
                        const sel = rel === val;
                        return (
                            <button key={val} type="button" onClick={() => setRel(val)}
                                className={`rounded-xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${sel
                                    ? (emerald
                                        ? "ring-2 ring-emerald-500/30 border-emerald-500 bg-emerald-500/5"
                                        : "ring-2 ring-red-500/30 border-red-500 bg-red-500/5")
                                    : "border-(--border) bg-(--background)/30 hover:bg-(--background)/80"
                                    }`}>
                                <div className="flex items-center gap-2">
                                    <span className={`text-2xl font-black ${emerald ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{val}</span>
                                    <span className="text-xs font-bold text-(--primary)">{label}</span>
                                </div>
                                <span className="block text-[11px] text-(--muted) mt-1 pl-5">{sub}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="flex gap-2 justify-end">
                    <Button type="button" color="ghost" size="sm" onClick={onCancel} className="shadow-none hover:shadow-none bg-transparent">Batal</Button>
                    <Button type="button" color="primary" size="sm" onClick={() => onConfirm(rel)}>Hubungkan</Button>
                </div>
            </div>
        </div>
    );
}

function AddNodeModal({ open, onConfirm, onCancel }) {
    const [val, setVal] = useState("");
    useEffect(() => { if (open) setVal(""); }, [open]);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onCancel}>
            <div className="bg-(--card) border border-(--border) rounded-2xl shadow-2xl p-6 w-80 max-w-[90vw] animate-in fade-in zoom-in-95 duration-150"
                onClick={e => e.stopPropagation()}>
                <h3 className="text-sm font-bold text-(--primary) mb-1">Tambah Variabel</h3>
                <p className="text-xs text-(--muted) mb-4">Masukkan faktor/parameter baru.</p>
                <input autoFocus type="text" value={val} maxLength={40}
                    onChange={e => setVal(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && val.trim() && onConfirm(val.trim())}
                    placeholder="Contoh: Akumulasi Toksin..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-(--border) bg-(--background) text-(--primary) placeholder:text-(--muted) focus:outline-none focus:ring-2 focus:ring-(--secondary)/30 mb-4"
                />
                <div className="flex gap-2 justify-end">
                    <Button type="button" color="ghost" size="sm" onClick={onCancel} className="shadow-none hover:shadow-none bg-transparent">Batal</Button>
                    <Button type="button" color="primary" size="sm" onClick={() => val.trim() && onConfirm(val.trim())} disabled={!val.trim()}>Simpan</Button>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Toolbar Button ---------------- */

function ToolBtn({ icon: Icon, onClick, disabled, title, danger }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed
                ${danger
                    ? "text-red-600 hover:bg-red-500/10"
                    : "text-(--primary) hover:bg-(--secondary)/10"
                }`}
        >
            <Icon size={14} />
        </button>
    );
}

/* ---------------- Main ---------------- */

export default function DiagramInput({ name, control, errors, label, defaultNodes }) {
    const { t } = useTranslation();
    const fallbackRef = useRef({ nodes: defaultNodes ?? [], edges: [] });
    const { field } = useController({ name, control, defaultValue: fallbackRef.current });

    const [nodes, setNodes, onNodesChange] = useNodesState(() => {
        const v = field.value;
        if (v && Array.isArray(v.nodes) && v.nodes.length > 0) return v.nodes.map(hydrateNode);
        return fallbackRef.current.nodes;
    });
    const [edges, setEdges, onEdgesChange] = useEdgesState(() => {
        const v = field.value;
        if (v && Array.isArray(v.edges)) return v.edges.map(hydrateEdge);
        return [];
    });
    const [selected, setSelected] = useState(null);
    const [pendingConn, setPendingConn] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // History
    const historyRef = useRef([]);
    const futureRef = useRef([]);
    const [historyVersion, setHistoryVersion] = useState(0); // trigger re-render saat history berubah
    const canUndo = historyRef.current.length > 0;
    const canRedo = futureRef.current.length > 0;

    // Refs for latest values (untuk keyboard handler)
    const nodesRef = useRef(nodes);
    const edgesRef = useRef(edges);
    const selectedRef = useRef(selected);
    useEffect(() => {
        nodesRef.current = nodes;
        edgesRef.current = edges;
        selectedRef.current = selected;
    }, [nodes, edges, selected]);

    const skipNextSync = useRef(false);

    // local → form
    useEffect(() => {
        skipNextSync.current = true;
        field.onChange({ nodes, edges });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, edges]);

    // form → local
    useEffect(() => {
        if (skipNextSync.current) {
            skipNextSync.current = false;
            return;
        }
        if (!field.value || !Array.isArray(field.value.nodes)) return;
        setNodes(field.value.nodes.map(hydrateNode));
        setEdges((Array.isArray(field.value.edges) ? field.value.edges : []).map(hydrateEdge));
        // Reset external = clear history
        historyRef.current = [];
        futureRef.current = [];
        setHistoryVersion(v => v + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.value]);

    /* ---------------- History ops ---------------- */

    const pushHistory = useCallback(() => {
        historyRef.current = [
            ...historyRef.current,
            { nodes: nodesRef.current.map(stripRuntime), edges: edgesRef.current.map(stripRuntime) },
        ].slice(-HISTORY_LIMIT);
        futureRef.current = [];
        setHistoryVersion(v => v + 1);
    }, []);

    const undo = useCallback(() => {
        if (historyRef.current.length === 0) return;
        const prev = historyRef.current[historyRef.current.length - 1];
        historyRef.current = historyRef.current.slice(0, -1);
        futureRef.current = [
            ...futureRef.current,
            { nodes: nodesRef.current.map(stripRuntime), edges: edgesRef.current.map(stripRuntime) },
        ];
        setNodes(prev.nodes);
        setEdges(prev.edges);
        setSelected(null);
        setHistoryVersion(v => v + 1);
    }, [setNodes, setEdges]);

    const redo = useCallback(() => {
        if (futureRef.current.length === 0) return;
        const next = futureRef.current[futureRef.current.length - 1];
        futureRef.current = futureRef.current.slice(0, -1);
        historyRef.current = [
            ...historyRef.current,
            { nodes: nodesRef.current.map(stripRuntime), edges: edgesRef.current.map(stripRuntime) },
        ];
        setNodes(next.nodes);
        setEdges(next.edges);
        setSelected(null);
        setHistoryVersion(v => v + 1);
    }, [setNodes, setEdges]);

    const handleReset = useCallback(() => {
        pushHistory();
        setNodes(fallbackRef.current.nodes);
        setEdges([]);
        setSelected(null);
    }, [pushHistory, setNodes, setEdges]);

    /* ---------------- Actions ---------------- */

    const onConnect = useCallback((params) => setPendingConn(params), []);

    const confirmRelation = (relation) => {
        pushHistory();
        setEdges(eds => addEdge(makeEdge(pendingConn, relation), eds));
        setPendingConn(null);
    };

    const confirmAddNode = (labelText) => {
        pushHistory();
        setNodes(nds => nds.concat({
            id: `node-${Date.now()}`,
            type: "causal",
            position: { x: 140 + Math.random() * 80, y: 140 + Math.random() * 80 },
            data: { label: labelText },
        }));
        setShowAddModal(false);
    };

    const deleteSelected = useCallback(() => {
        const sel = selectedRef.current;
        if (!sel) return;
        pushHistory();
        if (sel.type === "edge") setEdges(eds => eds.filter(e => e.id !== sel.id));
        else {
            setNodes(nds => nds.filter(n => n.id !== sel.id));
            setEdges(eds => eds.filter(e => e.source !== sel.id && e.target !== sel.id));
        }
        setSelected(null);
    }, [pushHistory, setNodes, setEdges]);

    const onNodeDragStart = useCallback(() => {
        pushHistory();
    }, [pushHistory]);

    /* ---------------- Keyboard shortcuts ---------------- */

    // Refs to latest handlers (biar keyboard listener tetap akses versi terbaru)
    const handlersRef = useRef({});
    handlersRef.current = { undo, redo, deleteSelected };

    useEffect(() => {
        const onKeyDown = (e) => {
            const ae = document.activeElement;
            const tag = ae?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || ae?.isContentEditable) return;

            const isMod = e.metaKey || e.ctrlKey;

            if (isMod && e.key.toLowerCase() === "z") {
                e.preventDefault();
                if (e.shiftKey) handlersRef.current.redo();
                else handlersRef.current.undo();
                return;
            }
            if (isMod && e.key.toLowerCase() === "y") {
                e.preventDefault();
                handlersRef.current.redo();
                return;
            }
            if ((e.key === "Delete" || e.key === "Backspace") && selectedRef.current) {
                e.preventDefault();
                handlersRef.current.deleteSelected();
                return;
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    /* ---------------- Render ---------------- */

    const fieldError = errors?.[name];
    const errorMessage = fieldError?.message ?? fieldError?.nodes?.message ?? fieldError?.edges?.message;
    const hasError = !!fieldError;

    return (
        <>
            <div className={`space-y-2 ${hasError ? "ring-1 ring-red-400 rounded-2xl p-1" : ""}`}>
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        {label && <p className="text-sm font-semibold text-(--primary)">{label}</p>}
                        <p className="text-xs text-(--muted) mt-0.5">
                            {t("qualitative.diagram_input.hints")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {selected && (
                            <Button size="sm" onClick={deleteSelected}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-red-50 hover:bg-red-500/10 text-red-700 border border-red-200 font-semibold shadow-none hover:shadow-none">
                                <Trash2 size={13} /> {t("qualitative.diagram_input.delete")}
                            </Button>
                        )}
                        <Button size="sm" onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-(--primary) text-(--background) font-semibold">
                            <Plus size={13} /> {t("qualitative.diagram_input.add_variable")}
                        </Button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="relative w-full h-115 border border-(--border) rounded-2xl overflow-hidden bg-linear-to-br from-(--secondary)/5 via-(--background) to-(--secondary)/15 shadow-inner">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={(_, n) => setSelected({ type: "node", id: n.id })}
                        onEdgeClick={(_, e) => setSelected({ type: "edge", id: e.id })}
                        onPaneClick={() => setSelected(null)}
                        onNodeDragStart={onNodeDragStart}
                        connectionMode={ConnectionMode.Loose}
                        connectionLineType="smoothstep"
                        connectionLineStyle={{ stroke: "var(--secondary)", strokeWidth: 2, strokeDasharray: "5 5" }}
                        defaultEdgeOptions={{ animated: true }}
                        fitView
                        fitViewOptions={{ padding: 0.25 }}
                        deleteKeyCode={null} /* kita handle sendiri */
                    >
                        {/* Floating Toolbar */}
                        <Panel position="top-left">
                            <div
                                className="flex items-center gap-0.5 bg-(--card)/95 backdrop-blur border border-(--border) rounded-xl shadow-md p-1"
                                key={historyVersion} /* force rerender on history change */
                            >
                                <ToolBtn icon={Undo2} onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" />
                                <ToolBtn icon={Redo2} onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" />
                                <div className="w-px h-4 bg-(--border) mx-1" />
                                <ToolBtn icon={RotateCcw} onClick={handleReset} title="Reset" danger />
                            </div>
                        </Panel>

                        <Controls
                            position="bottom-right"
                            showInteractive={false}
                            className="bg-(--card)! border! border-(--border)! rounded-xl! shadow-lg! overflow-hidden! [&>button]:bg-transparent! [&>button]:border-(--border)! [&>button]:text-(--primary)! [&>button>svg]:fill-(--primary)! [&>button:hover]:bg-(--secondary)/10!"
                        />
                        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="var(--muted)" className="opacity-30" />
                    </ReactFlow>
                </div>

                {/* Hint Bar */}
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-(--secondary)/5 border border-(--border) text-xs flex-wrap">
                    <Sparkles size={13} className="shrink-0 text-(--secondary)" />
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        + {t("qualitative.diagram_input.positive")}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        − {t("qualitative.diagram_input.negative")}
                    </span>
                    <span className="text-(--muted) ml-2 hidden sm:inline">
                        <kbd className="px-1.5 py-0.5 rounded bg-(--background) border border-(--border) text-[10px] font-mono">Del</kbd> {t("qualitative.diagram_input.delete")} &middot;{" "}
                        <kbd className="px-1.5 py-0.5 rounded bg-(--background) border border-(--border) text-[10px] font-mono">Ctrl+Z</kbd> Undo
                    </span>
                    <span className="ml-auto font-semibold text-(--primary)/70">
                        {nodes.length} {t("qualitative.diagram_input.variable")} &bull; {edges.length}  {t("qualitative.diagram_input.relation")}
                    </span>
                </div>

                {/* Error */}
                {hasError && errorMessage && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <span className="inline-flex w-3 h-3 rounded-full bg-red-500 text-white text-[9px] font-bold items-center justify-center">!</span>
                        {errorMessage}
                    </p>
                )}
            </div>

            <RelationModal open={!!pendingConn} onConfirm={confirmRelation} onCancel={() => setPendingConn(null)} />
            <AddNodeModal open={showAddModal} onConfirm={confirmAddNode} onCancel={() => setShowAddModal(false)} />
        </>
    );
}