import React, { useState, useEffect } from 'react';
import { Article, Profile, Category, Settings } from './types';
import { createClient } from '@supabase/supabase-js';

// --- Components ---
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// --- Pages ---
import { HomePage } from './pages/Home';
import { PortfolioPage } from './pages/Portfolio';
import { AboutPage } from './pages/About';
import { ContactPage } from './pages/Contact';
import { ArticleDetailPage } from './pages/ArticleDetail';

// --- Client ---
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

// --- Main App ---
export default function App() {
  const [view, setView] = useState<string>('home');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [user, setUser] = useState<any>(null);

  const fetchArticles = async () => {
    try {
      const { data } = await supabase.from("articles").select();
      setArticles(data);
    } catch (e) {
      console.log(e);
    }
  }

  // const fetchData = async () => {
  //   try {
  //     const [artRes, catRes, profRes, setRes] = await Promise.all([
  //       fetch('/api/articles'),
  //       fetch('/api/categories'),
  //       fetch('/api/profile'),
  //       fetch('/api/settings')
  //     ]);
  //     setArticles(await artRes.json());
  //     setCategories(await catRes.json());
  //     setProfile(await profRes.json());
  //     setSettings(await setRes.json());
  //   } catch (err) {
  //     console.error('Failed to fetch data', err);
  //   }
  // };

  useEffect(() => {
    // fetchData();
    fetchArticles();

    // Simple hash-based routing + path-based fallback
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname.replace('/', '');
      
      if (hash) {
        setView(hash);
      } else if (path && path.startsWith('admin')) {
        setView(path);
      } else {
        setView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    handleHashChange();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // const isAdminView = view.startsWith('admin');

  // if (isAdminView && !user) {
  //   return <AdminLogin onLogin={setUser} />;
  // }

  const renderView = () => {
    if (view.startsWith('article/')) {
      const slug = view.split('/')[1];
      return <ArticleDetailPage slug={slug} articles={articles} />;
    }

    switch (view) {
      case 'home': return <HomePage articles={articles} profile={profile} />;
      case 'portfolio': return <PortfolioPage articles={articles} categories={categories} />;
      case 'about': return <AboutPage profile={profile} />;
      case 'contact': return <ContactPage profile={profile} />;
      // case 'admin-dashboard': return <AdminDashboard articles={articles} />;
      // case 'admin-articles': return <AdminArticles articles={articles} />;
      // case 'admin-media': return <AdminMedia />;
      // case 'admin-settings': return <AdminSettings profile={profile} settings={settings} onUpdate={fetchData} />;
      default: return <HomePage articles={articles} profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        // isAdmin={isAdminView} 
        onLogout={() => { setUser(null); window.location.hash = 'home'; }} 
      />
      <main className="flex-grow">
        {renderView()}
      </main>
      {/* {!isAdminView && <Footer />} */}
    </div>
  );
}
