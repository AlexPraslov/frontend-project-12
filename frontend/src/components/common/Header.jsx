import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { ChatLeftText } from 'react-bootstrap-icons'

const Header = () => {
  const { isAuthenticated, logout, username } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid="lg">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold">
          <ChatLeftText className="me-2" size={24} />
          {t('header.title')}
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center">
          {isAuthenticated ? (
            <>
              <Nav.Item className="text-white me-3">
                <small>
                  {t('header.welcome')}
                  {' '}
                  <strong>{username}</strong>
                </small>
              </Nav.Item>
              <Button
                variant="light"
                size="sm"
                onClick={handleLogout}
                className="text-primary"
              >
                {t('header.logout')}
              </Button>
            </>
          ) : (
            <>
              <Button
                as={Link}
                to="/login"
                variant="outline-light"
                size="sm"
                className="me-2"
              >
                {t('header.login')}
              </Button>
              <Button
                as={Link}
                to="/signup"
                variant="light"
                size="sm"
                className="text-primary"
              >
                {t('header.signup')}
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Header
