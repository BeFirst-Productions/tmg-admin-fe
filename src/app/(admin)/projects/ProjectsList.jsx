import { useEffect, useState, useMemo } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageMetaData from "@/components/PageTitle";
import { getProjects, deleteProject } from "@/api/apis";
import ProjectCard from "./components/ProjectCard";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 8;

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  /* ---------------- LOAD PROJECTS ---------------- */
  const loadProjects = async () => {
    try {
      const res = await getProjects();
      if (res?.success) {
        setProjects(res.data);
        setCurrentPage(1);
      }
    } catch {
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    const res = await deleteProject(id);
    if (res?.success) {
      toast.success("Project deleted");
      loadProjects();
    }
  };

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.max(
    1,
    Math.ceil(projects.length / ITEMS_PER_PAGE)
  );

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return projects.slice(start, start + ITEMS_PER_PAGE);
  }, [projects, currentPage]);

  /* ---------------- UI ---------------- */
  return (
    <>
      <PageBreadcrumb title="Projects" subName="Content" />
      <PageMetaData title="Projects" />

      {/* HEADER */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        {/* <h4 className="fw-bold mb-0">Projects</h4> */}
        <Button
          variant="success"
          className="rounded-3 px-4"
          onClick={() => navigate("/projects/add")}
        >
          + Add Project
        </Button>
      </div>

      {/* GRID */}
      <Row className="row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
        {paginatedProjects.map((project) => (
          <Col key={project._id}>
            <ProjectCard
              project={project}
              onView={() => navigate(`/projects/${project._id}`)}
              onEdit={() =>
                navigate(`/projects/edit/${project._id}`, {
                  state: { project },
                })
              }
              onDelete={() => handleDelete(project._id)}
            />
          </Col>
        ))}
      </Row>

      {/* EMPTY STATE */}
      {projects.length === 0 && (
        <div className="text-center text-muted py-5">
          No projects found
        </div>
      )}

      {/* PAGINATION */}
      {projects.length > 0 && (
        <div className="pagination-container">
          <button
            className="pg-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          <span className="pg-current">{currentPage}</span>

          <button
            className="pg-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* STYLES */}
      <style jsx>{`
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 48px;
          margin-bottom: 32px;
        }

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

        .pg-current {
          background: #1f6feb;
          color: #fff;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          min-width: 36px;
          text-align: center;
        }
      `}</style>
    </>
  );
};

export default ProjectsList;
