import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import ProjectEditor from "./components/ProjectEditor";
import ProjectImageUploader from "./components/ProjectImageUploader";
import { createProject, updateProject } from "@/api/apis";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageMetaData from "@/components/PageTitle";
import { InfoTooltip } from "@/components/InfoTooltip";

/* =========================
   CHARACTER LIMIT CONSTANTS
========================= */
const TITLE_LIMIT = 70;
const EXCERPT_LIMIT = 165;

/* =========================
   VALIDATION SCHEMA
========================= */
const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(TITLE_LIMIT, `Title must not exceed ${TITLE_LIMIT} characters`),

  excerpt: yup
    .string()
    .required("Excerpt is required")
    .max(EXCERPT_LIMIT, `Excerpt must not exceed ${EXCERPT_LIMIT} characters`),
});

const ProjectForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isEdit = Boolean(state?.project);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: state?.project?.title || "",
      excerpt: state?.project?.excerpt || "",
      description: state?.project?.description || "",
      image: state?.project?.image || null,
    },
  });

  /* =========================
     WATCHED VALUES
  ========================= */
  const titleValue = watch("title") || "";
  const excerptValue = watch("excerpt") || "";
  const image = watch("image");

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title.trim());
      formData.append("excerpt", data.excerpt.trim());
      formData.append("description", data.description || "");

      if (data.image && typeof data.image !== "string") {
        formData.append("image", data.image);
      }

      const res = isEdit
        ? await updateProject(state.project._id, formData)
        : await createProject(formData);

      if (res.success) {
        toast.success(
          isEdit
            ? "Project updated successfully"
            : "Project created successfully"
        );
        navigate("/projects");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to save project"
      );
    }
  };

  return (
    <>
      <PageBreadcrumb
        title={isEdit ? "Edit Project" : "Add Project"}
        subName="Projects"
      />
      <PageMetaData title={isEdit ? "Edit Project" : "Add Project"} />

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* ================= BASIC INFO ================= */}
            {/* <h5 className="fw-bold mb-3 d-flex align-items-center">
              Basic Information
              <InfoTooltip text="Main details used to identify and list the project." />
            </h5> */}

            <Row className="mb-3">
              {/* ===== TITLE ===== */}
              <Col md={6}>
                <label className="form-label fw-semibold d-flex align-items-center justify-content-between">
                  <span className="d-flex align-items-center">
                    Project Title
                    <InfoTooltip text="Recommended maximum: 70 characters. Helps with SEO titles and clean layouts." />
                  </span>

                  <small
                    className={`fw-medium ${
                      titleValue.length > TITLE_LIMIT
                        ? "text-danger"
                        : "text-muted"
                    }`}
                  >
                    {titleValue.length}/{TITLE_LIMIT}
                  </small>
                </label>

                <input
                  {...register("title")}
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  placeholder="Enter project title"
                  maxLength={TITLE_LIMIT}
                />

                {errors.title && (
                  <div className="invalid-feedback">
                    {errors.title.message}
                  </div>
                )}
              </Col>

              {/* ===== EXCERPT ===== */}
              <Col md={6}>
                <label className="form-label fw-semibold d-flex align-items-center justify-content-between">
                  <span className="d-flex align-items-center">
                    Excerpt
                    <InfoTooltip text="Recommended maximum: 165 characters. Used in previews and meta descriptions." />
                  </span>

                  <small
                    className={`fw-medium ${
                      excerptValue.length > EXCERPT_LIMIT
                        ? "text-danger"
                        : "text-muted"
                    }`}
                  >
                    {excerptValue.length}/{EXCERPT_LIMIT}
                  </small>
                </label>

                <input
                  {...register("excerpt")}
                  className={`form-control ${
                    errors.excerpt ? "is-invalid" : ""
                  }`}
                  placeholder="Short project summary"
                  maxLength={EXCERPT_LIMIT}
                />

                {errors.excerpt && (
                  <div className="invalid-feedback">
                    {errors.excerpt.message}
                  </div>
                )}
              </Col>
            </Row>

            {/* ================= IMAGE ================= */}
            <h5 className="fw-bold mt-4 mb-2 d-flex align-items-center">
              Project Image
              <InfoTooltip text="This image will appear in the project listing and details page." />
            </h5>

            <ProjectImageUploader
              image={image}
              onChange={(img) => setValue("image", img)}
            />

            {/* ================= DESCRIPTION ================= */}
            <h5 className="fw-bold mt-4 mb-2 d-flex align-items-center">
              Detailed Description
              <InfoTooltip text="Full project description displayed on the project details page." />
            </h5>

            <ProjectEditor
              value={watch("description")}
              onChange={(val) => setValue("description", val)}
            />

            {/* ================= ACTIONS ================= */}
            <div className="action-footer d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
              <Button
                variant="outline-danger"
                onClick={() => navigate("/projects")}
              >
                Cancel
              </Button>

              <Button type="submit" variant="outline-success">
                {isEdit ? "Update Project" : "Save Project"}
              </Button>
            </div>

          </form>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProjectForm;
