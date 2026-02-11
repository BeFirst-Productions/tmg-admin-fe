import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductDetailView = ({ product }) => {
  const {
    title,
    excerpt,
    description,
    metaTitle,
    metaDescription,
    metaKeywords,
    canonical,
    url,
    status,
    createdAt,
    updatedAt
  } = product;

  const navigate = useNavigate();

  return (
    <Row className="justify-content-center px-2 px-md-0">
      <Col xs={12} md={11} lg={10}>

        <Card className="shadow-sm border-0">

          {/* ================= HEADER ================= */}
          <Card.Body className="p-3 p-md-4 border-bottom">
            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">

              <div>
                <h2 className="fw-bold text-dark mb-1 lh-sm">
                  {title || "—"}
                </h2>

                <div className="text-muted small d-flex flex-wrap gap-3">
                  {createdAt && (
                    <span>
                      <IconifyIcon icon="mdi:calendar-plus" className="me-1" />
                      Created: {new Date(createdAt).toLocaleDateString()}
                    </span>
                  )}
                  {updatedAt && (
                    <span>
                      <IconifyIcon icon="mdi:calendar-edit" className="me-1" />
                      Updated: {new Date(updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="d-flex align-items-start">
                <span
                  className={`badge px-3 py-2 ${
                    status === "draft" ? "bg-warning text-dark" : "bg-success"
                  }`}
                >
                  {status === "draft" ? "Draft" : "Published"}
                </span>
              </div>

            </div>
          </Card.Body>

          {/* ================= CONTENT ================= */}
          <Card.Body className="p-3 p-md-4 p-lg-3">

            {/* SUMMARY */}
            <section className="mb-5">
              <h5 className="fw-semibold text-dark mb-2">
                Summary
              </h5>

              <div className="border-start border-3 ps-3 text-muted fs-5">
                {excerpt || "—"}
              </div>
            </section>

            {/* FULL DESCRIPTION */}
            <section className="mb-5">
              <h5 className="fw-semibold text-dark mb-3">
                Full Description
              </h5>

              <div
                className="blog-content text-muted fs-5"
                style={{ lineHeight: "1.8" }}
                dangerouslySetInnerHTML={{ __html: description || "—" }}
              />
            </section>

            {/* ================= SEO DETAILS ================= */}
            <section className="mb-5">
              <h5 className="fw-semibold text-dark mb-3">
                SEO Details
              </h5>

              <Row className="gy-3">
                <Col md={6}>
                  <div className="border rounded p-3 h-100">
                    <strong>Meta Title</strong>
                    <div className="text-muted text-break mt-1">
                      {metaTitle || "—"}
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border rounded p-3 h-100">
                    <strong>Meta Keywords</strong>
                    <div className="text-muted text-break mt-1">
                      {metaKeywords || "—"}
                    </div>
                  </div>
                </Col>

                <Col md={12}>
                  <div className="border rounded p-3">
                    <strong>Meta Description</strong>
                    <div className="text-muted text-break mt-1">
                      {metaDescription || "—"}
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border rounded p-3 h-100">
                    <strong>Canonical URL</strong>
                    <div className="text-muted text-break mt-1">
                      {canonical || "—"}
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border rounded p-3 h-100">
                    <strong>Blog URL</strong>
                    <div className="text-muted text-break mt-1">
                      /{url || "—"}
                    </div>
                  </div>
                </Col>
              </Row>
            </section>

            {/* ================= ACTIONS ================= */}
            <div className="d-flex justify-content-center justify-content-lg-end gap-3 mt-4">
              <Button
                onClick={() => navigate("/blogs")}
                variant="outline-secondary"
                className="px-4 py-2 d-flex align-items-center gap-2 "
              >
                <IconifyIcon icon="bx:arrow-back" />
                Back to Blogs
              </Button>

              <Button
                onClick={() => navigate("/blogs")}
                variant="danger"
                className="px-4 py-2 d-flex align-items-center gap-2"
              >
                <IconifyIcon icon="bx:x" />
                Close
              </Button>
            </div>

          </Card.Body>
        </Card>

      </Col>
    </Row>
  );
};

export default ProductDetailView;
