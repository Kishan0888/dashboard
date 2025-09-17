import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { AbandonedCart, LeadGeneration, MediaEngagement, Product, RecurringSales, SalesCampaign } from '../types';
import { Box, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Pie, PieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA66CC'];

export default function ReportsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [selectedProductId, setSelectedProductId] = useState<string>('');
	const [sales, setSales] = useState<SalesCampaign[]>([]);
	const [recurring, setRecurring] = useState<RecurringSales[]>([]);
	const [abandoned, setAbandoned] = useState<AbandonedCart[]>([]);
	const [leads, setLeads] = useState<LeadGeneration[]>([]);
	const [media, setMedia] = useState<MediaEngagement[]>([]);

	useEffect(() => {
		(async () => {
			const [p, s, r, a, l, m] = await Promise.all([
				getDocs(collection(db, 'products')),
				getDocs(collection(db, 'salesCampaigns')),
				getDocs(collection(db, 'recurringSales')),
				getDocs(collection(db, 'abandonedCarts')),
				getDocs(collection(db, 'leadGenerations')),
				getDocs(collection(db, 'mediaEngagements')),
			]);
			setProducts(p.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[]);
			setSales(s.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as SalesCampaign[]);
			setRecurring(r.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as RecurringSales[]);
			setAbandoned(a.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as AbandonedCart[]);
			setLeads(l.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as LeadGeneration[]);
			setMedia(m.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as MediaEngagement[]);
		})();
	}, []);

	const productOptions = useMemo(() => [{ id: '', name: 'All products' }, ...products], [products]);

	const filteredSales = useMemo(() => selectedProductId ? sales.filter((x) => x.productId === selectedProductId) : sales, [sales, selectedProductId]);
	const filteredRecurring = useMemo(() => selectedProductId ? recurring.filter((x) => x.productId === selectedProductId) : recurring, [recurring, selectedProductId]);
	const filteredAbandoned = useMemo(() => selectedProductId ? abandoned.filter((x) => x.productId === selectedProductId) : abandoned, [abandoned, selectedProductId]);
	const filteredLeads = useMemo(() => selectedProductId ? leads.filter((x) => x.productId === selectedProductId) : leads, [leads, selectedProductId]);

	const salesByProduct = useMemo(() => {
		const map = new Map<string, number>();
		for (const s of sales) {
			map.set(s.productId, (map.get(s.productId) || 0) + Number(s.orderValue || 0));
		}
		return Array.from(map.entries()).map(([productId, value]) => ({ name: products.find((p) => p.id === productId)?.name || productId, value }));
	}, [sales, products]);

	const totalOrderValueByChannel = useMemo(() => {
		return [
			{ name: 'Sales', value: filteredSales.reduce((a, b) => a + Number(b.orderValue || 0), 0) },
			{ name: 'Recurring', value: filteredRecurring.reduce((a, b) => a + Number(b.orderValue || 0), 0) },
			{ name: 'Abandoned', value: filteredAbandoned.reduce((a, b) => a + Number(b.orderValue || 0), 0) },
			{ name: 'Leads', value: filteredLeads.reduce((a, b) => a + Number(b.orderValue || 0), 0) },
			{ name: 'Media', value: media.reduce((a, b) => a + Number(b.totalOrderValue || 0), 0) },
		];
	}, [filteredSales, filteredRecurring, filteredAbandoned, filteredLeads, media]);

	return (
		<Box>
			<Stack direction="row" spacing={2} sx={{ mb: 3 }}>
				<TextField select label="Product filter" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} sx={{ minWidth: 240 }}>
					{productOptions.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
				</TextField>
			</Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>Sales by product</Typography>
                        <Box sx={{ height: { xs: 260, md: 320 } }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={salesByProduct} dataKey="value" nameKey="name" outerRadius={100} label>
                                        {salesByProduct.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>Total order value by channel</Typography>
                        <Box sx={{ height: { xs: 260, md: 320 } }}>
                            <ResponsiveContainer>
                                <BarChart data={totalOrderValueByChannel}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#4f46e5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
		</Box>
	);
}
