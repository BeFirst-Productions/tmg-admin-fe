import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PackageEditor = ({ value, onChange }) => {
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

export default PackageEditor;
