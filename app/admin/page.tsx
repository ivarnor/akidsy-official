'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import {
    Sparkles, Trash2, PlusCircle, Loader2, Upload, Link as LinkIcon,
    FileCheck, AlertCircle, FileText, TrendingUp, Users, CreditCard,
    AlertTriangle, Activity, Eye, MailWarning
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ContentItem = {
    id: string;
    title: string;
    category: string;
    url: string;
    description: string;
    thumbnail_url: string;
    created_at: string;
    views: number;
};

type RevenueStats = {
    mrr: number;
    totalRevenue30d: number;
    chartData: { date: string, revenue: number }[];
};

type HealthStats = {
    activeTrials: number;
    churnRate: number;
    signupsThisMonth: number;
    cancellationsThisMonth: number;
    unverifiedUsers: { id: string, email: string, created_at: string }[];
    topContent: { id: string, title: string, category: string, views: number }[];
};

export default function AdminPage() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    // Dashboard Stats State
    const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
    const [healthStats, setHealthStats] = useState<HealthStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const router = useRouter();

    // Individual Upload States
    const [contentUploading, setContentUploading] = useState(false);
    const [thumbnailUploading, setThumbnailUploading] = useState(false);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Videos',
        url: '',
        description: '',
        thumbnail_url: '',
    });

    // Bulk JSON State
    const [bulkJson, setBulkJson] = useState('');
    const [bulkUploading, setBulkUploading] = useState(false);
    const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

    const supabase = createClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const thumbInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            } else if (session.user.email !== 'ivarnor@gmail.com') {
                setIsAuthorized(false);
                setLoading(false);
            } else {
                setUser(session.user);
                setIsAuthorized(true);
                fetchItems();
                fetchDashboardData();
            }
        };
        checkUser();
    }, []);

    async function fetchDashboardData() {
        setStatsLoading(true);
        try {
            const [revRes, healthRes] = await Promise.all([
                fetch('/api/admin/stats/revenue'),
                fetch('/api/admin/stats/health')
            ]);

            if (revRes.ok) {
                const revData = await revRes.json();
                setRevenueStats(revData);
            }
            if (healthRes.ok) {
                const healthData = await healthRes.json();
                setHealthStats(healthData);
            }

        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
        } finally {
            setStatsLoading(false);
        }
    }

    async function fetchItems() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('content')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching items:', error);
            } else {
                setItems(data || []);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    }

    async function uploadFile(file: File, type: 'content' | 'thumbnail') {
        if (!file) return;

        const isContent = type === 'content';
        const setUploading = isContent ? setContentUploading : setThumbnailUploading;

        let bucket = 'content-assets';
        let folder = 'content';

        if (isContent) {
            const cat = formData.category.toLowerCase().replace(/\s+/g, '-');
            folder = cat;
            if (formData.category === 'Videos') {
                bucket = 'videos';
            }
        } else {
            bucket = 'thumbnails';
            folder = 'covers';
        }

        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            let contentUrl = '';

            // Videos bucket is private, so publicUrl is useless. We store the raw path for signed URLs later
            if (bucket === 'videos') {
                contentUrl = filePath;
            } else {
                const { data } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(filePath);
                contentUrl = data.publicUrl;
            }

            setFormData(prev => ({
                ...prev,
                [isContent ? 'url' : 'thumbnail_url']: contentUrl
            }));

        } catch (err: any) {
            console.error(err);
            alert(`Magic failed: ${err.message || `Make sure the "${bucket}" bucket exists and is public!`}`);
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormSubmitting(true);

        try {
            const { error } = await supabase
                .from('content')
                .insert([formData]);

            if (error) {
                alert('Error saving treasure: ' + error.message);
            } else {
                setFormData({
                    title: '',
                    category: 'Videos',
                    url: '',
                    description: '',
                    thumbnail_url: '',
                });
                fetchItems();
                fetchDashboardData(); // Refresh top content
                alert('Treasure added successfully! ✨');
            }
        } catch (err: any) {
            alert('Unexpected error: ' + err.message);
        } finally {
            setFormSubmitting(false);
        }
    }

    async function handleBulkSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const parsedArray = JSON.parse(bulkJson);
            if (!Array.isArray(parsedArray)) {
                alert('Invalid format: The input must be a JSON array (starts with [ and ends with ]).');
                return;
            }

            if (parsedArray.length === 0) {
                alert('The JSON array is empty.');
                return;
            }

            setBulkUploading(true);
            setBulkProgress({ current: 0, total: parsedArray.length });

            let successfulUploads = 0;

            for (let i = 0; i < parsedArray.length; i++) {
                const item = parsedArray[i];

                // Set is_published to true explicitly for all bulk imports
                const payload = {
                    ...item,
                    is_published: true
                };

                const { error } = await supabase
                    .from('content')
                    .insert([payload]);

                if (error) {
                    console.error(`Failed to insert item ${item.title || i}:`, error);
                } else {
                    successfulUploads++;
                }

                // Update UI progress
                setBulkProgress({ current: i + 1, total: parsedArray.length });
            }

            // Cleanup & notify
            setBulkJson('');
            fetchItems();
            fetchDashboardData();

            alert(`Bulk import complete! Successfully added ${successfulUploads} of ${parsedArray.length} items. ✨`);

        } catch (err: any) {
            console.error('JSON Parse Error:', err);
            alert('Invalid JSON: Please check that your array is formatted correctly. \nDetails: ' + err.message);
        } finally {
            setBulkUploading(false);
            setBulkProgress({ current: 0, total: 0 });
        }
    }

    async function handleDelete(id: string) {
        if (user?.email !== 'ivarnor@gmail.com') {
            alert('Unauthorized action.');
            return;
        }
        if (!confirm('Are you sure you want to delete this item?')) return;

        setDeletingItemId(id);
        const itemToDelete = items.find(i => i.id === id);

        try {
            // 1. Delete associated files from Storage
            if (itemToDelete) {
                const extractPath = (url: string, bucketName: string) => url?.split(`/${bucketName}/`)[1]?.split('?')[0];

                const contentPath = extractPath(itemToDelete.url, 'content-assets') || itemToDelete.url; // If it's a video, url IS the path
                const thumbPath = extractPath(itemToDelete.thumbnail_url, 'thumbnails') || extractPath(itemToDelete.thumbnail_url, 'content-assets'); // Fallback for old items

                if (contentPath && itemToDelete.category !== 'Videos') {
                    const { error } = await supabase.storage.from('content-assets').remove([contentPath]);
                    if (error) console.error("Content storage delete error:", error);
                } else if (contentPath && itemToDelete.category === 'Videos') {
                    const { error } = await supabase.storage.from('videos').remove([contentPath]);
                    if (error) console.error("Video storage delete error:", error);
                }
                if (thumbPath) {
                    // Determine which bucket it was in by checking the URL string
                    const bucket = itemToDelete.thumbnail_url?.includes('/thumbnails/') ? 'thumbnails' : 'content-assets';
                    const { error } = await supabase.storage.from(bucket).remove([thumbPath]);
                    if (error) console.error("Thumbnail storage delete error:", error);
                }
            }

            // 2. Delete from database
            const { error } = await supabase
                .from('content')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Error deleting item: ' + error.message);
            } else {
                fetchItems();
                fetchDashboardData(); // Refresh top content
                alert('Item successfully deleted! 🗑️');
            }
        } catch (err) {
            alert('Unexpected error during deletion');
        } finally {
            setDeletingItemId(null);
        }
    }

    if (isAuthorized === false) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans text-slate-200">
                <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold mb-2 text-white">403 Forbidden</h1>
                    <p className="font-medium text-slate-400 mb-8">Access to the Control Center is restricted.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all active:scale-95"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans text-slate-300">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600/20 p-3 rounded-xl border border-blue-500/30">
                            <Activity className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                Control Center
                            </h1>
                            <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Authenticated as {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all font-semibold text-sm flex items-center gap-2"
                        >
                            Member Site <LinkIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/login');
                            }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition-all font-semibold text-sm"
                        >
                            Log Out
                        </button>
                    </div>
                </header>

                {/* KPI Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardCard
                        title="Monthly Recurring Revenue"
                        value={statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `$${revenueStats?.mrr.toLocaleString() || 0}`}
                        icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
                        trend={revenueStats?.mrr ? "+Active" : "Calculating"}
                    />
                    <DashboardCard
                        title="30-Day Revenue"
                        value={statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `$${revenueStats?.totalRevenue30d.toLocaleString() || 0}`}
                        icon={<CreditCard className="w-5 h-5 text-blue-400" />}
                    />
                    <DashboardCard
                        title="Active Trials"
                        value={statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : healthStats?.activeTrials || 0}
                        icon={<Sparkles className="w-5 h-5 text-purple-400" />}
                    />
                    <DashboardCard
                        title="Est. Monthly Churn"
                        value={statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `${healthStats?.churnRate || 0}%`}
                        icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
                        trend={`${healthStats?.cancellationsThisMonth || 0} cancels this month`}
                    />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Revenue Overview (30 Days)
                        </h3>
                        <div className="h-[300px] w-full">
                            {statsLoading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueStats?.chartData || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                            itemStyle={{ color: '#bae6fd' }}
                                            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                            formatter={(value) => [`$${value}`, 'Revenue']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            dot={{ r: 0 }}
                                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#0f172a', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Engagement / Top Content */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-purple-500" />
                            Top Content (Engagement)
                        </h3>
                        {statsLoading ? (
                            <div className="h-full flex items-center justify-center py-10">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
                            </div>
                        ) : healthStats?.topContent && healthStats.topContent.length > 0 ? (
                            <div className="space-y-4">
                                {healthStats.topContent.map((item, idx) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                                                <p className="text-xs text-slate-500">{item.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs font-mono font-medium text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-700 shrink-0">
                                            {item.views} views
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-6 text-center">
                                <p className="text-slate-500 text-sm">No engagement data yet.<br />Content views will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Health / Unverified Users */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <MailWarning className="w-5 h-5 text-amber-500" />
                        Action Needed: Unverified Emails
                    </h3>
                    {statsLoading ? (
                        <div className="flex justify-center p-10">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
                        </div>
                    ) : healthStats?.unverifiedUsers && healthStats.unverifiedUsers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {healthStats.unverifiedUsers.map((u) => (
                                <div key={u.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col gap-2">
                                    <span className="text-sm font-medium text-white break-all">{u.email}</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString()}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(u.email)}
                                            className="text-xs font-medium text-blue-400 hover:text-blue-300"
                                        >
                                            Copy Email
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 border-2 border-dashed border-slate-800 rounded-xl text-center">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileCheck className="w-6 h-6 text-emerald-500" />
                            </div>
                            <p className="text-white font-medium">All clear!</p>
                            <p className="text-slate-500 text-sm">Every user has verified their email address.</p>
                        </div>
                    )}
                </div>

                {/* Content Manager Separator */}
                <div className="pt-8 pb-4">
                    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        Content Management
                        <span className="h-px flex-1 bg-slate-800 ml-4"></span>
                    </h2>
                </div>

                {/* Upload Form - Dark Theme */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-blue-500" />
                        Upload New Content
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-400">Title</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. The Brave Lion's Den"
                                    className="p-3.5 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-400">Category</label>
                                <select
                                    className="p-3.5 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Videos</option>
                                    <option>Coloring books</option>
                                    <option>Ebooks</option>
                                    <option>Puzzles</option>
                                    <option>Education</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-400">Description</label>
                            <textarea
                                rows={2}
                                placeholder="Brief description..."
                                className="p-3.5 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Content Upload */}
                            <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 space-y-4">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-blue-500" />
                                    Source Data {(formData.category === 'Coloring books' || formData.category === 'Ebooks') ? '(PDF or Image)' : '(Video/Link)'}
                                </label>

                                <div className="flex flex-col gap-3">
                                    <div
                                        className={`flex items-center justify-center p-4 border border-slate-700 border-dashed rounded-lg bg-slate-900 cursor-pointer hover:bg-slate-800 transition-all relative ${contentUploading ? 'opacity-50 pointer-events-none' : ''}`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept={(formData.category === 'Coloring books' || formData.category === 'Ebooks') ? '.pdf,image/*' : 'video/*,image/*'}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) uploadFile(file, 'content');
                                            }}
                                        />
                                        {contentUploading ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                        ) : formData.url ? (
                                            <span className="text-sm text-emerald-400 font-medium flex items-center gap-2"><FileCheck className="w-4 h-4" /> Uploaded</span>
                                        ) : (
                                            <span className="text-sm text-slate-400">Click to select file</span>
                                        )}
                                    </div>
                                    <input
                                        required
                                        type="url"
                                        placeholder="Or paste direct URL..."
                                        className="w-full p-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Thumbnail Upload */}
                            <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 space-y-4">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    Thumbnail Image
                                </label>

                                <div className="flex flex-col gap-3">
                                    <div
                                        className={`flex items-center justify-center p-4 border border-slate-700 border-dashed rounded-lg bg-slate-900 cursor-pointer hover:bg-slate-800 transition-all ${thumbnailUploading ? 'opacity-50 pointer-events-none' : ''}`}
                                        onClick={() => thumbInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={thumbInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) uploadFile(file, 'thumbnail');
                                            }}
                                        />
                                        {thumbnailUploading ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                                        ) : formData.thumbnail_url ? (
                                            <span className="text-sm text-emerald-400 font-medium flex items-center gap-2"><FileCheck className="w-4 h-4" /> Uploaded</span>
                                        ) : (
                                            <span className="text-sm text-slate-400">Click to select image</span>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="Or paste direct image URL..."
                                        className="w-full p-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono"
                                        value={formData.thumbnail_url}
                                        onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                disabled={formSubmitting || contentUploading || thumbnailUploading}
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                            >
                                {formSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>Publish Content</>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Bulk JSON Importer */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        Bulk JSON Importer
                    </h3>
                    <form onSubmit={handleBulkSubmit} className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-400">
                                Paste JSON Array
                                <span className="text-xs text-slate-500 font-normal ml-2">
                                    [ {"{"} "title": "Lion Coloring", "category": "coloring_books", ... {"}"} ]
                                </span>
                            </label>
                            <textarea
                                required
                                rows={8}
                                placeholder='[
  {
    "title": "Example Content",
    "category": "coloring_books",
    "url": "https://...",
    "thumbnail_url": "https://..."
  }
]'
                                className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950/50 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-mono whitespace-pre resize-y"
                                value={bulkJson}
                                onChange={(e) => setBulkJson(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                disabled={bulkUploading || !bulkJson.trim()}
                                type="submit"
                                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
                            >
                                {bulkUploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>
                                            Importing {bulkProgress.current} of {bulkProgress.total}... ⏳
                                        </span>
                                    </>
                                ) : (
                                    <>Process Bulk Upload</>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Library View - Dark Theme */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            Content Library
                        </h2>
                        <span className="bg-slate-800 text-slate-300 text-xs font-bold py-1 px-3 rounded-md border border-slate-700">
                            {items.length} items
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20 border border-slate-800 rounded-2xl bg-slate-900/50">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col group hover:border-slate-600 transition-colors"
                                >
                                    <div className="h-32 relative overflow-hidden bg-slate-950 border-b border-slate-800">
                                        <img
                                            src={item.thumbnail_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/0f172a/1e293b?text=No+Preview';
                                            }}
                                        />
                                        <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-slate-300 font-semibold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border border-slate-700">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-sm font-bold text-white line-clamp-1 mb-1" title={item.title}>{item.title}</h3>
                                        <p className="text-xs text-slate-500 font-mono truncate mb-4">
                                            {item.url}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-800">
                                            <span className="text-[10px] text-slate-500 font-medium">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </span>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingItemId === item.id}
                                                className="text-slate-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                                                title="Delete Content"
                                            >
                                                {deletingItemId === item.id ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {items.length === 0 && (
                                <div className="md:col-span-3 xl:col-span-4 border border-slate-800 border-dashed rounded-2xl p-16 text-center bg-slate-900/50">
                                    <p className="text-slate-500 font-medium">Library is empty.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <footer className="pt-10 pb-6 text-center text-slate-600 text-xs font-semibold">
                    System Control Center • Restricted Access
                </footer>
            </div>
        </div>
    );
}

function DashboardCard({ title, value, icon, trend }: { title: string, value: React.ReactNode, icon: React.ReactNode, trend?: string }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    {icon}
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">{title}</h3>
                <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
                {trend && (
                    <p className="text-xs font-medium text-slate-500 mt-2 mt-auto pt-2 border-t border-slate-800/50">
                        {trend}
                    </p>
                )}
            </div>
        </div>
    );
}
