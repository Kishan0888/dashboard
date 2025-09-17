import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { useAuth } from './auth';
import LoginPage from './screens/LoginPage';
import SignupPage from './screens/SignupPage';
import DashboardLayout from './screens/DashboardLayout';
import MastersPage from './screens/MastersPage';
import ChannelsPage from './screens/ChannelsPage';
import ReportsPage from './screens/ReportsPage';
import OverviewPage from './screens/OverviewPage';

function Protected() {
	const { user, loading } = useAuth();
	if (loading) return null;
	if (!user) return <Navigate to="/login" replace />;
	return <Outlet />;
}

export const router = createBrowserRouter([
	{ path: '/login', element: <LoginPage /> },
	{ path: '/signup', element: <SignupPage /> },
	{
		path: '/',
		element: <Protected />,
		children: [
			{
				path: '/',
				element: <DashboardLayout />,
				children: [
					{ index: true, element: <OverviewPage /> },
					{ path: 'masters', element: <MastersPage /> },
					{ path: 'channels', element: <ChannelsPage /> },
					{ path: 'reports', element: <ReportsPage /> },
				],
			},
		],
	},
]);
