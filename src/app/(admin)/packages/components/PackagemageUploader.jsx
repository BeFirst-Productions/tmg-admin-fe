import { useDropzone } from "react-dropzone";
import { compressImage } from "@/utils/imageCompression";
import { toast } from "react-toastify";

const PackageImageUploader = ({ image, onChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: async (files) => {
      if (files && files.length) {
        let file = files[0];

        // Automatic compression for files > 1MB
        if (file.size > 1024 * 1024) {
          const toastId = toast.info("Package image is large. Optimizing...", { autoClose: false });
          try {
            file = await compressImage(file, { quality: 0.75, maxWidth: 1500 });
            toast.dismiss(toastId);
            toast.success(`Optimized: ${(files[0].size / 1024 / 1024).toFixed(2)}MB → ${(file.size / 1024).toFixed(0)}KB`);
          } catch (err) {
            toast.dismiss(toastId);
            console.error("Compression failed:", err);
          }
        }
        onChange(file);
      }
    },
  });

  const preview =
    image && typeof image === "string"
      ? image
      : image
      ? URL.createObjectURL(image)
      : null;

  return (
    <div
      {...getRootProps()}
      className="border rounded p-3 text-center mb-3"
      style={{ cursor: "pointer" }}
    >
      <input {...getInputProps()} />

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="img-fluid rounded"
          style={{ maxHeight: 200 }}
        />
      ) : (
        <p className="text-muted m-0">Click or drop image here</p>
      )}
    </div>
  );
};

export default PackageImageUploader;
