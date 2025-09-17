import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { AbandonedCart, LeadGeneration, MediaEngagement, RecurringSales, SalesCampaign } from '../types';
import { Box, Card, CardContent, LinearProgress, Stack, Typography, Chip } from '@mui/material';
import { formatNumber } from '../utils/format';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function StatCard({ title, value, subtitle, icon, color = 'primary' }: { 
	title: string; 
	value: string; 
	subtitle?: string; 
	icon?: React.ReactNode;
	color?: 'primary' | 'secondary' | 'success' | 'warning';
}) {
	const colorMap = {
		primary: '#6366f1',
		secondary: '#8b5cf6',
		success: '#10b981',
		warning: '#f59e0b',
	};

	return (
		<motion.div
			whileHover={{ scale: 1.02, y: -4 }}
			transition={{ duration: 0.2 }}
		>
			<Card sx={{ 
				background: `linear-gradient(135deg, ${colorMap[color]}10 0%, ${colorMap[color]}05 100%)`,
				border: `1px solid ${colorMap[color]}20`,
			}}>
				<CardContent>
					<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
						<Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
							{title}
						</Typography>
						{icon && (
							<Box sx={{ 
								p: 1, 
								borderRadius: 2, 
								bgcolor: `${colorMap[color]}15`,
								color: colorMap[color],
							}}>
								{icon}
							</Box>
						)}
					</Stack>
					<Typography variant="h4" sx={{ fontWeight: 700, color: colorMap[color] }}>
						{value}
					</Typography>
					{subtitle && (
						<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
							{subtitle}
						</Typography>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}

function ProgressRow({ label, value, target }: { label: string; value: number; target?: number }) {
	const percent = target && target > 0 ? Math.min(100, (value / target) * 100) : 0;
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Box sx={{ mt: 2 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="body2" sx={{ fontWeight: 500 }}>{label}</Typography>
					<Stack direction="row" alignItems="center" spacing={1}>
						<Typography variant="body2" color="text.secondary">
							{formatNumber(value)}{target ? ` / ${formatNumber(target)}` : ''}
						</Typography>
						{target && (
							<Chip 
								label={`${percent.toFixed(0)}%`} 
								size="small" 
								sx={{ 
									bgcolor: percent >= 100 ? 'success.main' : percent >= 75 ? 'warning.main' : 'primary.main',
									color: 'white',
									fontSize: '0.75rem',
								}} 
							/>
						)}
					</Stack>
				</Stack>
				<LinearProgress 
					variant={target ? 'determinate' : 'indeterminate'} 
					value={percent} 
					sx={{ 
						height: 8, 
						borderRadius: 4, 
						mt: 1, 
						bgcolor: 'rgba(99, 102, 241, 0.1)',
					}} 
				/>
				{!target && (
					<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
						No target set
					</Typography>
				)}
			</Box>
		</motion.div>
	);
}

export default function OverviewPage() {
	const [sales, setSales] = useState<SalesCampaign[]>([]);
	const [recurring, setRecurring] = useState<RecurringSales[]>([]);
	const [abandoned, setAbandoned] = useState<AbandonedCart[]>([]);
	const [leads, setLeads] = useState<LeadGeneration[]>([]);
	const [media, setMedia] = useState<MediaEngagement[]>([]);

    useEffect(() => {
        (async () => {
            const [s, r, a, l, m] = await Promise.all([
                getDocs(collection(db, 'salesCampaigns')),
                getDocs(collection(db, 'recurringSales')),
                getDocs(collection(db, 'abandonedCarts')),
                getDocs(collection(db, 'leadGenerations')),
                getDocs(collection(db, 'mediaEngagements')),
            ]);
            setSales(s.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as SalesCampaign[]);
            setRecurring(r.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as RecurringSales[]);
            setAbandoned(a.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as AbandonedCart[]);
            setLeads(l.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as LeadGeneration[]);
            setMedia(m.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as MediaEngagement[]);
        })();
    }, []);

	const kpis = useMemo(() => {
		const totalEntries = sales.length + recurring.length + abandoned.length + leads.length + media.length;
		const activeChannels = [sales.length, recurring.length, abandoned.length, leads.length, media.length].filter((x) => x > 0).length;
		return { totalEntries, activeChannels };
	}, [sales, recurring, abandoned, leads, media]);

	const monthLabel = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

	return (
		<Box>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Box sx={{ mb: 4 }}>
					<Typography variant="h4" sx={{ 
						fontWeight: 700, 
						background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
						WebkitBackgroundClip: 'text', 
						WebkitTextFillColor: 'transparent',
						mb: 1,
					}}>
						Dashboard Overview
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Track your business performance across all channels
					</Typography>
				</Box>
			</motion.div>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <StatCard title="Total Entries" value={formatNumber(kpis.totalEntries)} subtitle="This month" icon={<TrendingUpIcon />} color="primary" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <StatCard title="Active Channels" value={`${kpis.activeChannels}/5`} subtitle="With data" icon={<PeopleIcon />} color="success" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <StatCard title="Targets Set" value={`0/5`} subtitle="Channels" icon={<AssessmentIcon />} color="warning" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <StatCard title="Current Month" value={monthLabel} subtitle="Tracking period" icon={<CalendarTodayIcon />} color="secondary" />
                </motion.div>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 0 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Sales Campaign</Typography>
                            <ProgressRow label="Orders" value={sales.reduce((a, b) => a + Number(b.numOrders || 0), 0)} />
                            <ProgressRow label="Order Value" value={sales.reduce((a, b) => a + Number(b.orderValue || 0), 0)} />
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Recurring Sales</Typography>
                            <ProgressRow label="Orders" value={recurring.reduce((a, b) => a + Number(b.numOrders || 0), 0)} />
                            <ProgressRow label="Revenue" value={recurring.reduce((a, b) => a + Number(b.orderValue || 0), 0)} />
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Lead Generation</Typography>
                            <ProgressRow label="Leads" value={leads.reduce((a, b) => a + Number(b.totalLeads || 0), 0)} />
                            <ProgressRow label="Conversions" value={leads.reduce((a, b) => a + Number(b.conversion || 0), 0)} />
                            <ProgressRow label="Value" value={leads.reduce((a, b) => a + Number(b.orderValue || 0), 0)} />
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Abandoned Cart</Typography>
                            <ProgressRow label="Conversion %" value={abandoned.reduce((a, b) => a + Number(b.conversion || 0), 0)} />
                            <ProgressRow label="Revenue" value={abandoned.reduce((a, b) => a + Number(b.orderValue || 0), 0)} />
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Media Engagement</Typography>
                            <ProgressRow label="Orders" value={media.reduce((a, b) => a + Number(b.numOrders || 0), 0)} />
                            <ProgressRow label="Value" value={media.reduce((a, b) => a + Number(b.totalOrderValue || 0), 0)} />
                        </CardContent>
                    </Card>
                </motion.div>
            </Box>
		</Box>
	);
}
