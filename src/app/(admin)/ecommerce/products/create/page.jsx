import { Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import CreateProductForms from './components/CreateBlogForms';
import PageMetaData from '@/components/PageTitle';
const CreateProduct = ({handleBlog}) => {
  return <>
      <PageBreadcrumb title="Create Blog" subName="Blog" />
      <PageMetaData title="Create Blog" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <CreateProductForms handleBlog={handleBlog} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>;
};
export default CreateProduct;