'use client';

import { useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Loader2, Video, Palette, Puzzle, Clock } from 'lucide-react';

type Profile = {
    id: string;
    show_coloring: boolean;
    show_videos: boolean;
    show_puzzles: boolean;
    activity_log: any[];
}

export function ParentSettingsClient({ profile }: { profile: Profile }) {
    const supabase = createClient();
    const [saving, setSaving] = useState(false);

    // Fallback to true if null
    const [toggles, setToggles] = useState({
        show_coloring: profile.show_coloring ?? true,
        show_videos: profile.show_videos ?? true,
        show_puzzles: profile.show_puzzles ?? true,
    });

    const activities = Array.isArray(profile.activity_log) ? profile.activity_log : [];

    const handleToggle = async (key: keyof typeof toggles) => {
        const newValue = !toggles[key];
        setToggles(prev => ({ ...prev, [key]: newValue }));
        setSaving(true);

        try {
            await supabase
                .from('profiles')
                .update({ [key]: newValue })
                .eq('id', profile.id);
        } catch (error) {
            console.error('Error updating toggle:', error);
            // Revert on error
            setToggles(prev => ({ ...prev, [key]: !newValue }));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Content Settings */}
            <div className="bg-white rounded-3xl p-8 border-4 border-navy shadow-[8px_8px_0px_0px_#1C304A]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-navy">Content Settings</h2>
                    {saving && <Loader2 className="w-5 h-5 text-sky animate-spin" />}
                </div>
                <p className="text-navy/70 font-medium mb-8">Toggle which content categories are visible in the Kids Dashboard.</p>

                <div className="space-y-4">
                    <ToggleRow
                        icon={<Video className="w-6 h-6 text-persimmon" />}
                        title="Show Videos"
                        description="Animated educational shows"
                        enabled={toggles.show_videos}
                        onClick={() => handleToggle('show_videos')}
                    />
                    <ToggleRow
                        icon={<Palette className="w-6 h-6 text-sunshine" />}
                        title="Show Coloring Books"
                        description="Printable coloring activities"
                        enabled={toggles.show_coloring}
                        onClick={() => handleToggle('show_coloring')}
                    />
                    <ToggleRow
                        icon={<Puzzle className="w-6 h-6 text-sky" />}
                        title="Show Puzzles"
                        description="Interactive brain teasers"
                        enabled={toggles.show_puzzles}
                        onClick={() => handleToggle('show_puzzles')}
                    />
                </div>
            </div>

            {/* Activity Tracker */}
            <div className="bg-white rounded-3xl p-8 border-4 border-navy shadow-[8px_8px_0px_0px_#1C304A] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-8 h-8 text-sky" />
                    <h2 className="text-2xl font-black text-navy">Recent Activity</h2>
                </div>

                {activities.length > 0 ? (
                    <div className="flex-1 overflow-auto space-y-4">
                        {[...activities].reverse().slice(0, 5).map((act, i) => (
                            <div key={i} className="bg-cream/50 rounded-2xl p-4 border-2 border-navy/10 flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold text-navy/50 uppercase tracking-widest">{act.category}</span>
                                    <p className="font-bold text-navy text-lg">{act.title}</p>
                                </div>
                                <span className="text-sm font-medium text-navy/60">
                                    {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-sky/5 rounded-2xl border-2 border-dashed border-sky/30">
                        <p className="font-bold text-navy/50 text-lg">No recent activity found.</p>
                        <p className="text-navy/40 text-sm mt-2">When your child explores content, it will show up here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ToggleRow({ icon, title, description, enabled, onClick }: { icon: React.ReactNode, title: string, description: string, enabled: boolean, onClick: () => void }) {
    return (
        <label className="flex items-center justify-between p-4 bg-cream/30 rounded-2xl border-2 border-slate-100 cursor-pointer hover:bg-cream/60 transition-colors">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-navy text-lg leading-tight">{title}</h3>
                    <p className="text-sm text-navy/60 font-medium">{description}</p>
                </div>
            </div>
            <div className={`relative w-14 h-8 rounded-full border-2 transition-colors duration-300 ease-in-out ${enabled ? 'bg-sky border-navy' : 'bg-slate-300 border-transparent'}`}>
                <div className={`absolute top-[2px] left-[2px] w-6 h-6 bg-white rounded-full transition-transform duration-300 ease-in-out border-2 border-navy ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </label>
    );
}
