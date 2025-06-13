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
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/user/`, { withCredentials: true })
      .then(res => {
        setIsLoggedIn(true);
        setUsername(res.data.username);
        setFirstName(res.data.first_name);
        setRole(res.data.role);
      }).catch(() => setIsLoggedIn(false));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/cart/`, { withCredentials: true })
        .then(res => {
          const totalQuantity = res.data.cart.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(totalQuantity);
        }).catch(() => setCartCount(0));
    }
  }, [isLoggedIn]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/logout/`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarContent" />

        <Navbar.Collapse id="navbarContent">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Home <i className="fa fa-home"></i>
            </Nav.Link>

            <NavDropdown
              title={
                <span className="d-inline-flex align-items-center gap-1">
                  About Us <i className="fas fa-users hide-at-1024"></i>
                </span>
              }
              id="about-dropdown"
            >
              <NavDropdown.Item as={NavLink} to="/about">
                <i className="fas fa-sitemap"></i> Our Company
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/vendors">
                <i className="fas fa-store"></i> Vendor Partner
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/">
                <i class="fa fa-pencil"></i> Our Blog
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/">
                <i class='fas fa-newspaper'></i> Our News
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={NavLink} to="/catalogue">
              Catalogue <i className="fa fa-shopping-bag hide-at-1024"></i>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact Us <i className="fa fa-envelope hide-at-1024"></i>
            </Nav.Link>

            {isLoggedIn ? (
              <>
                <NavDropdown
                  title={
                    <span className="d-inline-flex align-items-center gap-1">
                      Account ({firstName || username})
                    </span>
                  }
                  id="account-dropdown"
                >
                  <NavDropdown.Item as={NavLink} to="/dashboard">
                    <i className="fas fa-user-circle"></i> My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/orders/history">
                    <i className="fa fa-history"></i> Order History
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/orders/tracking">
                    <i className="fa fa-globe"></i> Order Tracking
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/nova">
                    <i className="fas fa-headset me-2"></i> Help Desk
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/ai-agent">
                    <i className="fa fa-heart"></i> Ask Dr.AI
                  </NavDropdown.Item>
                  {role === 'vendor' && (
                    <NavDropdown.Item as={NavLink} to="/vendor/dashboard">
                      <i className="fas fa-briefcase"></i> Vendor Panel
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="fa fa-sign-out-alt"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>

                {/* Cart next to Account */}
                <Nav.Link as={NavLink} to="/cart" className="cart-icon-link ms-2">
                  <span className="cart-icon-wrapper"> Cart 
                    <i className="fa fa-shopping-cart"></i>
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </span>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Login <i className="fas fa-sign-in-alt hide-at-1024"></i>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register">
                  Register <i className="far fa-registered hide-at-1024"></i>
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Search Bar */}
          <Form className="d-flex mt-2 mt-lg-0" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search products..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="light" type="submit">
              <i className="fa fa-search"></i>
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
