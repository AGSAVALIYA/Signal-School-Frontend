import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AccountCircleOutlined } from '@mui/icons-material';

/**
 * AccountMenu Component
 * 
 * A dropdown menu component that provides user account actions for the admin interface.
 * The menu is triggered by clicking on a user account icon and provides options for
 * profile management and logout functionality.
 * 
 * Features:
 * - Account circle icon trigger
 * - Dropdown menu with user actions
 * - Profile and account management options (placeholder)
 * - Logout functionality that clears session data
 * - Positioned relative to the trigger element
 * 
 * The component uses Material-UI's Menu component with proper positioning
 * and follows the application's design patterns.
 */
export default function AccountMenu() {
  // State to control menu open/close and anchor position
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  /**
   * Opens the account menu
   * 
   * @param {Event} event - Click event from the account icon
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  /**
   * Closes the account menu
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handles user logout
   * 
   * Clears all data from localStorage (including user info and access tokens)
   * and reloads the page to reset the application state, redirecting to login.
   */
  const handleLogout = () => {
      // Clear all stored user session data
      localStorage.clear();
      // Reload page to reset application state and redirect to login
      window.location.reload();
  }

  /**
   * Renders the account menu component
   */
  return (
    <div>
      {/* Account icon trigger */}
      <AccountCircleOutlined 
        onClick={handleClick} 
        sx={{ fontSize: 40, cursor: 'pointer' }}
      />
      
      {/* Dropdown menu with account options */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {/* Menu items - Profile and account management are placeholders */}
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}