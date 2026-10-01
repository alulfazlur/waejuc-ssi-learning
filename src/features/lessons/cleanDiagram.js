// Keeps only the diagram fields worth persisting; React Flow adds runtime
// fields (measured, selected, dragging, ...) that should not be saved.
export const cleanDiagram = (diagram) => {
    if (!diagram || typeof diagram !== 'object') return diagram;
    return {
        nodes: (diagram.nodes ?? []).map(n => ({
            id: n.id,
            position: n.position,
            data: n.data,
            ...(n.style ? { style: n.style } : {}),
        })),
        edges: (diagram.edges ?? []).map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            ...(e.sourceHandle ? { sourceHandle: e.sourceHandle } : {}),
            ...(e.targetHandle ? { targetHandle: e.targetHandle } : {}),
            data: e.data,
            label: e.label,
        })),
    };
};
