// src/components/Login.js
import React, { useState } from 'react';

const Login = ({ supabase }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (isLogin) {
        // Giriş işlemi
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
      } else {
        // Kayıt işlemi
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (error) throw error;
        
        setMessage('Kayıt başarılı! Lütfen e-posta adresinizi kontrol edin.');
      }
    } catch (error) {
      setMessage(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
      
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleAuth} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">E-posta:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Şifre:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'İşleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
      </form>
      
      <p className="auth-toggle">
        {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
        <button onClick={() => setIsLogin(!isLogin)} className="btn-link">
          {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
        </button>
      </p>
    </div>
  );
};

export default Login;