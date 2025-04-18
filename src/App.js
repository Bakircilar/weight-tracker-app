// src/App.js
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MealPlanner from './components/MealPlanner';
import WeightTracker from './components/WeightTracker';
import Login from './components/Login';
import Profile from './components/Profile';
import './App.css';

// Supabase istemcisini oluştur
const supabaseUrl = 'https://lnvplwkmccwgyreuwobv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxudnBsd2ttY2N3Z3lyZXV3b2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5Nzk1MDQsImV4cCI6MjA2MDU1NTUwNH0.TAH6MZbHmN35lRvr3DDMPQ0GBST7ztkcDjepfM9TLeo';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kullanıcı oturumunu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Sağlıklı Yaşam Takip Uygulaması</h1>
          {session ? (
            <nav>
              <Link to="/">Ana Sayfa</Link>
              <Link to="/meals">Beslenme Planı</Link>
              <Link to="/weight">Kilo Takibi</Link>
              <Link to="/profile">Profil</Link>
              <button onClick={() => supabase.auth.signOut()}>Çıkış</button>
            </nav>
          ) : (
            <Link to="/login">Giriş</Link>
          )}
        </header>

        <main>
          <Routes>
            <Route 
              path="/" 
              element={session ? <Dashboard supabase={supabase} /> : <Login supabase={supabase} />} 
            />
            <Route 
              path="/meals" 
              element={session ? <MealPlanner supabase={supabase} /> : <Login supabase={supabase} />} 
            />
            <Route 
              path="/weight" 
              element={session ? <WeightTracker supabase={supabase} /> : <Login supabase={supabase} />} 
            />
            <Route 
              path="/profile" 
              element={session ? <Profile supabase={supabase} session={session} /> : <Login supabase={supabase} />} 
            />
            <Route path="/login" element={<Login supabase={supabase} />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2025 Sağlıklı Yaşam Takip Uygulaması</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;