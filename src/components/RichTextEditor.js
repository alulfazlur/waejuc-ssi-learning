import { useEffect, useState, useRef } from "react";
import { useController } from "react-hook-form";
import { get } from 'lodash';
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import FieldError from "@components/FieldError";

// ── Toolbar Button ────────────────────────────────────────────────────────────
function ToolbarButton({ onClick, isActive, title, children }) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={title}
            aria-label={title}
            aria-pressed={isActive}
            className={`
                inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium
                transition-colors duration-100 cursor-pointer
                ${isActive
                    ? "bg-primary text-background"
                    : "text-muted hover:bg-surface-subtle hover:text-primary"
                }
            `}
        >
            {children}
        </button>
    );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
    return <div className="w-px h-5 bg-border mx-1 self-center" />;
}

// ── Table Picker ──────────────────────────────────────────────────────────────
function TablePicker({ onInsert, onClose }) {
    const [hovered, setHovered] = useState({ rows: 0, cols: 0 });
    const MAX = 6;

    return (
        <div
            className="absolute top-full left-0 mt-1 z-50 bg-card ring-1 ring-border rounded-xl shadow-card p-2"
            onMouseLeave={() => setHovered({ rows: 0, cols: 0 })}
        >
            <p className="text-xs text-muted font-mono mb-1.5 px-0.5">
                {hovered.rows > 0 && hovered.cols > 0
                    ? `${hovered.rows} × ${hovered.cols}`
                    : "Pilih ukuran tabel"}
            </p>
            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${MAX}, 1fr)` }}>
                {Array.from({ length: MAX * MAX }).map((_, i) => {
                    const row = Math.floor(i / MAX) + 1;
                    const col = (i % MAX) + 1;
                    const active = row <= hovered.rows && col <= hovered.cols;
                    return (
                        <button
                            key={i}
                            type="button"
                            className={`w-5 h-5 rounded-sm border transition-colors duration-75
                                ${active
                                    ? "bg-secondary/30 border-secondary"
                                    : "bg-surface-subtle border-border"
                                }`}
                            onMouseEnter={() => setHovered({ rows: row, cols: col })}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onInsert(row, col);
                                onClose();
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// ── Table Context Menu ────────────────────────────────────────────────────────
function TableContextMenu({ editor, onClose }) {
    const actions = [
        { label: "Tambah baris di atas", action: () => editor.chain().focus().addRowBefore().run() },
        { label: "Tambah baris di bawah", action: () => editor.chain().focus().addRowAfter().run() },
        { label: "Hapus baris", action: () => editor.chain().focus().deleteRow().run(), danger: true },
        null,
        { label: "Tambah kolom di kiri", action: () => editor.chain().focus().addColumnBefore().run() },
        { label: "Tambah kolom di kanan", action: () => editor.chain().focus().addColumnAfter().run() },
        { label: "Hapus kolom", action: () => editor.chain().focus().deleteColumn().run(), danger: true },
        null,
        { label: "Hapus tabel", action: () => editor.chain().focus().deleteTable().run(), danger: true },
    ];

    return (
        <div className="absolute top-full left-0 mt-1 z-50 bg-card ring-1 ring-border rounded-xl shadow-card py-1 min-w-44">
            {actions.map((item, i) =>
                item === null ? (
                    <div key={i} className="h-px bg-border my-1 mx-2" />
                ) : (
                    <button
                        key={item.label}
                        type="button"
                        className={`w-full text-left px-3 py-2 text-sm transition-colors
                            ${item.danger
                                ? "text-danger hover:bg-danger/10"
                                : "text-primary hover:bg-surface-subtle"
                            }`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            item.action();
                            onClose();
                        }}
                    >
                        {item.label}
                    </button>
                )
            )}
        </div>
    );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
    Bold: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
    ),
    Italic: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
        </svg>
    ),
    Code: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    CodeBlock: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="18" rx="2" />
            <polyline points="8 9 2.5 12 8 15" transform="translate(3,0)" />
            <polyline points="16 9 21.5 12 16 15" transform="translate(-3,0)" />
        </svg>
    ),
    BulletList: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
        </svg>
    ),
    OrderedList: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
            <text x="2" y="8" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">1.</text>
            <text x="2" y="14" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">2.</text>
            <text x="2" y="20" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">3.</text>
        </svg>
    ),
    Blockquote: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
    ),
    Table: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
    ),
    TableEdit: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
            <circle cx="18" cy="18" r="4" fill="currentColor" stroke="none" />
            <line x1="18" y1="16" x2="18" y2="20" stroke="white" strokeWidth="1.5" />
            <line x1="16" y1="18" x2="20" y2="18" stroke="white" strokeWidth="1.5" />
        </svg>
    ),
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function RichTextEditor({
    placeholder = "",
    name = "",
    errors,
    control,
    fullHeight = false,
    ariaLabel,
}) {
    const {
        field: { value, onChange },
    } = useController({ name, control, defaultValue: "" });

    const error = errors?.[name] || get(errors, name);

    const [showTablePicker, setShowTablePicker] = useState(false);
    const [showTableContext, setShowTableContext] = useState(false);
    const tablePickerRef = useRef(null);
    const tableContextRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Typography,
            Table.configure({ resizable: false }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({
                placeholder,
                emptyNodeClass:
                    "before:content-[attr(data-placeholder)] before:text-muted/70 before:pointer-events-none before:float-left before:h-0",
            }),
        ],
        content: value || "",
        immediatelyRender: false,
        onUpdate({ editor }) {
            const html = editor.getHTML();
            const isReallyEmpty = editor.getText().trim().length === 0;
            onChange(isReallyEmpty ? "" : html);
        },
        editorProps: {
            attributes: {
                class: `max-w-none focus:outline-none px-4 py-3 pb-8 overflow-auto text-[15px] leading-relaxed ${
                    fullHeight ? "h-[400px]" : "min-h-[160px] max-h-[480px]"
                }`,
                "aria-label": ariaLabel || name,
                ...(error ? { "aria-invalid": "true" } : {}),
            },
        },
    });

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            isBold: editor?.isActive("bold"),
            isItalic: editor?.isActive("italic"),
            isCode: editor?.isActive("code"),
            isCodeBlock: editor?.isActive("codeBlock"),
            isBlockquote: editor?.isActive("blockquote"),
            isBulletList: editor?.isActive("bulletList"),
            isOrderedList: editor?.isActive("orderedList"),
            isInTable: editor?.isActive("table"),
            charCount: editor?.getText().length || 0,
        }),
    });

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (tablePickerRef.current && !tablePickerRef.current.contains(e.target)) {
                setShowTablePicker(false);
            }
            if (tableContextRef.current && !tableContextRef.current.contains(e.target)) {
                setShowTableContext(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Sync external value changes
    useEffect(() => {
        if (!editor) return;
        if (value !== editor.getHTML()) {
            editor.commands.setContent(value || "", false);
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!editor || !editorState) return null;

    const insertTable = (rows, cols) => {
        editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    };

    return (
        <>
            <style>{`
                .tiptap-editor .ProseMirror { outline: none; }
                .tiptap-editor .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; margin: 0.5rem 0; }
                .tiptap-editor .ProseMirror h2 { font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0; }
                .tiptap-editor .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 0.4rem 0; }
                .tiptap-editor .ProseMirror p  { margin: 0.25rem 0; }
                .tiptap-editor .ProseMirror ul { list-style-type: disc;    padding-left: 1.25rem; margin: 0.25rem 0; }
                .tiptap-editor .ProseMirror ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0.25rem 0; }
                .tiptap-editor .ProseMirror pre {
                    background: rgba(0,0,0,0.07);
                    border-radius: 6px;
                    padding: 0.6rem 0.8rem;
                    font-family: monospace;
                    font-size: 0.85em;
                    overflow-x: auto;
                    margin: 0.4rem 0;
                }
                .dark .tiptap-editor .ProseMirror pre { background: rgba(255,255,255,0.1); }
                .tiptap-editor .ProseMirror blockquote {
                    border-left: 3px solid currentColor;
                    opacity: 0.7;
                    padding-left: 0.75rem;
                    margin: 0.4rem 0 0.4rem 0.25rem;
                    font-style: italic;
                }

                /* ── Table styles ── */
                .tiptap-editor .ProseMirror table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 0.5rem 0;
                    overflow: hidden;
                    border-radius: 6px;
                    font-size: 0.85em;
                }
                .tiptap-editor .ProseMirror th,
                .tiptap-editor .ProseMirror td {
                    border: 1px solid rgba(0,0,0,0.12);
                    padding: 0.4rem 0.6rem;
                    vertical-align: top;
                    min-width: 60px;
                    position: relative;
                }
                .dark .tiptap-editor .ProseMirror th,
                .dark .tiptap-editor .ProseMirror td { border-color: rgba(255,255,255,0.12); }
                .tiptap-editor .ProseMirror th {
                    background: rgba(0,0,0,0.05);
                    font-weight: 600;
                    text-align: left;
                }
                .dark .tiptap-editor .ProseMirror th { background: rgba(255,255,255,0.08); }
                .tiptap-editor .ProseMirror .selectedCell::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.06);
                    pointer-events: none;
                }
                .dark .tiptap-editor .ProseMirror .selectedCell::after { background: rgba(255,255,255,0.08); }
            `}</style>

            <div
                data-field={name}
                className={`
                    tiptap-editor relative w-full overflow-hidden rounded-xl border-[1.5px] transition-[border-color,box-shadow]
                    bg-card text-primary focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30
                    ${error ? "border-danger" : "border-input"}
                `}
            >
                {/* ── Toolbar ── */}
                <div
                    role="toolbar"
                    className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-surface-subtle/60"
                >

                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editorState.isBold} title="Bold">        <Icons.Bold />        </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editorState.isItalic} title="Italic">      <Icons.Italic />      </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editorState.isCode} title="Inline Code"> <Icons.Code />        </ToolbarButton>

                    <Divider />

                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editorState.isBulletList} title="Bullet List"> <Icons.BulletList />  </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editorState.isOrderedList} title="Ordered List"><Icons.OrderedList /> </ToolbarButton>

                    <Divider />

                    <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editorState.isCodeBlock} title="Code Block">  <Icons.CodeBlock />   </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editorState.isBlockquote} title="Blockquote">  <Icons.Blockquote />  </ToolbarButton>

                    <Divider />

                    {/* Table insert picker */}
                    <div className="relative" ref={tablePickerRef}>
                        <ToolbarButton
                            onClick={() => {
                                setShowTableContext(false);
                                setShowTablePicker(v => !v);
                            }}
                            isActive={showTablePicker}
                            title="Insert Table"
                        >
                            <Icons.Table />
                        </ToolbarButton>
                        {showTablePicker && (
                            <TablePicker
                                onInsert={insertTable}
                                onClose={() => setShowTablePicker(false)}
                            />
                        )}
                    </div>

                    {/* Table context menu — only visible when cursor is inside a table */}
                    {editorState.isInTable && (
                        <div className="relative" ref={tableContextRef}>
                            <ToolbarButton
                                onClick={() => {
                                    setShowTablePicker(false);
                                    setShowTableContext(v => !v);
                                }}
                                isActive={showTableContext}
                                title="Edit Table"
                            >
                                <Icons.TableEdit />
                            </ToolbarButton>
                            {showTableContext && (
                                <TableContextMenu
                                    editor={editor}
                                    onClose={() => setShowTableContext(false)}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* ── Editor Area ── */}
                <div className={`relative ${fullHeight ? "flex-1 min-h-0" : ""}`}>
                    <EditorContent editor={editor} />

                    <div aria-hidden="true" className={`
                        pointer-events-none absolute bottom-2 right-3 text-xs font-mono
                        ${error ? "text-danger" : "text-muted"}
                    `}>
                        {editorState.charCount} chars
                    </div>
                </div>
            </div>

            <FieldError message={error?.message} />
        </>
    );
}