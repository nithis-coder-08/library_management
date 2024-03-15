import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';


const NavMenus = [
  {
    name: 'Dashboard',
    path: '/',
  },
  {
    name: 'Books',
    path: '/books',
  },
  {
    name: 'Members',
    path: '/members',
  },
];

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div className="flex space-x-2 font-semibold">
              <p className="text-xl text-amber-500">Library</p>
              <p className="text-xl text-lime-500"> Management</p>
            </div>
          </Typography>
          <div className="hidden sm:flex gap-[4vw] px-3">
            {NavMenus.map((menu) => (
              <NavLink
                key={menu.name}
                to={menu.path}
                className={({ isActive, isPending }) =>
                  isActive
                    ? 'font-semibold text-md hidden sm:block'
                    : isPending
                    ? 'text-md  hover:text-default-500 transition-all duration-800 sm:block hidden text-default-400'
                    : 'text-md hover:text-default-400 transition-all duration-800 sm:block hidden text-default-600'
                }
              >
                {menu.name}
              </NavLink>
            ))}
          </div>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ display: { sm: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {NavMenus.map((menu) => (
              <MenuItem key={menu.name}>
                <NavLink
                  to={menu.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive, isPending }) =>
                    isActive
                      ? 'font-semibold text-md sm:hidden'
                      : isPending
                      ? 'text-md  hover:text-default-400 transition-all duration-800 sm:hidden text-default-500'
                      : 'text-md hover:text-default-400 transition-all duration-800 sm:hidden  text-default-500'
                  }
                >
                  {menu.name}
                </NavLink>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Nav;
