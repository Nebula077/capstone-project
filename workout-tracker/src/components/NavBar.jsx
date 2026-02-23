import React from 'react'
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
  CNavLink,
} from '@coreui/react'
import { IoNotifications } from 'react-icons/io5'
import { CiUser } from 'react-icons/ci'
import '@coreui/coreui/dist/css/coreui.min.css'
import { Link } from 'react-router-dom'

function NavBar() {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <CNavbar expand="lg" className="bg-body-tertiary border-bottom border-gray-300 p-1 min-h-default">
        <CContainer fluid>
          <CNavbarBrand href="#">Workout Tracker</CNavbarBrand>
          <CNavbarToggler onClick={() => setVisible(!visible)} />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav className="me-auto">
              <CNavItem>
                <CNavLink href="Profile" active>
                  Home
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">Link</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">Pricing</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#" disabled>
                  Disabled
                </CNavLink>
              </CNavItem>
            </CNavbarNav>
            <CForm className="d-flex me-3">
              <CFormInput type="search" className="me-2" placeholder="Search" />
              <CButton type="submit" color="success" variant="outline">
                Search
              </CButton>
            </CForm>
            <div className="d-flex gap-3 align-items-center">
              <CButton
                color="link"
                className="position-relative"
                style={{ fontSize: '1.5rem' }}
              >
                <IoNotifications />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </CButton>
              <CButton
                color="link"
                style={{ fontSize: '1.5rem' }}
              >
                <CiUser />
              </CButton>
            </div>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  )
}

export default NavBar