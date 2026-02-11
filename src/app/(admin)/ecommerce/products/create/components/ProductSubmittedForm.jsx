import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Card, Col, Row, Badge } from "react-bootstrap";

const ProductSubmittedForm = ({ blogData }) => {
  const imageSrc = blogData.image
    ? URL.createObjectURL(blogData.image)
    : blogData.existingImage || null;

  return (
    <Row className="justify-content-center px-2 px-md-0">
      <Col xs={12} md={11} lg={9}>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-3 p-md-4">

            {/* Header */}
            <div className="text-center mb-4">
              <IconifyIcon
                icon="bx:check-double"
                className="text-success mb-2"
                style={{ fontSize: "2.5rem" }}
              />
              <h3 className="fw-bold mb-1 fs-4 fs-md-3">
                Review & Submit
              </h3>
              <p className="text-muted mb-0 fs-6">
                Please review the blog details below before publishing.
              </p>
            </div>

            <Row className="gy-4">

              {/* Blog Image Preview */}
              <Col xs={12} lg={5}>
                <div className="border rounded p-3 h-100 text-center">
                  <h6 className="fw-semibold mb-3">
                    Featured Image
                  </h6>

                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Blog Preview"
                      className="img-fluid rounded w-100"
                      style={{
                        maxHeight: "260px",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <div className="text-muted py-5">
                      No image selected
                    </div>
                  )}
                </div>
              </Col>

              {/* Blog Summary */}
              <Col xs={12} lg={7}>
                <div className="border rounded p-3 h-100">
                  <h6 className="fw-semibold mb-3">
                    Blog Summary
                  </h6>

                  <div className="mb-3">
                    <strong>Title</strong>
                    <div className="text-muted text-break">
                      {blogData.title || "—"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <strong>Excerpt</strong>
                    <div className="text-muted text-break">
                      {blogData.excerpt || "—"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <strong>URL</strong>
                    <div className="text-muted text-break">
                      /{blogData.url || "—"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <strong>Meta Title</strong>
                    <div className="text-muted text-break">
                      {blogData.metaTitle || "—"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <strong>Meta Description</strong>
                    <div className="text-muted text-break">
                      {blogData.metaDescription || "—"}
                    </div>
                  </div>

                  <div className="mt-3">
                    <Badge bg="success" className="px-3 py-2">
                      Ready to Publish
                    </Badge>
                  </div>
                </div>
              </Col>

            </Row>

          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductSubmittedForm;
