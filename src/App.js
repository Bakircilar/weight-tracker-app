// src/App.js (Güncellenmiş Versiyon)
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ImprovedMealPlanner from './components/ImprovedMealPlanner';
import WeightTracker from './components/WeightTracker';
import BodyMeasurements from './components/BodyMeasurements';
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
  const [currentPage, setCurrentPage] = useState('');

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

  // URL değişikliklerini takip et
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      
      if (path === '/' || path === '') {
        setCurrentPage('dashboard');
      } else if (path.includes('meals')) {
        setCurrentPage('meals');
      } else if (path.includes('weight')) {
        setCurrentPage('weight');
      } else if (path.includes('measurements')) {
        setCurrentPage('measurements');
      } else if (path.includes('profile')) {
        setCurrentPage('profile');
      } else if (path.includes('login')) {
        setCurrentPage('login');
      }
    };

    // Sayfa yüklendiğinde ve URL değiştiğinde kontrol et
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Hızlı Kilo Takip & Beslenme Uygulaması</h1>
          {session ? (
            <nav>
              <Link 
                to="/" 
                className={currentPage === 'dashboard' ? 'active' : ''}
              >
                Ana Sayfa
              </Link>
              <Link 
                to="/meals" 
                className={currentPage === 'meals' ? 'active' : ''}
              >
                Beslenme Planı
              </Link>
              <Link 
                to="/weight" 
                className={currentPage === 'weight' ? 'active' : ''}
              >
                Kilo Takibi
              </Link>
              <Link 
                to="/measurements" 
                className={currentPage === 'measurements' ? 'active' : ''}
              >
                Vücut Ölçüleri
              </Link>
              <Link 
                to="/profile" 
                className={currentPage === 'profile' ? 'active' : ''}
              >
                Profil
              </Link>
              <button onClick={() => supabase.auth.signOut()}>Çıkış</button>
            </nav>
          ) : (
            <Link 
              to="/login" 
              className={currentPage === 'login' ? 'active' : ''}
            >
              Giriş
            </Link>
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
              element={session ? <ImprovedMealPlanner supabase={supabase} /> : <Login supabase={supabase} />} 
            />
            <Route 
              path="/weight" 
              element={session ? <WeightTracker supabase={supabase} /> : <Login supabase={supabase} />} 
            />
            <Route 
              path="/measurements" 
              element={session ? <BodyMeasurements supabase={supabase} /> : <Login supabase={supabase} />} 
            />
            <Route 
              path="/profile" 
              element={session ? <Profile supabase={supabase} session={session} /> : <Login supabase={supabase} />} 
            />
            <Route path="/login" element={<Login supabase={supabase} />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2025 Hızlı Kilo Takip & Beslenme Uygulaması</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;