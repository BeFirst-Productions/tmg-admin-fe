import { useEffect, useState } from "react";
import { Row, Col, Button, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageMetaData from "@/components/PageTitle";
import { getPackages, deletePackage } from "@/api/apis";
import PackageCard from "./components/PackageCard";
import { toast } from "react-toastify";

const MAX_PACKAGES = 8;

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  /* ---------------- LOAD ---------------- */
  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await getPackages();
      if (res?.success) {
        setPackages(res.data || []);
      } else {
        setPackages([]);
      }
    } catch {
      toast.error("Failed to load packages");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  /* ---------------- DELETE ACTIONS ---------------- */
  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!packageToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deletePackage(packageToDelete._id);
      if (res?.success) {
        toast.success("Package deleted successfully");
        setShowDeleteModal(false);
        loadPackages();
      }
    } catch {
      toast.error("Failed to delete package");
    } finally {
      setIsDeleting(false);
      setPackageToDelete(null);
    }
  };

  const canAddMore = packages.length < MAX_PACKAGES;

  /* ---------------- UI ---------------- */
  return (
    <>
      <PageBreadcrumb title="Packages" subName="Content" />
      <PageMetaData title="Packages" />

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <small className="text-muted">
            {packages.length} / {MAX_PACKAGES} packages added
          </small>
          {/* progress bar */}

        </div>

        <Button
          variant="success"
          className="rounded-3 px-4"
          disabled={!canAddMore}
          title={!canAddMore ? `Maximum ${MAX_PACKAGES} packages allowed` : ""}
          onClick={() => navigate("/packages/add")}
        >
          + Add Package
        </Button>
      </div>

      {!canAddMore && (
        <div
          className="alert alert-warning d-flex align-items-center gap-2 mb-4"
          role="alert"
        >
          <span>⚠️</span>
          <span>
            Maximum of <strong>{MAX_PACKAGES} packages</strong> reached. Delete
            an existing package to add a new one.
          </span>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* GRID */}
      {!loading && (
        <Row className="row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
          {packages.map((pkg) => (
            <Col key={pkg._id}>
              <PackageCard
                project={pkg}
                onView={() => navigate(`/packages/${pkg._id}`)}
                onEdit={() =>
                  navigate(`/packages/edit/${pkg._id}`, {
                    state: { pkg },
                  })
                }
                onDelete={() => handleDeleteClick(pkg)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* EMPTY STATE */}
      {!loading && packages.length === 0 && (
        <div className="text-center text-muted py-5">
          <p className="fs-5">No packages found</p>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/packages/add")}
          >
            Add your first package
          </Button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{packageToDelete?.title}</strong>? 
          <br />
          <span className="text-danger small mt-2 d-block">This action cannot be undone.</span>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* STYLES */}
      <style>{`
        .pg-btn {
          background: transparent;
          border: 1px solid #2e3640;
          color: #cfd3da;
          padding: 8px 18px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pg-btn:hover:not(:disabled) {
          background: #1f6feb;
          border-color: #1f6feb;
          color: #fff;
        }
        .pg-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default PackageList;

