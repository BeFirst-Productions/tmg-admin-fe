import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageMetaData from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { deleteBlog, getBlogs } from "@/api/apis";
import DeleteConfrimModal from "../../Common/DeleteConfrimModal";
import { toast } from "react-toastify";

/* -----------------------------------------
   Blog Card Component
------------------------------------------ */
const BlogCard = ({ post, onDelete, onEdit, onView }) => {
  const { title, image, excerpt, updatedAt } = post;
      const [isHovered, setIsHovered] = useState(false);

  return (
    <Card className="h-100 shadow-sm border-0 rounded-3">
      <CardBody>
        <div className="text-center">

          {/* Image */}
          {image && (
            <img
              src={image}
              alt={title}
                   onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
              className="img-fluid rounded mb-3 rounded-3"
                  style={{
        height: 180,
        objectFit: "cover",
        width: "100%",
        transform: isHovered ? "scale(1.03)" : "scale(1)",
        transition: "transform 0.3s ease-in-out"
      }}
            />
          )}

          {/* Title */}
          <h4 className="fs-18 mt-2 fw-semibold">
            {title}
          </h4>

          {/* Date */}
          <div className="text-muted small mb-2">
            <IconifyIcon icon="mdi:calendar" className="me-1" />
            {new Date(updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Excerpt */}
          <p style={{ minHeight: 60 }}>
            {excerpt}
          </p>

          {/* Actions */}
          <div className="d-flex justify-content-center gap-2 mt-2">
            <Button
              variant="outline-info"
              size="sm"
              className="rounded-3"
              onClick={() => onView(post)}
            >
              <IconifyIcon icon="mdi:eye-outline" className="fs-20" />
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              className="rounded-3"
              onClick={() => onEdit(post)}
            >
              <IconifyIcon icon="bx:edit" className="fs-20" />
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              className="rounded-3"
              onClick={() => onDelete(post)}
            >
              <IconifyIcon icon="bx:trash" className="fs-20" />
            </Button>
          </div>

        </div>
      </CardBody>
    </Card>
  );
};

/* -----------------------------------------
   Blogs Page
------------------------------------------ */
const Blogs = () => {
  const [blogData, setBlogData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const navigate = useNavigate();

  /* -----------------------------------------
     Fetch Blogs
  ------------------------------------------ */
  const fetchBlogs = async () => {
    const url = `/?page=${page}&limit=8`;
    const response = await getBlogs(url);

    if (response?.success) {
      setBlogData(response.data);
      setTotalPages(response.totalPages);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  /* -----------------------------------------
     Delete handlers
  ------------------------------------------ */
  const handleDeleteClick = (post) => {
    setSelectedBlog(post);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteBlog(selectedBlog._id);

      if (res.success) {
        toast.success(res.message);
        fetchBlogs();
        setDeleteModal(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <PageBreadcrumb subName="Pages" title="Blogs" />

        <Button
          variant="success"
          size="sm"
          onClick={() => navigate("/blogs/add-blog")}
        >
          <IconifyIcon icon="bx:plus" className="me-1" />
          Add Blog
        </Button>
      </div>

      <PageMetaData title="Blog" />

      {/* Blog List */}
      <Row className="row-cols-1 row-cols-md-2 row-cols-xl-4 gx-3">
        {blogData.length > 0 ? (
          blogData.map((post) => (
            <Col key={post._id} className="mb-3">
              <BlogCard
                post={post}
                onDelete={handleDeleteClick}
                onEdit={(p) =>
                  navigate(`/blogs/edit-blog/${p._id}`, {
                    state: { blog: p }
                  })
                }
                onView={(p) =>
                  navigate(`/blogs/details/${p._id}`)
                }
              />
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <p className="fs-5 fw-medium text-muted">
              No Blogs Found
            </p>
          </Col>
        )}
      </Row>

      {/* Pagination */}
      {blogData.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteConfrimModal
          confirmDelete={confirmDelete}
          isDeleting={isDeleting}
          handleModal={() => setDeleteModal(false)}
          blogToDelete={selectedBlog}
        />
      )}
    </>
  );
};

export default Blogs;
