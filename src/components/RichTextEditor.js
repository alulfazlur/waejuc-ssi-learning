// Install dependencies first:
// npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-typography

import { useEffect } from "react";
import { useController } from "react-hook-form";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";

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
            className={`
                inline-flex items-center justify-center w-7 h-7 rounded text-xs font-medium
                transition-colors duration-100 cursor-pointer
                ${isActive
                    ? "bg-primary text-background dark:bg-background dark:text-primary"
                    : "text-primary/70 dark:text-background/70 hover:bg-primary/10 dark:hover:bg-background/10 hover:text-primary dark:hover:text-background"
                }
            `}
        >
            {children}
        </button>
    );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
    return <div className="w-px h-5 bg-secondary/30 mx-0.5 self-center" />;
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
    H1: () => <span className="font-bold text-[11px] tracking-tight">H1</span>,
    H2: () => <span className="font-bold text-[11px] tracking-tight">H2</span>,
    H3: () => <span className="font-bold text-[11px] tracking-tight">H3</span>,
    P: () => <span className="font-medium text-[11px]">¶</span>,
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
    Blockquote: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
    ),
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function RichTextEditor({
    placeholder = "",
    name = "",
    errors,
    control,
}) {
    const {
        field: { value, onChange },
    } = useController({ name, control, defaultValue: "" });

    const error = errors?.[name];

    const editor = useEditor({
        extensions: [
            StarterKit,
            Typography,
            Placeholder.configure({
                placeholder,
                emptyNodeClass:
                    "before:content-[attr(data-placeholder)] before:text-secondary/50 before:pointer-events-none before:float-left before:h-0",
            }),
        ],
        content: value || "",
        immediatelyRender: false,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] px-3 py-2",
            },
        },
    });

    // Reactive active states — re-evaluates on every selection/transaction change
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
            isParagraph: editor?.isActive("paragraph"),
            isH1: editor?.isActive("heading", { level: 1 }),
            isH2: editor?.isActive("heading", { level: 2 }),
            isH3: editor?.isActive("heading", { level: 3 }),
            charCount: editor?.getText().length || 0,
        }),
    });

    // Sync external value changes (e.g. form reset) without losing cursor
    useEffect(() => {
        if (!editor) return;
        if (value !== editor.getHTML()) {
            editor.commands.setContent(value || "", false);
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!editor || !editorState) return null;

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
                    font-size: 0.5em;
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
            `}</style>

            <div
                className={`
                    tiptap-editor relative w-full rounded-lg border transition-all
                    bg-background dark:bg-primary text-primary dark:text-background
                    ${error ? "border-red-500" : "border-secondary/50"}
                `}
            >
                {/* ── Toolbar ── */}
                <div className={`
                    flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b
                    ${error ? "border-red-300" : "border-secondary/30"}
                `}>
                    {/* <ToolbarButton
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        isActive={editorState.isParagraph}
                        title="Paragraph"
                    >
                        <Icons.P />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editorState.isH1}
                        title="Heading 1"
                    >
                        <Icons.H1 />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editorState.isH2}
                        title="Heading 2"
                    >
                        <Icons.H2 />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editorState.isH3}
                        title="Heading 3"
                    >
                        <Icons.H3 />
                    </ToolbarButton>

                    <Divider /> */}

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editorState.isBold}
                        title="Bold"
                    >
                        <Icons.Bold />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editorState.isItalic}
                        title="Italic"
                    >
                        <Icons.Italic />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editorState.isCode}
                        title="Inline Code"
                    >
                        <Icons.Code />
                    </ToolbarButton>

                    <Divider />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editorState.isBulletList}
                        title="Bullet List"
                    >
                        <Icons.BulletList />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editorState.isOrderedList}
                        title="Ordered List"
                    >
                        <Icons.OrderedList />
                    </ToolbarButton>

                    <Divider />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editorState.isCodeBlock}
                        title="Code Block"
                    >
                        <Icons.CodeBlock />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editorState.isBlockquote}
                        title="Blockquote"
                    >
                        <Icons.Blockquote />
                    </ToolbarButton>
                </div>

                {/* ── Editor Area ── */}
                <div className="relative">
                    <EditorContent editor={editor} />

                    <div className={`
                        absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border
                        ${error
                            ? "bg-red-50 text-red-500 border-red-200"
                            : "bg-primary/10 text-primary border-primary/20 dark:bg-background/10 dark:text-background dark:border-background/20"
                        }
                    `}>
                        {editorState.charCount} chars
                    </div>
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-xs italic mt-1">{error.message}</p>
            )}
        </>
    );
}