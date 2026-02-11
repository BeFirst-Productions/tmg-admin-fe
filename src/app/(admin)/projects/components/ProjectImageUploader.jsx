import { useDropzone } from "react-dropzone";

const ProjectImageUploader = ({ image, onChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (files) => {
      if (files && files.length) {
        onChange(files[0]);
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

export default ProjectImageUploader;
