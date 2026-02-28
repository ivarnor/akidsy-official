'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Sparkles, Trash2, PlusCircle, Loader2, Upload, Link as LinkIcon, FileCheck, AlertCircle, FileText } from 'lucide-react';

import { useRouter } from 'next/navigation';

type ContentItem = {
    id: string; // Changed from number to string to match UUID
    title: string;
    category: string;
    url: string; // Changed from content_url to match DB
    description: string;
    thumbnail_url: string;
    created_at: string;
};

export default function AdminPage() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    // Dashboard Stats State
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [recentSignups, setRecentSignups] = useState<any[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);

    const router = useRouter();

    // Individual Upload States
    const [contentUploading, setContentUploading] = useState(false);
    const [thumbnailUploading, setThumbnailUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Videos',
        url: '', // Changed from content_url to match DB
        description: '',
        thumbnail_url: '',
    });

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
                fetchStats();
            }
        };
        checkUser();
    }, []);

    async function fetchStats() {
        setStatsLoading(true);
        try {
            // Get total count
            const { count, error: countError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (!countError && count !== null) {
                setTotalUsers(count);
            }

            // Get recent signups
            const { data: recentUsers, error: recentError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (!recentError && recentUsers) {
                setRecentSignups(recentUsers);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
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

        // Use category-specific folders for content, "thumbnails" for icons
        let folder = 'content';
        if (isContent) {
            const cat = formData.category.toLowerCase().replace(/\s+/g, '-');
            folder = cat;
        } else {
            folder = 'thumbnails';
        }

        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('content-assets')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('content-assets')
                .getPublicUrl(filePath);

            const publicUrl = data.publicUrl;

            // Auto-fill the form
            setFormData(prev => ({
                ...prev,
                [isContent ? 'url' : 'thumbnail_url']: publicUrl
            }));

        } catch (err: any) {
            console.error(err);
            alert(`Magic failed: ${err.message || 'Make sure the "content-assets" bucket exists and is public!'}`);
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
                // Reset Form
                setFormData({
                    title: '',
                    category: 'Videos',
                    url: '',
                    description: '',
                    thumbnail_url: '',
                });
                fetchItems();
                alert('Treasure added successfully! ✨');
            }
        } catch (err: any) {
            alert('Unexpected error: ' + err.message);
        } finally {
            setFormSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const { error } = await supabase
                .from('content')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Error deleting item: ' + error.message);
            } else {
                fetchItems();
            }
        } catch (err) {
            alert('Unexpected error during deletion');
        }
    }

    if (isAuthorized === false) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-sans text-navy">
                <div className="max-w-md w-full bg-white border-4 border-navy rounded-[2.5rem] p-8 shadow-[10px_10px_0px_0px_#1C304A] text-center">
                    <AlertCircle className="w-16 h-16 text-persimmon mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold mb-2">403 Forbidden</h1>
                    <p className="font-bold text-navy/60 mb-8">You do not have permission to access the Magic Admin Portal.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-sky text-white font-black py-4 rounded-2xl border-4 border-navy hover:bg-sky/90 transition-all shadow-[4px_4px_0px_0px_#1C304A] active:scale-95"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream p-6 md:p-12 font-sans text-navy">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <div className="bg-sunshine p-3 rounded-2xl border-4 border-navy shadow-[4px_4px_0px_0px_#1C304A]">
                        <Sparkles className="w-8 h-8 text-navy fill-navy" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Magic Admin Portal
                        </h1>
                        <p className="font-bold text-navy/60 mt-1 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Logged in as: {user?.email}
                        </p>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-cream border-4 border-navy text-navy p-3 rounded-2xl shadow-[4px_4px_0px_0px_#1C304A] hover:bg-sky/20 transition-all font-black text-xs uppercase flex items-center gap-2"
                        >
                            Member Dashboard <LinkIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/login');
                            }}
                            className="bg-white border-4 border-navy p-3 rounded-2xl shadow-[4px_4px_0px_0px_#1C304A] hover:bg-cream transition-all font-black text-xs uppercase"
                        >
                            Log Out
                        </button>
                    </div>
                </header>

                {/* Dashboard Stats */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-sky text-white border-4 border-navy rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#1C304A] flex flex-col justify-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-black text-sm uppercase tracking-wider opacity-80 mb-1">Total Users</h3>
                            <div className="flex items-baseline gap-3">
                                <span className="text-6xl font-extrabold tracking-tighter">
                                    {statsLoading ? <Loader2 className="w-10 h-10 animate-spin inline" /> : totalUsers}
                                </span>
                            </div>
                        </div>
                        <Sparkles className="w-32 h-32 absolute -right-6 -bottom-6 opacity-20 fill-white" />
                    </div>

                    <div className="bg-white border-4 border-navy rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_#1C304A]">
                        <h3 className="font-black text-sm uppercase tracking-wider text-navy/60 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-persimmon" />
                            Recent Signups
                        </h3>
                        {statsLoading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-6 h-6 animate-spin text-sky" />
                            </div>
                        ) : recentSignups.length > 0 ? (
                            <ul className="space-y-3">
                                {recentSignups.map((user, idx) => (
                                    <li key={idx} className="flex items-center justify-between text-sm font-bold border-b-2 border-dashed border-navy/10 pb-2 last:border-0">
                                        <span className="truncate mr-4">{user.email || 'Unknown Email'}</span>
                                        <span className="text-xs text-navy/40 shrink-0 bg-cream px-2 py-1 rounded-full border-2 border-navy">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm font-bold opacity-50 italic">No recent signups found.</p>
                        )}
                    </div>
                </section>

                {/* Upload Form */}
                <section className="bg-white border-4 border-navy rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_#1C304A] mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <PlusCircle className="w-6 h-6 text-sky" />
                        Add New Treasure
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title & Category Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-extrabold text-lg">Treasure Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. The Brave Lion's Den"
                                    className="p-4 rounded-2xl border-4 border-navy bg-cream focus:outline-none focus:ring-4 focus:ring-sunshine/50 transition-all font-bold placeholder:text-navy/30"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-extrabold text-lg">Category</label>
                                <select
                                    className="p-4 rounded-2xl border-4 border-navy bg-cream focus:outline-none focus:ring-4 focus:ring-sunshine/50 transition-all font-black appearance-none cursor-pointer"
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

                        {/* Description Field */}
                        <div className="flex flex-col gap-2">
                            <label className="font-extrabold text-lg">Short Secret description</label>
                            <textarea
                                rows={3}
                                placeholder="Describe this treasure..."
                                className="p-4 rounded-2xl border-4 border-navy bg-cream focus:outline-none focus:ring-4 focus:ring-sunshine/50 transition-all font-bold placeholder:text-navy/30"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Content Upload & URL */}
                        <div className="bg-cream/30 p-8 rounded-[2rem] border-4 border-dashed border-navy/20 space-y-4">
                            <label className="font-extrabold text-lg flex items-center gap-2">
                                <Upload className="w-5 h-5 text-sky" />
                                Content {(formData.category === 'Coloring books' || formData.category === 'Ebooks') ? '(PDF or Image)' : '(Video/Link)'}
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* File Upload Box */}
                                <div
                                    className={`flex flex-col items-center justify-center p-6 border-4 border-navy rounded-2xl bg-white shadow-[4px_4px_0px_0px_#1C304A] cursor-pointer hover:bg-cream/50 transition-all relative ${contentUploading ? 'opacity-50 pointer-events-none' : ''}`}
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
                                        <Loader2 className="w-10 h-10 animate-spin text-persimmon" />
                                    ) : formData.url ? (
                                        <div className="flex flex-col items-center gap-2 text-sky font-bold uppercase text-xs">
                                            <FileCheck className="w-10 h-10" />
                                            File Uploaded!
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-40 font-bold text-center">
                                            <Upload className="w-8 h-8" />
                                            <span className="text-sm">Click to upload file</span>
                                        </div>
                                    )}
                                </div>

                                {/* URL Input (Auto-filled or manual) */}
                                <div className="flex flex-col gap-2">
                                    <input
                                        required
                                        type="url"
                                        placeholder="Or paste external URL here..."
                                        className="w-full h-full p-4 rounded-2xl border-4 border-navy bg-white focus:outline-none font-bold text-sm"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Upload & URL */}
                        <div className="bg-cream/30 p-8 rounded-[2rem] border-4 border-dashed border-navy/20 space-y-4">
                            <label className="font-extrabold text-lg flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-sunshine" /> Cool Card Image
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* File Upload Box */}
                                <div
                                    className={`flex flex-col items-center justify-center p-6 border-4 border-navy rounded-2xl bg-white shadow-[4px_4px_0px_0px_#1C304A] cursor-pointer hover:bg-cream/50 transition-all ${thumbnailUploading ? 'opacity-50 pointer-events-none' : ''}`}
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
                                        <Loader2 className="w-10 h-10 animate-spin text-persimmon" />
                                    ) : formData.thumbnail_url ? (
                                        <div className="flex flex-col items-center gap-2 text-sunshine font-bold uppercase text-xs">
                                            <FileCheck className="w-10 h-10" />
                                            Thumbnail Ready!
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-40 font-bold text-center">
                                            <Upload className="w-8 h-8" />
                                            <span className="text-sm">Click for card image</span>
                                        </div>
                                    )}
                                </div>

                                {/* URL Input */}
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="url"
                                        placeholder="Paste thumbnail URL here..."
                                        className="w-full h-full p-4 rounded-2xl border-4 border-navy bg-white focus:outline-none font-bold text-sm"
                                        value={formData.thumbnail_url}
                                        onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Row */}
                        <div className="pt-4">
                            <button
                                disabled={formSubmitting || contentUploading || thumbnailUploading}
                                type="submit"
                                className="w-full bg-persimmon text-white font-black text-3xl py-6 rounded-[2.5rem] border-4 border-navy hover:bg-persimmon/90 transition-all hover:scale-[1.01] active:scale-95 shadow-[8px_8px_0px_0px_#1C304A] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
                            >
                                {formSubmitting ? (
                                    <Loader2 className="w-10 h-10 animate-spin" />
                                ) : (
                                    <>Save New Treasure! <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" /></>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Library View */}
                <section>
                    <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-4">
                        Current Library
                        <span className="bg-sky text-white text-base font-black py-2 px-6 rounded-full border-4 border-navy shadow-[4px_4px_0px_0px_#1C304A]">
                            {items.length} ✨
                        </span>
                    </h2>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <Loader2 className="w-16 h-16 animate-spin text-sky" />
                            <p className="font-bold opacity-40">Consulting the scroll...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white border-4 border-navy rounded-[2.5rem] overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] flex flex-col group hover:-translate-y-2 transition-all duration-300 cursor-default"
                                >
                                    <div className="h-48 relative overflow-hidden bg-cream border-b-4 border-navy">
                                        <img
                                            src={item.thumbnail_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/37B6F6/1C304A?text=Explorer+Preview';
                                            }}
                                        />
                                        <div className="absolute top-4 left-4 bg-sunshine text-navy font-black px-4 py-1.5 rounded-full border-2 border-navy text-xs shadow-[2px_2px_0px_0px_#1C304A] uppercase tracking-tighter">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            {item.category === 'Coloring books' ? <FileText className="w-5 h-5 text-persimmon" /> : null}
                                            <h3 className="text-2xl font-black line-clamp-1">{item.title}</h3>
                                        </div>
                                        <p className="text-navy/40 text-xs font-bold font-mono truncate mb-6 pb-2 border-b-2 border-dashed border-navy/10">
                                            {item.url}
                                        </p>

                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="mt-auto w-full bg-cream text-navy font-black py-4 rounded-2xl border-4 border-navy hover:bg-persimmon hover:text-white transition-all flex items-center justify-center gap-2 group/del active:scale-95"
                                        >
                                            <Trash2 className="w-6 h-6 group-hover/del:animate-bounce" />
                                            Remove Treasure
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {items.length === 0 && (
                                <div className="md:col-span-2 bg-cream/30 border-4 border-dashed border-navy/20 rounded-[3rem] p-24 text-center">
                                    <Compass className="w-20 h-20 text-navy/10 mx-auto mb-6" />
                                    <p className="text-3xl font-black text-navy/20 italic">
                                        The library is waiting for treasure! 🗝️
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <footer className="mt-20 py-10 text-center opacity-30 font-black text-xs uppercase tracking-[0.2em]">
                    Akidsy Admin Command Center • magic in progress
                </footer>
            </div>
        </div>
    );
}

function Compass(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
    )
}
