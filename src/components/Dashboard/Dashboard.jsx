import { useEffect, useState, lazy, Suspense } from 'react';
import { useTheme } from '../../App';
import { useCampaign } from '../../context/CampaignContext';
import { professionThemes } from '../../utils/theme';

const LineChart = lazy(() => import('recharts').then((module) => ({ default: module.LineChart })));
const BarChart = lazy(() => import('recharts').then((module) => ({ default: module.BarChart })));
const AreaChart = lazy(() => import('recharts').then((module) => ({ default: module.AreaChart })));
const Line = lazy(() => import('recharts').then((module) => ({ default: module.Line })));
const Bar = lazy(() => import('recharts').then((module) => ({ default: module.Bar })));
const Area = lazy(() => import('recharts').then((module) => ({ default: module.Area })));
const XAxis = lazy(() => import('recharts').then((module) => ({ default: module.XAxis })));
const YAxis = lazy(() => import('recharts').then((module) => ({ default: module.YAxis })));
const CartesianGrid = lazy(() =>
    import('recharts').then((module) => ({ default: module.CartesianGrid }))
);
const Tooltip = lazy(() => import('recharts').then((module) => ({ default: module.Tooltip })));
const ResponsiveContainer = lazy(() =>
    import('recharts').then((module) => ({ default: module.ResponsiveContainer }))
);

const professionCTAs = {
    legal: 'Schedule Consultation',
    medical: 'Book Appointment',
    plumbing: 'Call Now'
};

const CustomTooltip = ({ active, payload, label, explanation }) => {
    if (!active || !payload) return null;
    return (
        <div className="custom-tooltip">
            <p className="tooltip-label">{label}</p>
            <p className="tooltip-value">
                {payload[0].name}: {payload[0].value}
            </p>
            {payload[0].payload.cost && (
                <p className="tooltip-cost">Total Cost: ${payload[0].payload.cost}</p>
            )}
            <p className="tooltip-explanation">{explanation}</p>
        </div>
    );
};

const Dashboard = () => {
    const { theme: profession } = useTheme();
    const { roiPrediction } = useCampaign();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const theme = professionThemes[profession] || professionThemes.plumbing;
    const primaryColor = theme.colors.primary;

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                const mockData = {
                    roi: [
                        { month: 'Jan', value: 65 },
                        { month: 'Feb', value: 75 },
                        { month: 'Mar', value: roiPrediction || 85 }
                    ],
                    leads: [
                        { source: 'Web', count: 45 },
                        { source: 'Social', count: 30 },
                        { source: 'Direct', count: 25 }
                    ],
                    financials: [
                        { week: 'W1', cost: 2400, revenue: 4000 },
                        { week: 'W2', cost: 2100, revenue: 3800 },
                        { week: 'W3', cost: 2600, revenue: 4300 }
                    ],
                    acquisitionCost: [
                        { channel: 'Google Ads', cost: 120, leads: 45, cpa: 2.67 },
                        { channel: 'Facebook', cost: 90, leads: 30, cpa: 3.0 },
                        { channel: 'Yelp', cost: 75, leads: 25, cpa: 3.0 }
                    ]
                };
                setDashboardData(mockData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roiPrediction]);

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div
                        style={{
                            width: '300px',
                            height: '32px',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '4px'
                        }}
                    />
                    <div
                        style={{
                            width: '150px',
                            height: '40px',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '4px'
                        }}
                    />
                </div>
                <div className="metrics-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="metric-card"
                            style={{
                                backgroundColor: '#f5f5f5',
                                padding: '1.5rem',
                                borderRadius: '8px'
                            }}
                        >
                            <div
                                style={{
                                    width: '60%',
                                    height: '24px',
                                    backgroundColor: '#e0e0e0',
                                    marginBottom: '1rem',
                                    borderRadius: '4px'
                                }}
                            />
                            <div
                                style={{
                                    height: '300px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2 className="dashboard-title">
                    {profession.charAt(0).toUpperCase() + profession.slice(1)} Performance Dashboard
                </h2>
                <button
                    className="dashboard-cta"
                    style={{
                        backgroundColor: primaryColor,
                        color: theme.colors.background
                    }}
                >
                    {professionCTAs[profession] || 'Contact Us'}
                </button>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <h3>ROI Trend</h3>
                    <div className="chart-container">
                        <Suspense fallback={<div className="chart-loading" />}>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={dashboardData.roi}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        content={
                                            <CustomTooltip explanation="Return on Investment percentage based on campaign performance" />
                                        }
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={primaryColor}
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Suspense>
                    </div>
                </div>

                <div className="metric-card">
                    <h3>Lead Sources</h3>
                    <div className="chart-container">
                        <Suspense fallback={<div className="chart-loading" />}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dashboardData.leads}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="source" />
                                    <YAxis />
                                    <Tooltip
                                        content={
                                            <CustomTooltip explanation="Breakdown of lead generation by acquisition source" />
                                        }
                                    />
                                    <Bar dataKey="count" fill={primaryColor} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Suspense>
                    </div>
                </div>

                <div className="metric-card">
                    <h3>Cost vs Revenue</h3>
                    <div className="chart-container">
                        <Suspense fallback={<div className="chart-loading" />}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={dashboardData.financials}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip
                                        content={
                                            <CustomTooltip explanation="Comparison of marketing costs against generated revenue" />
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        fill={primaryColor}
                                        stroke={primaryColor}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="cost"
                                        fill="#FF6B6B"
                                        stroke="#FF6B6B"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Suspense>
                    </div>
                </div>

                <div className="metric-card">
                    <h3>Client Acquisition Cost</h3>
                    <div className="chart-container">
                        <Suspense fallback={<div className="chart-loading" />}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dashboardData.acquisitionCost}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="channel" />
                                    <YAxis />
                                    <Tooltip
                                        content={
                                            <CustomTooltip explanation="Client acquisition cost per lead by marketing channel" />
                                        }
                                    />
                                    <Bar dataKey="cpa" fill={primaryColor} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;