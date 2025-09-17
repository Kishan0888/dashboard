import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

export default function LoginPage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	if (user) return <Navigate to="/" replace />;

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate('/');
		} catch (err: any) {
			setError(err.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="xs" sx={{ mt: 8 }}>
			<Typography variant="h5" gutterBottom>Login</Typography>
			<Box component="form" onSubmit={onSubmit}>
				<TextField fullWidth margin="normal" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				{error && <Typography color="error" variant="body2">{error}</Typography>}
				<Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
				<Typography variant="body2" sx={{ mt: 2 }}>No account? <Link to="/signup">Sign up</Link></Typography>
			</Box>
		</Container>
	);
}
