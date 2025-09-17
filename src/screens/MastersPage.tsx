import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { Product, TeamMember } from '../types';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function MastersPage() {
	return (
		<Box sx={{
			display: 'grid',
			gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
			gap: 3,
		}}>
			<Card>
				<CardContent>
					<ProductManager />
				</CardContent>
			</Card>
			<Card>
				<CardContent>
					<TeamMemberManager />
				</CardContent>
			</Card>
		</Box>
	);
}

function ProductManager() {
	const [products, setProducts] = useState<Product[]>([]);
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');

	useEffect(() => {
		const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
		const unsub = onSnapshot(q, (snap) => {
			setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[]);
		});
		return () => unsub();
	}, []);

	const onAdd = async () => {
		if (!name.trim()) return;
		await addDoc(collection(db, 'products'), {
			name: name.trim(),
			active: true,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		setName('');
		setOpen(false);
	};

	const onDelete = async (id: string) => {
		await deleteDoc(doc(db, 'products', id));
	};

	return (
		<Box>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Typography variant="h6">Products</Typography>
				<Button variant="contained" onClick={() => setOpen(true)}>Add</Button>
			</Stack>
			<List>
				{products.map((p) => (
					<ListItem key={p.id}
						secondaryAction={<IconButton edge="end" onClick={() => onDelete(p.id)}><DeleteIcon /></IconButton>}>
						<ListItemText primary={p.name} secondary={p.active ? 'Active' : 'Inactive'} />
					</ListItem>
				))}
			</List>

			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Add Product</DialogTitle>
				<DialogContent>
					<TextField autoFocus fullWidth margin="dense" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={onAdd} variant="contained">Save</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

function TeamMemberManager() {
	const [members, setMembers] = useState<TeamMember[]>([]);
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	useEffect(() => {
		const q = query(collection(db, 'teamMembers'), orderBy('createdAt', 'desc'));
		const unsub = onSnapshot(q, (snap) => {
			setMembers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as TeamMember[]);
		});
		return () => unsub();
	}, []);

	const onAdd = async () => {
		if (!name.trim()) return;
		await addDoc(collection(db, 'teamMembers'), {
			name: name.trim(),
			email: email.trim() || undefined,
			active: true,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		setName('');
		setEmail('');
		setOpen(false);
	};

	const onDelete = async (id: string) => {
		await deleteDoc(doc(db, 'teamMembers', id));
	};

	return (
		<Box>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Typography variant="h6">Team Members</Typography>
				<Button variant="contained" onClick={() => setOpen(true)}>Add</Button>
			</Stack>
			<List>
				{members.map((m) => (
					<ListItem key={m.id}
						secondaryAction={<IconButton edge="end" onClick={() => onDelete(m.id)}><DeleteIcon /></IconButton>}>
						<ListItemText primary={m.name} secondary={m.email} />
					</ListItem>
				))}
			</List>

			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Add Team Member</DialogTitle>
				<DialogContent>
					<TextField autoFocus fullWidth margin="dense" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
					<TextField fullWidth margin="dense" label="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={onAdd} variant="contained">Save</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
