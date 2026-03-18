import React, { useRef } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { compressImage } from "@/utils/imageCompression";
import { toast } from "react-toastify";

const ImageUpload = ({ blogData, updateBlogData, error }) => {
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0] || null;
    if (!file) return;

    let processedFile = file;

    // Automatic compression for files > 1MB
    if (file.size > 1024 * 1024) {
      const toastId = toast.info("Blog image is large. Optimizing for web...", { autoClose: false });
      try {
        processedFile = await compressImage(file, { quality: 0.75, maxWidth: 1600 });
        toast.dismiss(toastId);
        toast.success(`Optimized: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedFile.size / 1024).toFixed(0)}KB`);
      } catch (err) {
        toast.dismiss(toastId);
        console.error("Compression failed:", err);
      }
    }

    updateBlogData({ image: processedFile });
  };

  const removeImage = () => {
    updateBlogData({ image: null, existingImage: "" });
    fileInputRef.current.value = "";
  };

  const previewImage = blogData.image
    ? URL.createObjectURL(blogData.image)
    : blogData.existingImage || null;

  return (
    <div>
      <label className="fs-14 mb-1">Blog Image</label>

      {!previewImage && (
        <div
          onClick={() => fileInputRef.current.click()}
          className={`upload-box ${error ? "border-danger" : ""}`}
        >
          <IconifyIcon icon="bx:cloud-upload" width="48" height="48" className="upload-icon" />
          <p className="upload-text">Drop file here or click to browse</p>
          <p className="upload-help">(Only one image allowed)</p>

          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      )}

      {previewImage && (
        <div className="preview-wrapper">
          <button className="remove-btn" onClick={removeImage}>
            <IconifyIcon icon="mdi:close" width="20" height="20" />
          </button>

          <img src={previewImage} alt="Preview" className="uploaded-image" />
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && <p className="text-danger small mt-2">{error}</p>}

      <style jsx>{`
        .upload-box {
          width: 100%;
          padding: 35px;
          border: 2px dashed #b9b9b9;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          transition: 0.3s ease;
        }
        .upload-box:hover {
          border-color: #5a5ad1;
        }
        .upload-icon { color:#5a5ad1; margin-bottom:10px; }
        .upload-text { font-size:15px; font-weight:600; margin:0; color:#8d8f8e; }
        .upload-help { font-size:13px; color:#888; margin-top:4px; }

        .preview-wrapper { position:relative; width:140px; }
        .uploaded-image {
          width:140px;
          height:140px;
          object-fit:cover;
          border-radius:10px;
          border:1px solid #ddd;
        }
        .remove-btn {
          position:absolute;
          top:-10px;
          right:-10px;
          background:#ff4d4d;
          border:none;
          width:26px;
          height:26px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:50%;
          cursor:pointer;
          color:white;
        }
        .border-danger {
          border-color: #dc3545 !important;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
