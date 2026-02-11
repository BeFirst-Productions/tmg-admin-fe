import { yupResolver } from "@hookform/resolvers/yup";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import TextFormInput from "@/components/form/TextFormInput";
import { Col, Row } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { InfoTooltip } from "@/components/InfoTooltip";

/* =========================
   CHARACTER LIMITS
========================= */
const TITLE_LIMIT = 70;
const EXCERPT_LIMIT = 165;

/* =========================
   VALIDATION SCHEMA
========================= */
const generalFormSchema = yup.object({
  name: yup
    .string()
    .required("Blog title is required")
    .max(TITLE_LIMIT, `Title must not exceed ${TITLE_LIMIT} characters`),

  reference: yup
    .string()
    .required("Excerpt is required")
    .max(EXCERPT_LIMIT, `Excerpt must not exceed ${EXCERPT_LIMIT} characters`),

  description: yup.string().required("Description is required"),

  category: yup.string().required("Category is required"),

  url: yup
    .string()
    .required("URL is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens allowed"
    ),
});

/* =========================
   COMPONENT
========================= */
const GeneralDetailsForm = forwardRef(
  ({ updateBlogData, blogData, formErrors }, ref) => {
    const initialLoad = useRef(false);

    const {
      control,
      reset,
      watch,
      setValue,
      register,
      trigger,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(generalFormSchema),
      defaultValues: {
        name: "",
        reference: "",
        description: "",
        category: "",
        url: "",
      },
    });

    const [descriptionContent, setDescriptionContent] = useState("");

    /* =========================
       WATCH VALUES FOR COUNTERS
    ========================= */
    const titleValue = watch("name") || "";
    const excerptValue = watch("reference") || "";

    /* =========================
       EXPOSE VALIDATION
    ========================= */
    useImperativeHandle(ref, () => ({
      validateStep: async () => {
        const isValid = await trigger();
        return isValid;
      },
    }));

    /* =========================
       LOAD EDIT DATA (ONCE)
    ========================= */
    useEffect(() => {
      if (blogData.title && !initialLoad.current) {
        reset({
          name: blogData.title || "",
          reference: blogData.excerpt || "",
          description: blogData.description || "",
          category: blogData.category || "",
          url: blogData.url || "",
        });

        setDescriptionContent(blogData.description || "");
        initialLoad.current = true;
      }
    }, [blogData, reset]);

    /* =========================
       SYNC FORM → PARENT
    ========================= */
    useEffect(() => {
      const subscription = watch((values) => {
        updateBlogData({
          title: values.name,
          excerpt: values.reference,
          category: values.category,
          url: values.url,
        });
      });

      return () => subscription.unsubscribe();
    }, [watch, updateBlogData]);

    return (
      <form noValidate>
        {/* Hidden description field */}
        <input type="hidden" {...register("description")} />

        {/* ================= TITLE + EXCERPT ================= */}
        <Row>
          {/* TITLE */}
          <Col lg={6}>
            <label className="form-label fw-semibold d-flex justify-content-between align-items-center">
              <span className="d-flex align-items-center">
                Blog Title
                <InfoTooltip text="Recommended maximum: 70 characters. Helps with SEO titles and clean layouts." />
              </span>

              <small
                className={`fw-medium ${titleValue.length > TITLE_LIMIT
                    ? "text-danger"
                    : "text-muted"
                  }`}
              >
                {titleValue.length}/{TITLE_LIMIT}
              </small>
            </label>

            <TextFormInput
              control={control}
              placeholder="Enter blog title"
              containerClassName="mb-1"
              id="blog-title"
              name="name"
              maxLength={TITLE_LIMIT}
            />

            {errors.name && (
              <p className="text-danger small">{errors.name.message}</p>
            )}
          </Col>

          {/* EXCERPT */}
          <Col lg={6}>
            <label className="form-label fw-semibold d-flex justify-content-between align-items-center">
              <span className="d-flex align-items-center">
                Excerpt
                <InfoTooltip text="Recommended maximum: 165 characters. Used in previews and meta descriptions." />
              </span>

              <small
                className={`fw-medium ${excerptValue.length > EXCERPT_LIMIT
                    ? "text-danger"
                    : "text-muted"
                  }`}
              >
                {excerptValue.length}/{EXCERPT_LIMIT}
              </small>
            </label>

            <TextFormInput
              control={control}
              name="reference"
              placeholder="Enter excerpt"
              containerClassName="mb-1"
              maxLength={EXCERPT_LIMIT}
            />

            {errors.reference && (
              <p className="text-danger small">{errors.reference.message}</p>
            )}
          </Col>
        </Row>

        {/* ================= URL + CATEGORY ================= */}
        <Row>
          <Col lg={6}>
            <label className="form-label fw-semibold d-flex align-items-center">
              URL Name
              <InfoTooltip text="SEO-friendly URL slug. Use lowercase letters, numbers, and hyphens only." />
            </label>

            <TextFormInput
              control={control}
              name="url"
              placeholder="enter-url-slug"
              containerClassName="mb-1"
              id="url-name"
            />

            {errors.url && (
              <p className="text-danger small">{errors.url.message}</p>
            )}

            {formErrors?.url && (
              <p className="text-danger small">{formErrors.url}</p>
            )}
          </Col>

          {/* CATEGORY */}
          <Col lg={6}>
            <label className="form-label fw-semibold d-flex align-items-center">
              Category
              <InfoTooltip text="Select a category for your blog post to help organize content." />
            </label>

            <select
              {...register("category")}
              className={`form-select ${errors.category ? 'is-invalid' : ''}`}
              id="blog-category"
            >
              <option value="">Select a category</option>
              <option value="business-setup">Business Setup & Company Formation </option>
              <option value="visa-residency">Visa & Residency</option>
              <option value="pro-government">PRO & Government Services</option>
              <option value="legal-compliance">Legal,Compliance & Finance</option>
            </select>

            {errors.category && (
              <p className="text-danger small">{errors.category.message}</p>
            )}
          </Col>
        </Row>

        {/* ================= DESCRIPTION ================= */}
        <Row>
          <Col lg={12}>
            <div className="mb-5 mt-3">
              <label className="form-label fw-semibold d-flex align-items-center">
                Blog Description
                <InfoTooltip text="Full blog content displayed on the details page. Rich text supported." />
              </label>

              <ReactQuill
                theme="snow"
                style={{ height: 195 }}
                value={descriptionContent}
                onChange={(val) => {
                  setDescriptionContent(val);
                  setValue("description", val, { shouldValidate: true });
                  updateBlogData({ description: val });
                }}
              />
            </div>

            {errors.description && (
              <p className="text-danger small mt-1">
                {errors.description.message}
              </p>
            )}
          </Col>
        </Row>
      </form>
    );
  }
);

export default GeneralDetailsForm;
