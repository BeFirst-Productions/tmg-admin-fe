import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { toast } from "react-toastify";
import { addGallery } from "@/api/apis";
import { compressImage } from "@/utils/imageCompression";

const ImageUpload = ({ handleImage }) => {
    const fileInputRef = useRef();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        let processedFile = file;

        // Automatically compress ONLY if larger than 1MB (1024KB)
        if (file.size > 1024 * 1024) {
            const toastId = toast.info("Image is large (>1MB). Automatically optimizing for web...", { autoClose: false });
            try {
                processedFile = await compressImage(file, { 
                    quality: 0.7, 
                    maxWidth: 1600, 
                    maxHeight: 1600 
                });
                toast.dismiss(toastId);
                toast.success(`Optimized: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedFile.size / 1024).toFixed(0)}KB`);
            } catch (error) {
                toast.dismiss(toastId);
                console.error("Compression failed", error);
            }
        }

        // Final safety check (Professional Standard)
        const MAX_SIZE = 1 * 1024 * 1024; 
        if (processedFile.size > MAX_SIZE) {
            toast.error("Even after optimization, this file is too large. Please use a smaller image.");
            e.target.value = ""; 
            return;
        }

        setImage(processedFile);
        setPreview(URL.createObjectURL(processedFile));
    };

    const removeImage = () => {
        setImage(null);
        setPreview("");
        fileInputRef.current.value = "";
    };

    // ⭐ API SUBMIT FUNCTION ADDED HERE ⭐
    const handleSubmit = async () => {
        if (!image) return;

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append("image", image);

            const res = await addGallery(formData)

            if (res.success) {
                toast.success(res.message || "Image uploaded successfully!");
                handleImage()
            }


            // Reset state after successful upload
            removeImage();

        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <label className="fs-14 mb-1">Upload Gallery Image</label>

            {!preview && (
                <div className="upload-box" onClick={() => fileInputRef.current.click()}>
                    <Icon icon="bx:cloud-upload" width="48" height="48" className="upload-icon" />
                    <p className="upload-text">Drop file here or click to browse</p>
                    <div className="upload-info mt-2">
                        <p className="mb-1 text-primary fw-bold small">Professional standard recommendations:</p>
                        <ul className="list-unstyled small text-muted">
                            <li>• Max File Size: <strong>1MB</strong></li>
                            <li>• Recommended Width: <strong>1200px</strong></li>
                            <li>• Formats: <strong>JPG, PNG, WebP</strong></li>
                        </ul>
                    </div>

                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageSelect}
                    />
                </div>
            )}

            {preview && (
                <div className="preview-wrapper mt-2">
                    <button className="remove-btn" onClick={removeImage}>
                        <Icon icon="mdi:close" width="18" height="18" />
                    </button>

                    <img src={preview} className="uploaded-image" alt="preview" />
                </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="mt-3">
                <button
                    className="btn btn-primary"
                    disabled={!image || isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Uploading..." : "Submit Image"}
                </button>
            </div>

            {/* Styles */}
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
        .upload-icon {
          color: #5a5ad1;
          margin-bottom: 10px;
        }
        .upload-text {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          color: #8d8f8e;
        }
        .upload-help {
          font-size: 13px;
          color: #888;
          margin-top: 4px;
        }
        .preview-wrapper {
          position: relative;
          width: 140px;
        }
        .uploaded-image {
          width: 140px;
          height: 140px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid #ddd;
        }
        .remove-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ff4d4d;
          border: none;
          color: white;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
        }
      `}</style>
        </div>
    );
};

export default ImageUpload;
