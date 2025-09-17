import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'light',
		primary: { 
			main: '#6366f1',
			light: '#818cf8',
			dark: '#4f46e5',
		},
		secondary: { 
			main: '#8b5cf6',
			light: '#a78bfa',
			dark: '#7c3aed',
		},
		background: { 
			default: '#f8fafc',
			paper: '#ffffff',
		},
		text: {
			primary: '#1e293b',
			secondary: '#64748b',
		},
	},
	shape: { borderRadius: 16 },
	typography: {
		fontFamily: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'].join(','),
		h4: { fontWeight: 700, fontSize: '1.75rem' },
		h5: { fontWeight: 600, fontSize: '1.5rem' },
		h6: { fontWeight: 600, fontSize: '1.25rem' },
		subtitle1: { fontWeight: 600 },
		subtitle2: { fontWeight: 500 },
	},
	components: {
		MuiButton: { 
			styleOverrides: { 
				root: { 
					textTransform: 'none', 
					borderRadius: 12,
					fontWeight: 500,
					boxShadow: 'none',
					'&:hover': {
						boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
					},
				},
				contained: {
					background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
					'&:hover': {
						background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
					},
				},
			} 
		},
		MuiCard: { 
			styleOverrides: { 
				root: { 
					borderRadius: 16,
					boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
					border: '1px solid rgba(226, 232, 240, 0.8)',
					transition: 'all 0.2s ease-in-out',
					'&:hover': {
						boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
						transform: 'translateY(-2px)',
					},
				} 
			} 
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
					boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
					borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
					borderRight: '1px solid rgba(226, 232, 240, 0.8)',
				},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					borderRadius: 12,
					margin: '4px 8px',
					'&.Mui-selected': {
						background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
						color: 'white',
						'&:hover': {
							background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
						},
					},
					'&:hover': {
						background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
					},
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: {
					background: 'rgba(99, 102, 241, 0.1)',
				},
				bar: {
					background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
				},
			},
		},
	},
});

export default theme;
