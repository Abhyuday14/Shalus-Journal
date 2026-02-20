import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Menu, X, Github, Twitter, Linkedin, Instagram, 
  ArrowRight, Mail, Phone, MapPin, Search, 
  ChevronRight, Calendar, User, ExternalLink,
  LayoutDashboard, FileText, Image as ImageIcon, Settings as SettingsIcon, LogOut
} from 'lucide-react';
import { Article, Profile, Category, Settings } from './types';

// --- Admin Panel ---

const AdminLogin = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) onLogin(data.user);
      else setError(data.message);
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-sage-green/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-nature-green">Admin Access</h1>
          <p className="text-deep-charcoal/60">Manage your portfolio content</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full py-4 nature-gradient text-white rounded-xl font-bold hover:shadow-lg transition-all">
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminDashboard = ({ articles }: { articles: Article[] }) => {
  const stats = [
    { label: 'Total Articles', value: articles.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Published', value: articles.filter(a => a.status === 'published').length, icon: ArrowRight, color: 'bg-green-500' },
    { label: 'Drafts', value: articles.filter(a => a.status === 'draft').length, icon: FileText, color: 'bg-yellow-500' },
    { label: 'Total Views', value: articles.reduce((acc, curr) => acc + curr.views_count, 0), icon: User, color: 'bg-purple-500' },
  ];

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-sage-green/20 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-sage-green/20 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-sage-green/10 flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold">Recent Articles</h2>
          <a href="#admin-articles" className="text-nature-green font-bold text-sm">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-off-white text-xs text-deep-charcoal/40 font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-green/10">
              {articles.slice(0, 5).map((article) => (
                <tr key={article.id} className="hover:bg-off-white transition-colors">
                  <td className="px-6 py-4 font-medium">{article.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-deep-charcoal/60">{new Date(article.publication_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button className="text-nature-green hover:underline font-bold text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminArticles = ({ articles }: { articles: Article[] }) => (
  <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-serif font-bold">Manage Articles</h1>
      <button className="px-6 py-2 nature-gradient text-white rounded-full font-bold">New Article</button>
    </div>
    <div className="bg-white rounded-2xl border border-sage-green/20 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-off-white text-xs text-deep-charcoal/40 font-bold uppercase tracking-widest">
          <tr>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sage-green/10">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-off-white transition-colors">
              <td className="px-6 py-4 font-medium">{article.title}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {article.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-deep-charcoal/60">{new Date(article.publication_date).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <button className="text-nature-green hover:underline font-bold text-sm">Edit</button>
                  <button className="text-red-600 hover:underline font-bold text-sm">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminMedia = () => (
  <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-serif font-bold">Media Library</h1>
      <button className="px-6 py-2 nature-gradient text-white rounded-full font-bold">Upload Media</button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-sage-green/20 group relative">
          <img src={`https://picsum.photos/seed/${i}/400/400`} alt="Media" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="text-white font-bold text-xs uppercase tracking-widest">Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdminSettings = ({ profile, settings, onUpdate }: { profile: Profile | null, settings: Settings | null, onUpdate: () => void }) => {
  const [profData, setProfData] = useState(profile || { bio_short: '', bio_long: '', professional_title: '', contact_email: '', contact_phone: '', social_links: '{}' });
  const [settData, setSettData] = useState(settings || { site_title: '', site_tagline: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setProfData(profile);
  }, [profile]);

  useEffect(() => {
    if (settings) setSettData(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profData),
        }),
        fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settData),
        })
      ]);
      onUpdate();
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8">Settings & Profile</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-sage-green/20 shadow-sm">
          <h2 className="text-2xl font-serif font-bold mb-6">Site Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Site Title</label>
              <input 
                type="text" 
                value={settData.site_title}
                onChange={(e) => setSettData({ ...settData, site_title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Site Tagline</label>
              <input 
                type="text" 
                value={settData.site_tagline}
                onChange={(e) => setSettData({ ...settData, site_tagline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-sage-green/20 shadow-sm">
          <h2 className="text-2xl font-serif font-bold mb-6">Profile Information</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Professional Title</label>
                <input 
                  type="text" 
                  value={profData.professional_title}
                  onChange={(e) => setProfData({ ...profData, professional_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Contact Email</label>
                <input 
                  type="email" 
                  value={profData.contact_email}
                  onChange={(e) => setProfData({ ...profData, contact_email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Contact Phone</label>
                <input 
                  type="text" 
                  value={profData.contact_phone}
                  onChange={(e) => setProfData({ ...profData, contact_phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Short Bio</label>
              <textarea 
                rows={3}
                value={profData.bio_short}
                onChange={(e) => setProfData({ ...profData, bio_short: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Long Bio</label>
              <textarea 
                rows={6}
                value={profData.bio_long}
                onChange={(e) => setProfData({ ...profData, bio_long: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
              ></textarea>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 nature-gradient text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};
