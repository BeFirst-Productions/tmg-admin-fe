import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Spinner, Badge } from "react-bootstrap";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageMetaData from "@/components/PageTitle";
import { getPackageById, deletePackage } from "@/api/apis.js";
import { toast } from "react-toastify";

// Backend flat field names:
// pkg.title, pkg.image (string URL),
// pkg.WithoutVisaPrice1, pkg.WithoutVisaPrice2 (capital W)
// pkg.withVisaPrice1, pkg.withVisaPrice2

const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!packageId) return;

    (async () => {
      try {
        const res = await getPackageById(packageId);
        if (res?.success) setPkg(res.data);
      } catch (err) {
        console.error("Failed to load package", err);
        toast.error("Failed to load package details");
      } finally {
        setLoading(false);
      }
    })();
  }, [packageId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await deletePackage(packageId);
      if (res?.success) {
        toast.success("Package deleted successfully");
        navigate("/packages");
      }
    } catch {
      toast.error("Failed to delete package");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="text-center py-5 text-muted">
        <p>Package not found.</p>
        <Button variant="outline-primary" onClick={() => navigate("/packages")}>
          Back to Packages
        </Button>
      </div>
    );
  }

  const imageUrl = typeof pkg.image === "string" ? pkg.image : null;

  return (
    <>
      <PageBreadcrumb title="Package Details" subName="Packages" />
      <PageMetaData title={pkg.title || "Package Details"} />

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4 p-lg-5">
          <Row className="g-4 align-items-start">

            {/* LEFT: IMAGE */}
            <Col lg={5} md={12}>
              {imageUrl ? (
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    maxHeight: 360,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={pkg.title}
                    className="img-fluid w-100"
                    style={{ objectFit: "cover", maxHeight: 360 }}
                  />
                </div>
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center rounded"
                  style={{
                    height: 280,
                    background: "linear-gradient(135deg, #1f2937, #374151)",
                    fontSize: 64,
                  }}
                >
                  📦
                </div>
              )}
            </Col>

            {/* RIGHT: DETAILS */}
            <Col lg={7} md={12}>
              <h2 className="fw-bold mb-4">{pkg.title}</h2>

              {/* WITHOUT VISA */}
              <div className="mb-4">
                <Badge
                  style={{ background: "#1f6feb", fontSize: "13px" }}
                  className="mb-2 px-3 py-2"
                >
                  Without Visa
                </Badge>
                <div className="d-flex gap-4 mt-2">
                  <div
                    className="p-3 rounded bg-primary-subtle"
                    style={{ minWidth: 120 }}
                  >
                    <div className="text-muted small mb-1">Price 1</div>
                    <div className="fw-bold fs-5">
                      AED {pkg?.WithoutVisaPrice1 ?? "—"}
                    </div>
                  </div>
                  <div
                    className="p-3 rounded bg-primary-subtle"
                    style={{ minWidth: 120 }}
                  >
                    <div className="text-muted small mb-1">Price 2</div>
                    <div className="fw-bold fs-5">
                      AED {pkg?.WithoutVisaPrice2 ?? "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* WITH VISA */}
              <div className="mb-5">
                <Badge
                  style={{ background: "#198754", fontSize: "13px" }}
                  className="mb-2 px-3 py-2"
                >
                  With Visa
                </Badge>
                <div className="d-flex gap-4 mt-2">
                  <div
                    className="p-3 rounded bg-success-subtle"
                    style={{ minWidth: 120 }}
                  >
                    <div className="text-muted small mb-1">Price 1</div>
                    <div className="fw-bold fs-5">
                      AED {pkg?.withVisaPrice1 ?? "—"}
                    </div>
                  </div>
                  <div
                    className="p-3 rounded bg-success-subtle"
                    style={{ minWidth: 120 }}
                  >
                    <div className="text-muted small mb-1">Price 2</div>
                    <div className="fw-bold fs-5">
                      AED {pkg?.withVisaPrice2 ?? "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    navigate(`/packages/edit/${pkg._id}`, {
                      state: { pkg },
                    })
                  }
                >
                  Edit Package
                </Button>
                <Button variant="outline-danger" onClick={handleDelete}>
                  Delete Package
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/packages")}
                >
                  Back to Packages
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default PackageDetails;
