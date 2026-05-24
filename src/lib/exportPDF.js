// lib/exportPDF.js
// ==========================================================================
// Helpers
// ==========================================================================
const escapeHTML = (str) => {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const tr = (t, key, fallback = '') => {
    if (!key) return fallback;
    const result = t(key, { defaultValue: fallback || key });
    return result === key && fallback ? fallback : result;
};

const getUserName = (user) =>
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'student';

const isEmpty = (v) => {
    if (v == null) return true;
    if (typeof v === 'string') {
        const stripped = v.replace(/<[^>]*>/g, '').trim();
        return stripped.length === 0;
    }
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === 'object') return Object.keys(v).length === 0;
    return false;
};

const pickValue = (row, col) => {
    let v = row?.[col.key];
    if (isEmpty(v) && col.fallbackKey) v = row?.[col.fallbackKey];
    return v;
};

// ==========================================================================
// Export structure (steps 1-5)
// ==========================================================================
export const EXPORT_STRUCTURE = [
    {
        slugKey: 'initial',
        titleKey: 'syllabus.initial',
        fields: [
            {
                name: 'initial_main_issue_analysis',
                titleKey: 'initial.issue_title',
                descKey: 'initial.issue_description',
                type: 'rich',
            },
            {
                name: 'initial_source_analysis',
                titleKey: 'initial.plastic_identification',
                descKey: 'initial.source_question',
                type: 'rich',
            },
            {
                name: 'initial_awareness_analysis',
                descKey: 'initial.awareness_question',
                type: 'rich',
            },
            {
                name: 'initial_component_ecosystem',
                titleKey: 'initial.component_ecosystem.title',
                descKey: 'initial.component_ecosystem.description',
                type: 'table',
                columns: [
                    { key: 'component', labelKey: 'initial.table_component.headers.0', type: 'text' },
                    {
                        key: 'type',
                        labelKey: 'initial.table_component.headers.1',
                        type: 'mapped',
                        mapKeys: {
                            Biotic: 'initial.table_component.biotic',
                            Abiotic: 'initial.table_component.abiotic',
                        },
                    },
                    { key: 'role', labelKey: 'initial.table_component.headers.2', type: 'text' },
                ],
            },
            {
                name: 'initial_component_ecosystem_analysis',
                descKey: 'initial.component_ecosystem.question',
                type: 'rich',
            },
        ],
    },
    {
        slugKey: 'qualitative',
        titleKey: 'syllabus.qualitative',
        fields: [
            {
                name: 'qual_analysis_anomaly_diagram',
                titleKey: 'qualitative.analysis.q1_title',
                descKey: 'qualitative.analysis.q2_step1',
                type: 'diagram',
            },
            {
                name: 'qual_analysis_anomaly_behaviour',
                descKey: 'qualitative.analysis.q2_step2',
                type: 'rich',
            },
            {
                name: 'qual_analysis_microplastic_risk',
                descKey: 'qualitative.analysis.q2_step3',
                type: 'rich',
            },
        ],
    },
    {
        slugKey: 'quantitative',
        titleKey: 'syllabus.quantitative',
        fields: [
            {
                name: 'quant_estuary_concentration',
                titleKey: 'quantitative.questions.q1_title',
                descKey: 'quantitative.questions.q1_desc',
                type: 'rich',
            },
            {
                name: 'quant_exposure_estimation',
                titleKey: 'quantitative.questions.q2_title',
                descKey: 'quantitative.questions.q2_desc',
                type: 'rich',
            },
            {
                name: 'quant_consump_exposure',
                titleKey: 'quantitative.questions.q3_title',
                descKey: 'quantitative.questions.q3_desc',
                type: 'rich',
            },
            {
                name: 'quant_consump_limit',
                titleKey: 'quantitative.questions.q4_title',
                descKey: 'quantitative.questions.q4_desc',
                type: 'rich',
            },
            {
                name: 'quant_concept_app',
                titleKey: 'quantitative.questions.q5_title',
                descKey: 'quantitative.questions.q5_desc',
                type: 'rich',
            },
        ],
    },
    {
        slugKey: 'explanation',
        titleKey: 'syllabus.explanation',
        fields: [
            {
                name: 'explain_estimation_physical_factor',
                descKey: 'explanation.question.estimation_physical_factor',
                type: 'rich',
            },
            {
                name: 'explain_human_digestion',
                descKey: 'explanation.question.human_digestion',
                type: 'rich',
            },
            {
                name: 'explain_health_impact',
                descKey: 'explanation.question.health_impact',
                type: 'rich',
            },
            {
                name: 'explain_causal_loop',
                titleKey: 'explanation.causal_loop.title',
                descKey: 'explanation.causal_loop.desc',
                type: 'diagram',
            },
        ],
    },
    {
        slugKey: 'decision',
        titleKey: 'syllabus.decision',
        fields: [
            {
                name: 'decision_strategy',
                descKey: 'decision.instruction',
                type: 'card_list',
                primary: [
                    {
                        key: 'component',
                        fallbackKey: 'name',
                        labelKey: 'decision.table_component.headers.0',
                        type: 'text',
                    },
                    {
                        key: 'role',
                        labelKey: 'decision.table_component.headers.1',
                        type: 'mapped',
                        mapKeys: {
                            fisherman: 'decision.table_component.roles.0',
                            seller: 'decision.table_component.roles.1',
                            government: 'decision.table_component.roles.2',
                        },
                    },
                ],
                blocks: [
                    {
                        key: 'solution',
                        labelKey: 'decision.table_component.headers.2',
                        type: 'rich',
                    },
                    {
                        key: 'economy_impact',
                        labelKey: 'decision.table_component.economy_impact.title',
                        type: 'rich',
                    },
                    {
                        key: 'env_impact',
                        labelKey: 'decision.table_component.env_impact.title',
                        type: 'rich',
                    },
                ],
            },
            {
                name: 'decision_conclusion',
                titleKey: 'decision.conclusion.title',
                type: 'rich',
            },
        ],
    },
];

