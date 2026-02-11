import { Card, Button, Badge } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useState } from "react";

const ProjectCard = ({ project, onView, onEdit, onDelete }) => {
      const [isHovered, setIsHovered] = useState(false);
  return (
    <Card className="h-100 shadow-sm border-0 rounded-3">
      {project.image && (
     <Card.Img
      variant="top"
      src={project.image}
      className="rounded-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: 180,
        objectFit: "cover",
        transform: isHovered ? "scale(0.98)" : "scale(1)",
        transition: "transform 0.3s ease-in-out"
      }}
    />
      )}

      <Card.Body>
        <h5 className="fw-semibold">{project.title}</h5>
        <p className="text-muted small">{project.excerpt}</p>

        <Badge bg={project.status === "draft" ? "warning" : "success"}>
          {project.status}
        </Badge>
      </Card.Body>

      <Card.Footer className="bg-transparent border-0 d-flex justify-content-center gap-3">
        <Button size="sm" variant="outline-info" className="rounded-3" onClick={onView}>
          <IconifyIcon icon="mdi:eye-outline" className="fs-20" />
        </Button>
        <Button size="sm" variant="outline-primary" className="rounded-3" onClick={onEdit}>
          <IconifyIcon icon="bx:edit"  className="fs-20"/>
        </Button>
        <Button size="sm" variant="outline-danger" className="rounded-3" onClick={onDelete}>
          <IconifyIcon icon="bx:trash"  className="fs-20"/>
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ProjectCard;
