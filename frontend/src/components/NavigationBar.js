import React, { useState, useEffect } from 'react';
import {
  Navbar, Nav, NavDropdown, Container,
  Form, FormControl, Button
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/NavigationBar.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [role, setRole] = useState('');


  useEffect(() => {
    axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/user/`, {
      withCredentials: true
    }).then(res => {
      setIsLoggedIn(true);
      setUsername(res.data.username);
      setFirstName(res.data.first_name);
      setRole(res.data.role); // ✅ This must exist
    }).catch(() => {
      setIsLoggedIn(false);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/logout/`, {}, {
        withCredentials: true
      });
      setIsLoggedIn(false);
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>

      <Navbar bg="primary" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Toggle aria-controls="navbarContent" />
          <Navbar.Collapse id="navbarContent">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">Home <i className="fa fa-home"></i></Nav.Link>
              <Nav.Link as={NavLink} to="/about">About Us <i className='fas fa-users'></i></Nav.Link>
              <Nav.Link as={NavLink} to="/catalogue">Catalogue <i className="fa fa-shopping-cart"></i></Nav.Link>
              <Nav.Link as={NavLink} to="/contact">Contact Us <i className="fa fa-envelope"></i></Nav.Link>

              {isLoggedIn ? (
                <NavDropdown title={`Account (${firstName || username})`} id="account-dropdown">
                  <NavDropdown.Item as={NavLink} to="/dashboard">
                    <i className="fas fa-user-circle"></i> My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/cart">
                    <i className="fa fa-credit-card"></i> Cart
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/orders/history">
                    <i className="fa fa-history"></i> Order History
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/orders/tracking">
                    <i className="fa fa-globe"></i> Order Tracking
                  </NavDropdown.Item>

                {/* Only vendors see this */}
                {role === 'vendor' && (
                  <NavDropdown.Item as={NavLink} to="/vendor/dashboard">
                  <i className="fas fa-briefcase"></i> Vendor Panel
                  </NavDropdown.Item>
                )}

                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="fa fa-sign-out-alt"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login">Account <i className="fas fa-user-circle"></i></Nav.Link>
                  <Nav.Link as={NavLink} to="/register">Register <i className="far fa-registered"></i></Nav.Link>
                </>
              )}
            </Nav>

            <Form className="d-flex" onSubmit={handleSearch}>
              <FormControl
                type="search"
                placeholder="Search products..."
                className="me-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-light" type="submit">
                <i className="fa fa-fw fa-search"></i>
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavigationBar;
