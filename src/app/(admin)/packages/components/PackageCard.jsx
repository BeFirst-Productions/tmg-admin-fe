import { Card, Button } from "react-bootstrap";
import { useState } from "react";

// Backend returns flat fields:
// pkg.title, pkg.image (string URL), pkg.withVisaPrice1, pkg.withVisaPrice2,
// pkg.WithoutVisaPrice1 (capital W), pkg.WithoutVisaPrice2

const PackageCard = ({ project: pkg, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Backend returns image as a direct URL string
  const imageUrl = typeof pkg?.image === "string" ? pkg.image : null;

  return (
    <Card
      className="h-100 shadow-sm border-0 rounded-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 8px 24px rgba(0,0,0,0.18)"
          : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Image */}
      {imageUrl ? (
        <div
          style={{
            height: 160,
            overflow: "hidden",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <img
            src={imageUrl}
            alt={pkg?.title || "Package"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          style={{
            height: 160,
            borderRadius: "12px 12px 0 0",
            background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: 40,
          }}
        >
          📦
        </div>
      )}

      <Card.Body className="p-3">
        {/* Title */}
        <h6
          className="fw-bold mb-3"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={pkg?.title}
        >
          {pkg?.title || "Untitled Package"}
        </h6>

        {/* Pricing Section */}
        <div className="mb-3">
          {/* Without Visa — backend fields: WithoutVisaPrice1, WithoutVisaPrice2 */}
          <div className="mb-2">
            <span
              className="badge mb-1"
              style={{ background: "#1f6feb", fontSize: "10px" }}
            >
              Without Visa
            </span>
            <div className="d-flex gap-3">
              <small className="text-muted">
                P1:{" "}
                <strong className="text-primary">
                  {pkg?.WithoutVisaPrice1 != null ? `AED ${pkg.WithoutVisaPrice1}` : "—"}
                </strong>
              </small>
              <small className="text-muted">
                P2:{" "}
                <strong className="text-primary">
                  {pkg?.WithoutVisaPrice2 != null ? `AED ${pkg.WithoutVisaPrice2}` : "—"}
                </strong>
              </small>
            </div>
          </div>

          {/* With Visa — backend fields: withVisaPrice1, withVisaPrice2 */}
          <div>
            <span
              className="badge mb-1"
              style={{ background: "#198754", fontSize: "10px" }}
            >
              With Visa
            </span>
            <div className="d-flex gap-3">
              <small className="text-muted">
                P1:{" "}
                <strong className="text-success">
                  {pkg?.withVisaPrice1 != null ? `AED ${pkg.withVisaPrice1}` : "—"}
                </strong>
              </small>
              <small className="text-muted">
                P2:{" "}
                <strong className="text-success">
                  {pkg?.withVisaPrice2 != null ? `AED ${pkg.withVisaPrice2}` : "—"}
                </strong>
              </small>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2 mt-auto">
          <Button
            size="sm"
            variant="outline-primary"
            className="flex-fill"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            className="flex-fill"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PackageCard;
