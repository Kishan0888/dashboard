import { useEffect, useState } from 'react';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { AbandonedCart, LeadGeneration, MediaEngagement, Product, RecurringSales, SalesCampaign, TeamMember } from '../types';
import { Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';

const today = () => format(new Date(), 'yyyy-MM-dd');

export default function ChannelsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [members, setMembers] = useState<TeamMember[]>([]);

	useEffect(() => {
		(async () => {
			const pSnap = await getDocs(query(collection(db, 'products')));
			setProducts(pSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[]);
			const mSnap = await getDocs(query(collection(db, 'teamMembers')));
			setMembers(mSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as TeamMember[]);
		})();
	}, []);

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
        }}>
            <Card>
                <CardContent>
                    <SalesCampaignForm products={products} />
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <RecurringSalesForm products={products} members={members} />
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <AbandonedCartForm products={products} />
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <LeadGenerationForm products={products} />
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <MediaEngagementForm />
                </CardContent>
            </Card>
        </Box>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
	return <Typography variant="h6" sx={{ mb: 1 }}>{children}</Typography>;
}

function SalesCampaignForm({ products }: { products: Product[] }) {
	const [state, setState] = useState<Partial<SalesCampaign>>({ date: today() });
	const save = async () => {
		if (!state.productId) return;
		await addDoc(collection(db, 'salesCampaigns'), {
			...state,
			numOrders: Number(state.numOrders || 0),
			orderValue: Number(state.orderValue || 0),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		setState({ date: today() });
	};
	return (
		<Box>
			<SectionTitle>Sales Campaign</SectionTitle>
			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
				<TextField select label="Product" value={state.productId || ''} onChange={(e) => setState((s) => ({ ...s, productId: e.target.value }))} sx={{ minWidth: 200 }}>
					{products.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
				</TextField>
				<TextField label="No of orders" type="number" value={state.numOrders || ''} onChange={(e) => setState((s) => ({ ...s, numOrders: Number(e.target.value) }))} />
				<TextField label="Order value" type="number" value={state.orderValue || ''} onChange={(e) => setState((s) => ({ ...s, orderValue: Number(e.target.value) }))} />
				<TextField label="Date" type="date" value={state.date || today()} onChange={(e) => setState((s) => ({ ...s, date: e.target.value }))} />
				<Button variant="contained" onClick={save}>Save</Button>
			</Stack>
		</Box>
	);
}

function RecurringSalesForm({ products, members }: { products: Product[]; members: TeamMember[] }) {
	const [state, setState] = useState<Partial<RecurringSales>>({ date: today() });
	const save = async () => {
		if (!state.productId || !state.teamMemberId) return;
		await addDoc(collection(db, 'recurringSales'), {
			...state,
			numOrders: Number(state.numOrders || 0),
			orderValue: Number(state.orderValue || 0),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		setState({ date: today() });
	};
	return (
		<Box>
			<SectionTitle>Recurring Sales</SectionTitle>
			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
				<TextField select label="Product" value={state.productId || ''} onChange={(e) => setState((s) => ({ ...s, productId: e.target.value }))} sx={{ minWidth: 200 }}>
					{products.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
				</TextField>
				<TextField select label="Team Member" value={state.teamMemberId || ''} onChange={(e) => setState((s) => ({ ...s, teamMemberId: e.target.value }))} sx={{ minWidth: 200 }}>
					{members.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
				</TextField>
				<TextField label="No of orders" type="number" value={state.numOrders || ''} onChange={(e) => setState((s) => ({ ...s, numOrders: Number(e.target.value) }))} />
				<TextField label="Order value" type="number" value={state.orderValue || ''} onChange={(e) => setState((s) => ({ ...s, orderValue: Number(e.target.value) }))} />
				<TextField label="Date" type="date" value={state.date || today()} onChange={(e) => setState((s) => ({ ...s, date: e.target.value }))} />
				<Button variant="contained" onClick={save}>Save</Button>
			</Stack>
		</Box>
	);
}

function AbandonedCartForm({ products }: { products: Product[] }) {
	const [state, setState] = useState<Partial<AbandonedCart>>({ date: today() });
	const save = async () => {
		if (!state.productId) return;
		await addDoc(collection(db, 'abandonedCarts'), {
			...state,
			totalOrdersCreated: Number(state.totalOrdersCreated || 0),
			conversion: Number(state.conversion || 0),
			orderValue: Number(state.orderValue || 0),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		setState({ date: today() });
	};
	return (
		<Box>
			<SectionTitle>Abandoned Cart</SectionTitle>
			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
				<TextField select label="Product" value={state.productId || ''} onChange={(e) => setState((s) => ({ ...s, productId: e.target.value }))} sx={{ minWidth: 200 }}>
					{products.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
				</TextField>
				<TextField label="Total orders created" type="number" value={state.totalOrdersCreated || ''} onChange={(e) => setState((s) => ({ ...s, totalOrdersCreated: Number(e.target.value) }))} />
				<TextField label="Conversion %" type="number" value={state.conversion || ''} onChange={(e) => setState((s) => ({ ...s, conversion: Number(e.target.value) }))} />
				<TextField label="Order value" type="number" value={state.orderValue || ''} onChange={(e) => setState((s) => ({ ...s, orderValue: Number(e.target.value) }))} />
				<TextField label="Date" type="date" value={state.date || today()} onChange={(e) => setState((s) => ({ ...s, date: e.target.value }))} />
				<Button variant="contained" onClick={save}>Save</Button>
			</Stack>
		</Box>
	);
}

function LeadGenerationForm({ products }: { products: Product[] }) {
	const [state, setState] = useState<Partial<LeadGeneration>>({ date: today() });
	const save = async () => {
		if (!state.productId) return;
		await addDoc(collection(db, 'leadGenerations'), {
			...state,
			totalLeads: Number(state.totalLeads || 0),
			conversion: Number(state.conversion || 0),
			orderValue: Number(state.orderValue || 0),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		setState({ date: today() });
	};
	return (
		<Box>
			<SectionTitle>Lead Generation</SectionTitle>
			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
				<TextField select label="Product" value={state.productId || ''} onChange={(e) => setState((s) => ({ ...s, productId: e.target.value }))} sx={{ minWidth: 200 }}>
					{products.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
				</TextField>
				<TextField label="Total leads" type="number" value={state.totalLeads || ''} onChange={(e) => setState((s) => ({ ...s, totalLeads: Number(e.target.value) }))} />
				<TextField label="Conversion %" type="number" value={state.conversion || ''} onChange={(e) => setState((s) => ({ ...s, conversion: Number(e.target.value) }))} />
				<TextField label="Order value" type="number" value={state.orderValue || ''} onChange={(e) => setState((s) => ({ ...s, orderValue: Number(e.target.value) }))} />
				<TextField label="Date" type="date" value={state.date || today()} onChange={(e) => setState((s) => ({ ...s, date: e.target.value }))} />
				<Button variant="contained" onClick={save}>Save</Button>
			</Stack>
		</Box>
	);
}

function MediaEngagementForm() {
	const [state, setState] = useState<Partial<MediaEngagement>>({ date: today() });
	const save = async () => {
		await addDoc(collection(db, 'mediaEngagements'), {
			...state,
			numOrders: Number(state.numOrders || 0),
			totalOrderValue: Number(state.totalOrderValue || 0),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		setState({ date: today() });
	};
	return (
		<Box>
			<SectionTitle>Media Engagement</SectionTitle>
			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
				<TextField label="No of orders" type="number" value={state.numOrders || ''} onChange={(e) => setState((s) => ({ ...s, numOrders: Number(e.target.value) }))} />
				<TextField label="Total order value" type="number" value={state.totalOrderValue || ''} onChange={(e) => setState((s) => ({ ...s, totalOrderValue: Number(e.target.value) }))} />
				<TextField label="Date" type="date" value={state.date || today()} onChange={(e) => setState((s) => ({ ...s, date: e.target.value }))} />
				<Button variant="contained" onClick={save}>Save</Button>
			</Stack>
		</Box>
	);
}
