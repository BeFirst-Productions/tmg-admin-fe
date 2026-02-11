import clsx from 'clsx';
import { useState } from 'react';
import { Nav, NavItem, NavLink, TabContainer, TabContent, TabPane } from 'react-bootstrap';

const ProductImages = ({ product }) => {

  const [activeImageTab, setActiveImageTab] = useState("main-image");

  return (
    <TabContainer activeKey={activeImageTab}>
      <TabContent>
        <TabPane eventKey="main-image" className="fade show active">
          <img 
            src={product.image} 
            alt={product.title} 
            className="img-fluid mx-auto d-block rounded" 
          />
        </TabPane>
      </TabContent>
    </TabContainer>
  );
};

export default ProductImages;
