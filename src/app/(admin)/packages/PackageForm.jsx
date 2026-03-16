import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Card, Row, Col } from "react-bootstrap";
import PackageImageUploader from "./components/PackagemageUploader";
import { createPackage, updatePackage } from "@/api/apis";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageMetaData from "@/components/PageTitle";

/* =========================
   VALIDATION SCHEMA
   Field names match backend exactly:
   withVisaPrice1, withVisaPrice2, WithoutVisaPrice1, WithoutVisaPrice2
========================= */
const schema = yup.object({
  title: yup.string().required("Title is required"),
  WithoutVisaPrice1: yup
    .number()
    .typeError("Must be a number")
    .required("Price 1 (Without Visa) is required")
    .min(0, "Must be 0 or more"),
  WithoutVisaPrice2: yup
    .number()
    .typeError("Must be a number")
    .required("Price 2 (Without Visa) is required")
    .min(0, "Must be 0 or more"),
  withVisaPrice1: yup
    .number()
    .typeError("Must be a number")
    .required("Price 1 (With Visa) is required")
    .min(0, "Must be 0 or more"),
  withVisaPrice2: yup
    .number()
    .typeError("Must be a number")
    .required("Price 2 (With Visa) is required")
    .min(0, "Must be 0 or more"),
});

const PackageForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isEdit = Boolean(state?.pkg);
  const pkg = state?.pkg;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: pkg?.title || "",
      // Backend returns flat field names — map them back for edit
      WithoutVisaPrice1: pkg?.WithoutVisaPrice1 ?? "",
      WithoutVisaPrice2: pkg?.WithoutVisaPrice2 ?? "",
      withVisaPrice1: pkg?.withVisaPrice1 ?? "",
      withVisaPrice2: pkg?.withVisaPrice2 ?? "",
      image: pkg?.image || null,
    },
  });

  const image = watch("image");

  /* =========================
     SUBMIT HANDLER
     Sends flat field names to match backend exactly
  ========================= */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title.trim());
      // Match exact backend field names (note: WithoutVisaPrice1 has capital W)
      formData.append("WithoutVisaPrice1", data.WithoutVisaPrice1);
      formData.append("WithoutVisaPrice2", data.WithoutVisaPrice2);
      formData.append("withVisaPrice1", data.withVisaPrice1);
      formData.append("withVisaPrice2", data.withVisaPrice2);

      // Only append image if it's a new File (not an existing URL string)
      if (data.image && typeof data.image !== "string") {
        formData.append("image", data.image);
      }

      const res = isEdit
        ? await updatePackage(pkg._id, formData)
        : await createPackage(formData);

      if (res?.success) {
        toast.success(
          isEdit ? "Package updated successfully" : "Package created successfully"
        );
        navigate("/packages");
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || err?.error || "Failed to save package");
    }
  };

  return (
    <>
      <PageBreadcrumb
        title={isEdit ? "Edit Package" : "Add Package"}
        subName="Packages"
      />
      <PageMetaData title={isEdit ? "Edit Package" : "Add Package"} />

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* ================= PACKAGE IMAGE ================= */}
            <div className="mb-4">
              <h5 className="fw-bold mb-2">Package Image</h5>
              <p className="text-muted small mb-3">
                {isEdit
                  ? "Upload a new image to replace the current one, or leave blank to keep the existing."
                  : "Upload a package image (required)."}
              </p>
              <PackageImageUploader
                image={image}
                onChange={(img) => setValue("image", img)}
              />
            </div>

            <hr className="my-4" />

            {/* ================= TITLE ================= */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Package Details</h5>
              <Row>
                <Col md={6}>
                  <label className="form-label fw-semibold">Package Title <span className="text-danger">*</span></label>
                  <input
                    {...register("title")}
                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    placeholder="Enter package title"
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title.message}</div>
                  )}
                </Col>
              </Row>
            </div>

            <hr className="my-4" />

            {/* ================= WITHOUT VISA PRICING ================= */}
            <div className="mb-4">
              <h5 className="fw-bold mb-1">
                <span
                  className="badge me-2"
                  style={{ background: "#1f6feb", fontSize: "13px" }}
                >
                  Without Visa
                </span>
                Pricing
              </h5>
              <p className="text-muted small mb-3">
                Set the two price tiers for the without-visa option.
              </p>
              <Row className="g-3">
                <Col md={6}>
                  <label className="form-label fw-semibold">
                    Price 1 <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">AED</span>
                    <input
                      {...register("WithoutVisaPrice1")}
                      type="number"
                      min="0"
                      step="0.01"
                      className={`form-control ${
                        errors.WithoutVisaPrice1 ? "is-invalid" : ""
                      }`}
                      placeholder="0.00"
                    />
                    {errors.WithoutVisaPrice1 && (
                      <div className="invalid-feedback">
                        {errors.WithoutVisaPrice1.message}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <label className="form-label fw-semibold">
                    Price 2 <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">AED</span>
                    <input
                      {...register("WithoutVisaPrice2")}
                      type="number"
                      min="0"
                      step="0.01"
                      className={`form-control ${
                        errors.WithoutVisaPrice2 ? "is-invalid" : ""
                      }`}
                      placeholder="0.00"
                    />
                    {errors.WithoutVisaPrice2 && (
                      <div className="invalid-feedback">
                        {errors.WithoutVisaPrice2.message}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>

            <hr className="my-4" />

            {/* ================= WITH VISA PRICING ================= */}
            <div className="mb-4">
              <h5 className="fw-bold mb-1">
                <span
                  className="badge me-2"
                  style={{ background: "#198754", fontSize: "13px" }}
                >
                  With Visa
                </span>
                Pricing
              </h5>
              <p className="text-muted small mb-3">
                Set the two price tiers for the with-visa option.
              </p>
              <Row className="g-3">
                <Col md={6}>
                  <label className="form-label fw-semibold">
                    Price 1 <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">AED</span>
                    <input
                      {...register("withVisaPrice1")}
                      type="number"
                      min="0"
                      step="0.01"
                      className={`form-control ${
                        errors.withVisaPrice1 ? "is-invalid" : ""
                      }`}
                      placeholder="0.00"
                    />
                    {errors.withVisaPrice1 && (
                      <div className="invalid-feedback">
                        {errors.withVisaPrice1.message}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <label className="form-label fw-semibold">
                    Price 2 <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">AED</span>
                    <input
                      {...register("withVisaPrice2")}
                      type="number"
                      min="0"
                      step="0.01"
                      className={`form-control ${
                        errors.withVisaPrice2 ? "is-invalid" : ""
                      }`}
                      placeholder="0.00"
                    />
                    {errors.withVisaPrice2 && (
                      <div className="invalid-feedback">
                        {errors.withVisaPrice2.message}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="action-footer d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
              <Button
                variant="outline-danger"
                type="button"
                onClick={() => navigate("/packages")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="outline-success"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                  ? "Update Package"
                  : "Save Package"}
              </Button>
            </div>

          </form>
        </Card.Body>
      </Card>
    </>
  );
};

export default PackageForm;
