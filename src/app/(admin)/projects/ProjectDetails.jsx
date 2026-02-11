import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageMetaData from "@/components/PageTitle";
import { getProjectById } from "@/api/apis.js";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    (async () => {
      try {
        const res = await getProjectById(projectId);
        if (res?.success) setProject(res.data);
      } catch (err) {
        console.error("Failed to load project", err);
      }
    })();
  }, [projectId]);

  if (!project) return null;

  return (
    <>
      <PageBreadcrumb title="Project Details" subName="Projects" />
      <PageMetaData title={project.title} />

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4 p-lg-5">
          <Row className="g-4 align-items-start">
            
            {/* LEFT: PROJECT IMAGE */}
            <Col lg={5} md={12}>
              {project.image ? (
                <div className="project-image-wrapper">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="img-fluid rounded shadow-sm w-100"
                  />
                </div>
              ) : (
                <div className="bg-light rounded d-flex align-items-center justify-content-center"
                     style={{ height: 280 }}>
                  <span className="text-muted">No Image Available</span>
                </div>
              )}
            </Col>

            {/* RIGHT: PROJECT CONTENT */}
            <Col lg={7} md={12}>
              <div className="project-content">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <h2 className="fw-bold mb-0">{project.title}</h2>
                  <Badge
                    bg={project.status === "draft" ? "warning" : "success"}
                    className="text-capitalize"
                  >
                    {project.status}
                  </Badge>
                </div>

                <p className="text-muted fs-5 mb-4">
                  {project.excerpt}
                </p>

                <div
                  className="project-description fs-5"
                  style={{ lineHeight: "1.8" }}
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />

                {/* ACTIONS */}
                <div className="mt-5 d-flex flex-wrap gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      navigate(`/projects/edit/${project._id}`, {
                        state: { project },
                      })
                    }
                  >
                    Edit Project
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={() => navigate("/projects")}
                  >
                    Back to Projects
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* OPTIONAL: SMALL CSS FOR POLISH */}
      <style jsx>{`
        .project-image-wrapper img {
          max-height: 420px;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .project-image-wrapper img {
            max-height: 260px;
          }
        }
      `}</style>
    </>
  );
};

export default ProjectDetails;