// ==========================================================================
// Diagram renderer (SVG, mirror @xyflow/react CausalNode visual)
// ==========================================================================
const NODE_HEIGHT = 38;
const NODE_MIN_WIDTH = 110;
const NODE_MAX_WIDTH = 260;

const measureNodeWidth = (label) => {
    const charWidth = 7;
    const padding = 28;
    const len = (label || '').length;
    return Math.max(NODE_MIN_WIDTH, Math.min(NODE_MAX_WIDTH, len * charWidth + padding));
};

const truncateLabel = (label, maxChars = 30) => {
    const s = String(label || '');
    return s.length <= maxChars ? s : s.slice(0, maxChars - 1) + '…';
};

const getHandlePoint = (node, handle) => {
    switch (handle) {
        case 't': return { x: node.x + node.width / 2, y: node.y };
        case 'b': return { x: node.x + node.width / 2, y: node.y + node.height };
        case 'l': return { x: node.x, y: node.y + node.height / 2 };
        case 'r': return { x: node.x + node.width, y: node.y + node.height / 2 };
        default: return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
    }
};

const getNearestSide = (fromNode, toCenter) => {
    const cx = fromNode.x + fromNode.width / 2;
    const cy = fromNode.y + fromNode.height / 2;
    const dx = toCenter.x - cx;
    const dy = toCenter.y - cy;
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'r' : 'l';
    return dy > 0 ? 'b' : 't';
};

