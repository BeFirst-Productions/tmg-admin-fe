import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProjectEditor = ({ value, onChange }) => {
  return (
    <div className="project-editor-wrapper">
      <div className="quill-wrapper">
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={onChange}
          placeholder="Write detailed project description here..."
        />
      </div>

      {/* Scoped CSS */}
      <style jsx>{`
        .project-editor-wrapper {
          width: 100%;
          margin-bottom: 2rem; /* 🔑 pushes buttons down */
        }

        .quill-wrapper {
          border-radius: 10px;
          overflow: hidden;
          background: #1f2933;
        }

        /* Toolbar */
        .quill-wrapper :global(.ql-toolbar) {
          border-color: #374151;
          background: #111827;
        }

        /* Editor container */
        .quill-wrapper :global(.ql-container) {
          border-color: #374151;
          height: 200px;          /* ✅ Desktop height */
          overflow-y: auto;       /* ✅ Internal scroll */
        }

        /* Editor content */
        .quill-wrapper :global(.ql-editor) {
          min-height: 160px;
          padding-bottom: 48px;  /* ✅ Prevents footer illusion */
          color: #e5e7eb;
        }

        /* Placeholder */
        .quill-wrapper :global(.ql-editor.ql-blank::before) {
          color: #9ca3af;
        }

        /* ===== MOBILE FIX ===== */
        @media (max-width: 576px) {
          .quill-wrapper :global(.ql-container) {
            height: 180px;        /* ✅ Fixed mobile height */
          }

          .quill-wrapper :global(.ql-editor) {
            min-height: 140px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectEditor;
