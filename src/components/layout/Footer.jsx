import { currentYear, developedBy, developedByLink } from '@/context/constants';
import { Col, Container, Row } from 'react-bootstrap';
import { useLayoutContext } from '@/context/useLayoutContext';

const Footer = () => {
  const { theme } = useLayoutContext();
  const isDark = theme === 'dark';

  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col xs={12} className="text-center">
            <span className="icons-center">
              {currentYear} © TMG GLOBAL Admin Panel&nbsp;
              &nbsp;by&nbsp;
              {/* <a href={developedByLink} className="fw-bold footer-text" target="_blank" rel="noopener noreferrer">

              <img 
                src={isDark ? '/next-logo.png' : '/next-logo-dark.png'}
                alt="TMG GLOBAL Logo" 
                className="footer-logo"
                style={{
                  width: '60px',
                  height: '20px',
                  verticalAlign: 'middle',
                  margin: '0 2px',
                  objectFit: 'contain'
                }}
                />
                </a> */}
              <span className="fw-bold footer-text" target="_blank" rel="noopener noreferrer">
                {developedBy}
              </span>
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;