const renderDiagram = (diagram) => {
    if (!diagram || typeof diagram !== 'object') {
        return '<p style="color:#94a3b8;font-style:italic;margin:0">(No diagram)</p>';
    }
    const rawNodes = Array.isArray(diagram.nodes) ? diagram.nodes : [];
    const rawEdges = Array.isArray(diagram.edges) ? diagram.edges : [];
    if (rawNodes.length === 0) {
        return '<p style="color:#94a3b8;font-style:italic;margin:0">(No diagram)</p>';
    }

    const nodes = rawNodes.map((n) => {
        const label = String(n?.data?.label || n.id || '');
        return {
            id: n.id,
            x: n.position?.x ?? 0,
            y: n.position?.y ?? 0,
            width: measureNodeWidth(label),
            height: NODE_HEIGHT,
            label,
        };
    });

    const PADDING = 50;
    const minX = Math.min(...nodes.map((n) => n.x));
    const minY = Math.min(...nodes.map((n) => n.y));
    const maxX = Math.max(...nodes.map((n) => n.x + n.width));
    const maxY = Math.max(...nodes.map((n) => n.y + n.height));
    const width = maxX - minX + PADDING * 2;
    const height = maxY - minY + PADDING * 2;
    const offsetX = PADDING - minX;
    const offsetY = PADDING - minY;

    nodes.forEach((n) => {
        n.x += offsetX;
        n.y += offsetY;
    });
    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

    const defs = `
      <defs>
        <marker id="arr-pos" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#10b981"/>
        </marker>
        <marker id="arr-neg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#ef4444"/>
        </marker>
      </defs>
    `;

    const edgesSvg = rawEdges
        .map((e) => {
            const source = nodeMap[e.source];
            const target = nodeMap[e.target];
            if (!source || !target) return '';

            const sourceCenter = { x: source.x + source.width / 2, y: source.y + source.height / 2 };
            const targetCenter = { x: target.x + target.width / 2, y: target.y + target.height / 2 };

            const sHandle = e.sourceHandle || getNearestSide(source, targetCenter);
            const tHandle = e.targetHandle || getNearestSide(target, sourceCenter);

            const sp = getHandlePoint(source, sHandle);
            const tp = getHandlePoint(target, tHandle);

            const relation = e?.data?.relation || e?.label || '+';
            const isPos = relation !== '-';
            const color = isPos ? '#10b981' : '#ef4444';
            const bg = isPos ? '#d1fae5' : '#fee2e2';
            const markerId = isPos ? 'arr-pos' : 'arr-neg';

            const ctrlOffset = 50;
            const cp1 = { ...sp };
            const cp2 = { ...tp };
            if (sHandle === 't') cp1.y -= ctrlOffset;
            else if (sHandle === 'b') cp1.y += ctrlOffset;
            else if (sHandle === 'l') cp1.x -= ctrlOffset;
            else cp1.x += ctrlOffset;

            if (tHandle === 't') cp2.y -= ctrlOffset;
            else if (tHandle === 'b') cp2.y += ctrlOffset;
            else if (tHandle === 'l') cp2.x -= ctrlOffset;
            else cp2.x += ctrlOffset;

            const path = `M ${sp.x} ${sp.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${tp.x} ${tp.y}`;
            const midX = (sp.x + tp.x) / 2;
            const midY = (sp.y + tp.y) / 2;

            return `
              <path d="${path}" fill="none" stroke="${color}" stroke-width="2" marker-end="url(#${markerId})"/>
              <circle cx="${midX}" cy="${midY}" r="11" fill="${bg}" stroke="${color}" stroke-width="1.5"/>
              <text x="${midX}" y="${midY + 4.5}" text-anchor="middle" font-size="14" font-weight="900" fill="${color}" font-family="Inter, sans-serif">${escapeHTML(relation)}</text>
            `;
        })
        .join('');

    const nodesSvg = nodes
        .map(
            (n) => `
              <g>
                <rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="10" ry="10" fill="#ffffff" stroke="#36717e" stroke-width="2"/>
                <text x="${n.x + n.width / 2}" y="${n.y + n.height / 2 + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="#083a4f" font-family="Inter, sans-serif">${escapeHTML(truncateLabel(n.label))}</text>
              </g>
            `
        )
        .join('');

    return `
      <div style="margin:8px 0;text-align:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="width:100%;max-width:680px;height:auto;display:inline-block">
          ${defs}
          ${edgesSvg}
          ${nodesSvg}
        </svg>
        <div style="margin-top:8px;font-size:10px;color:#64748b;font-family:monospace">
          ${nodes.length} variables &middot; ${rawEdges.length} relations
        </div>
      </div>
    `;
};

// ==========================================================================
// Cell renderer (table & card)
// ==========================================================================
const renderCell = (row, col, t) => {
    const val = pickValue(row, col);
    if (isEmpty(val)) return '<span style="color:#94a3b8;font-style:italic">-</span>';

    if (col.type === 'mapped' && col.mapKeys) {
        const mapKey = col.mapKeys[val];
        return escapeHTML(mapKey ? tr(t, mapKey, val) : val);
    }
    if (col.type === 'rich') return `<div class="pdf-rich">${val}</div>`;
    return escapeHTML(val);
};

