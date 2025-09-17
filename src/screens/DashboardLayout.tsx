import { AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, InputBase, Badge, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 280;
const collapsedWidth = 64;

export default function DashboardLayout() {
	const { logout, user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const onLogout = async () => {
		await logout();
		navigate('/login');
	};

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleProfileMenuClose = () => {
		setAnchorEl(null);
	};

	const menuItems = [
		{ path: '/', label: 'Overview', icon: <DashboardIcon /> },
		{ path: '/masters', label: 'Masters', icon: <PeopleIcon /> },
		{ path: '/channels', label: 'Channels', icon: <AnalyticsIcon /> },
		{ path: '/reports', label: 'Reports', icon: <AssessmentIcon /> },
	];

	const DrawerContent = (
		<Box sx={{ p: collapsed ? 1 : 2, height: '100%' }}>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
				<IconButton onClick={() => setCollapsed(!collapsed)} sx={{ mr: 1 }}>
					<MenuIcon />
				</IconButton>
				<AnimatePresence>
					{!collapsed && (
						<motion.div
							initial={{ opacity: 0, width: 0 }}
							animate={{ opacity: 1, width: 'auto' }}
							exit={{ opacity: 0, width: 0 }}
							transition={{ duration: 0.2 }}
						>
							<Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
								My Analytics
							</Typography>
						</motion.div>
					)}
				</AnimatePresence>
			</Box>
			<List>
				{menuItems.map((item) => (
					<motion.div
						key={item.path}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<ListItemButton 
							component={NavLink} 
							to={item.path} 
							selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))} 
							onClick={() => setMobileOpen(false)}
							sx={{ mb: 0.5 }}
						>
							<ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 40 }}>
								{item.icon}
							</ListItemIcon>
							<AnimatePresence>
								{!collapsed && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<ListItemText primary={item.label} />
									</motion.div>
								)}
							</AnimatePresence>
						</ListItemButton>
					</motion.div>
				))}
			</List>
		</Box>
	);

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
				<Toolbar>
					<IconButton color="inherit" edge="start" sx={{ mr: 2, display: { md: 'none' } }} onClick={() => setMobileOpen(!mobileOpen)}>
						<MenuIcon />
					</IconButton>
					
					{/* Search Bar */}
					<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', maxWidth: 400 }}>
						<Box sx={{ position: 'relative', width: '100%' }}>
							<Box sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'text.secondary' }}>
								<SearchIcon />
							</Box>
							<InputBase
								placeholder="Search..."
								sx={{
									pl: 4,
									pr: 2,
									py: 1,
									width: '100%',
									bgcolor: 'rgba(255, 255, 255, 0.1)',
									borderRadius: 2,
									'&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
									'&.Mui-focused': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
								}}
							/>
						</Box>
					</Box>

					{/* Right side actions */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<IconButton color="inherit">
							<Badge badgeContent={3} color="error">
								<NotificationsIcon />
							</Badge>
						</IconButton>
						
						<IconButton onClick={handleProfileMenuOpen} color="inherit">
							<Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
								{user?.email?.charAt(0).toUpperCase() || 'U'}
							</Avatar>
						</IconButton>
					</Box>

					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleProfileMenuClose}
						transformOrigin={{ horizontal: 'right', vertical: 'top' }}
						anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					>
						<MenuItem onClick={handleProfileMenuClose}>
							<AccountCircleIcon sx={{ mr: 1 }} />
							Profile
						</MenuItem>
						<Divider />
						<MenuItem onClick={onLogout}>
							Logout
						</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>

			<Box component="nav" sx={{ width: { md: collapsed ? collapsedWidth : drawerWidth }, flexShrink: { md: 0 } }} aria-label="navigation">
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={() => setMobileOpen(false)}
					ModalProps={{ keepMounted: true }}
					sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
				>
					{DrawerContent}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{ 
						display: { xs: 'none', md: 'block' }, 
						'& .MuiDrawer-paper': { 
							boxSizing: 'border-box', 
							width: collapsed ? collapsedWidth : drawerWidth,
							transition: 'width 0.3s ease-in-out',
						} 
					}}
					open
				>
					{DrawerContent}
				</Drawer>
			</Box>

			<Box component="main" sx={{ 
				flexGrow: 1, 
				p: { xs: 2, md: 3 }, 
				width: { md: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)` },
				transition: 'width 0.3s ease-in-out',
			}}>
				<Toolbar />
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<Outlet />
				</motion.div>
			</Box>
		</Box>
	);
}
