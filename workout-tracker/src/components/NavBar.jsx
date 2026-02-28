import { useState } from 'react'
import {
  CButton,
  CCollapse,
  CContainer,
  CForm,
  CFormInput,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { CiUser } from 'react-icons/ci'
import '@coreui/coreui/dist/css/coreui.min.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx';

function NavBar() {
  const [visible, setVisible] = useState(false)
  const [term, setTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { query } = useParams()
  const user = useAuth().user

  const handleSearch = (e) => {
    e.preventDefault()
    const q = term.trim()
    if (!q) return

    setSearchQuery(q)
    navigate(`/results?query=${encodeURIComponent(q)}&source=wger`)
    setVisible(false)
  }

  return (
    <>
      <CNavbar expand="lg" className="bg-body-tertiary border-bottom border-gray-300 p-1 min-h-default">
        <CContainer fluid>
          <CNavbarBrand>
            <Link to="/" className="text-decoration-none text-dark">
              Workout Tracker
            </Link>
          </CNavbarBrand>
          <CNavbarToggler onClick={() => setVisible(!visible)} />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav className="me-auto">
              <CNavItem>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </CNavItem>
              <CNavItem>
                <Link to="/exercises" className="nav-link">
                  Exercises
                </Link>
              </CNavItem>
              <CNavItem>
                <Link to="/add-exercise" className="nav-link" hidden>
                  Add Exercise
                </Link>
              </CNavItem>
              <CNavItem>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </CNavItem>
              <CDropdown variant="nav-item" popper={false}>
                <CDropdownToggle color="secondary">More</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={() => navigate('/add-exercise')}>
                    Add Exercise
                  </CDropdownItem>
                  <CDropdownItem onClick={() => navigate('/workout')}>
                    My Workouts
                  </CDropdownItem>
                  <CDropdownItem hidden onClick={() => navigate(user ? '/profile' : '/login')}>
                    {user ? "Profile" : "Login"}
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CNavbarNav>
            <CForm className="d-flex me-3" onSubmit={handleSearch}>
              <CFormInput
                type="search"
                className="me-2"
                placeholder="Search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              <CButton type="submit" color="success" variant="outline">
                Search
              </CButton>
            </CForm>
            <div className="d-flex gap-3 align-items-center">
              <CButton
                style={{ fontSize: '1.5rem' }}
                onClick={() => navigate(user ? "/profile" : "/signup")}
              >
                <CiUser className="text-dark" />
              </CButton>
            </div>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  )
}

export default NavBar