// ==========================================================================
// Table renderer (flat tabular data, e.g. initial_component_ecosystem)
// ==========================================================================
const renderTable = (rows, columns, t) => {
    if (!Array.isArray(rows) || rows.length === 0) {
        return '<p style="color:#94a3b8;font-style:italic;margin:0">(No data)</p>';
    }
    const filled = rows.filter((r) => columns.some((c) => !isEmpty(pickValue(r, c))));
    if (filled.length === 0) {
        return '<p style="color:#94a3b8;font-style:italic;margin:0">(No data)</p>';
    }

    return `
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin:4px 0">
        <thead>
          <tr style="background:#c0d6d6">
            <th style="padding:8px 10px;text-align:center;border:1px solid #cbd5e1;color:#083a4f;font-weight:700;width:30px">#</th>
            ${columns
            .map(
                (c) =>
                    `<th style="padding:8px 10px;text-align:left;border:1px solid #cbd5e1;color:#083a4f;font-weight:700">${escapeHTML(
                        tr(t, c.labelKey, c.key)
                    )}</th>`
            )
            .join('')}
          </tr>
        </thead>
        <tbody>
          ${filled
            .map(
                (row, i) =>
                    `<tr style="background:${i % 2 === 0 ? '#ffffff' : '#f8fafc'}">
                      <td style="padding:8px 10px;border:1px solid #e2e8f0;text-align:center;color:#64748b;font-weight:600">${i + 1}</td>
                      ${columns
                        .map(
                            (c) =>
                                `<td style="padding:8px 10px;border:1px solid #e2e8f0;vertical-align:top">${renderCell(row, c, t)}</td>`
                        )
                        .join('')}
                    </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;
};

// ==========================================================================
// Card list renderer (decision_strategy — rich text per row)
// ==========================================================================
const renderCardList = (rows, primary, blocks, t) => {
    if (!Array.isArray(rows) || rows.length === 0) {
        return '<p style="color:#94a3b8;font-style:italic;margin:0">(No data)</p>';
    }
    const filled = rows.filter((r) =>
        [...primary, ...blocks].some((f) => !isEmpty(pickValue(r, f)))
    );
    if (filled.length === 0) {
        return '<p style="color:#94a3b8;font-style:italic;margin:0">(No data)</p>';
    }

    return filled
        .map((row, idx) => {
            const headerParts = primary
                .map((p) => {
                    const label = tr(t, p.labelKey, p.key);
                    return `<span><strong style="color:#083a4f">${escapeHTML(label)}:</strong> ${renderCell(row, p, t)}</span>`;
                })
                .join('<span style="color:#cbd5e1;margin:0 8px">|</span>');

            const blockParts = blocks
                .map((b) => {
                    const label = tr(t, b.labelKey, b.key);
                    const val = pickValue(row, b);
                    const content = isEmpty(val)
                        ? '<span style="color:#94a3b8;font-style:italic">(empty)</span>'
                        : b.type === 'rich'
                            ? `<div class="pdf-rich">${val}</div>`
                            : escapeHTML(val);
                    return `
                      <div style="margin-top:8px">
                        <div style="font-size:10px;font-weight:700;color:#36717e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">
                          ${escapeHTML(label)}
                        </div>
                        <div style="padding:8px 10px;background:#ffffff;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;color:#1e293b">
                          ${content}
                        </div>
                      </div>
                    `;
                })
                .join('');

            return `
              <div style="margin:12px 0;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;page-break-inside:avoid">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;padding-bottom:8px;border-bottom:1px solid #e2e8f0">
                  <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;background:#083a4f;color:#ffffff;font-weight:700;font-size:11px;border-radius:50%;flex-shrink:0">${idx + 1}</span>
                  <div style="font-size:12px;line-height:1.5">${headerParts}</div>
                </div>
                ${blockParts}
              </div>
            `;
        })
        .join('');
};

// ==========================================================================
// Field renderer
// ==========================================================================
const renderField = (field, value, t) => {
    const title = field.titleKey ? tr(t, field.titleKey) : '';
    const desc = field.descKey ? tr(t, field.descKey) : '';

    let answer = '';
    if (isEmpty(value)) {
        answer = '<p style="color:#94a3b8;font-style:italic;margin:0">(No answer)</p>';
    } else if (field.type === 'rich') {
        answer = `<div class="pdf-rich">${value}</div>`;
    } else if (field.type === 'table') {
        answer = renderTable(value, field.columns, t);
    } else if (field.type === 'card_list') {
        answer = renderCardList(value, field.primary, field.blocks, t);
    } else if (field.type === 'diagram') {
        answer = renderDiagram(value);
    }

    return `
      <div style="margin-bottom:18px;page-break-inside:avoid">
        ${title ? `<h3 style="font-size:15px;font-weight:700;color:#083a4f;margin:0 0 4px 0">${escapeHTML(title)}</h3>` : ''}
        ${desc ? `<p style="font-size:12px;color:#36717e;margin:0 0 8px 0;line-height:1.5">${escapeHTML(desc)}</p>` : ''}
        <div style="padding:12px 14px;background:#f8fafc;border-left:3px solid #36717e;border-radius:4px;font-size:13px;line-height:1.6;color:#1e293b">
          ${answer}
        </div>
      </div>
    `;
};

// ==========================================================================
// HTML builder
// ==========================================================================
const buildHTML = ({ user, responses, t, structure }) => {
    const userName = getUserName(user);
    const date = new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const styleBlock = `
      <style>
        .pdf-rich p { margin: 0 0 6px 0; }
        .pdf-rich p:last-child { margin-bottom: 0; }
        .pdf-rich strong, .pdf-rich b { font-weight: 700; }
        .pdf-rich em, .pdf-rich i { font-style: italic; }
        .pdf-rich u { text-decoration: underline; }
        .pdf-rich code { background: rgba(0,0,0,0.06); padding: 1px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em; }
        .pdf-rich pre { background: rgba(0,0,0,0.06); padding: 8px 10px; border-radius: 4px; font-family: monospace; font-size: 12px; overflow-x: auto; margin: 6px 0; white-space: pre-wrap; }
        .pdf-rich ul, .pdf-rich ol { margin: 4px 0 6px 22px; padding: 0; }
        .pdf-rich li { margin-bottom: 3px; }
        .pdf-rich h1 { font-size: 18px; font-weight: 700; margin: 8px 0 6px; }
        .pdf-rich h2 { font-size: 16px; font-weight: 700; margin: 8px 0 6px; }
        .pdf-rich h3 { font-size: 14px; font-weight: 700; margin: 6px 0 4px; }
        .pdf-rich blockquote { margin: 6px 0 6px 4px; padding-left: 10px; border-left: 3px solid #cbd5e1; color: #475569; font-style: italic; }
        .pdf-rich table { border-collapse: collapse; width: 100%; margin: 6px 0; font-size: 12px; }
        .pdf-rich th, .pdf-rich td { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: top; }
        .pdf-rich th { background: #e2e8f0; font-weight: 700; text-align: left; }
      </style>
    `;

    const header = `
      <div style="margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #083a4f">
        <h1 style="font-size:26px;font-weight:800;margin:0 0 12px 0;color:#083a4f;letter-spacing:-0.5px">
          Investigation Report
        </h1>
        <div style="font-size:13px;color:#36717e;line-height:1.8">
          <div><strong style="color:#083a4f">User:</strong> ${escapeHTML(userName)}</div>
          <div><strong style="color:#083a4f">Diunduh:</strong> ${escapeHTML(date)}</div>
        </div>
      </div>
    `;

    const sections = structure
        .map((section, idx) => {
            const data = responses?.[section.slugKey] || {};
            const sectionTitle = tr(t, section.titleKey, section.slugKey);
            return `
        <section style="margin-bottom:32px">
          <h2 style="font-size:18px;font-weight:700;color:#083a4f;padding:15px 14px;padding-top:0px;background:#c0d6d6;border-radius:6px">
            ${idx + 1}. ${escapeHTML(sectionTitle)}
          </h2>
          ${section.fields.map((f) => renderField(f, data[f.name], t)).join('')}
        </section>
      `;
        })
        .join('');

    return styleBlock + header + sections;
};

// ==========================================================================
// Main export function
// ==========================================================================
export async function exportResponsesToPDF({ user, responses, t, structure = EXPORT_STRUCTURE }) {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
    ]);

    const container = document.createElement('div');
    container.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 794px;
        padding: 40px;
        background: #ffffff;
        color: #083a4f;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        line-height: 1.6;
        box-sizing: border-box;
    `;
    container.innerHTML = buildHTML({ user, responses, t, structure });
    document.body.appendChild(container);

    try {
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = 210;
        const pageHeight = 297;
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        const safeName = getUserName(user)
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase()
            .slice(0, 40);
        const date = new Date().toISOString().split('T')[0];
        pdf.save(`${safeName}_microplastic_report_${date}.pdf`);
    } finally {
        document.body.removeChild(container);
    }
}