'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { IMAGES } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      router.push('/');
    } catch (err) {
      let message = 'An error occurred';
      
      if (isAxiosError(err) && err.response?.data) {
        const data = err.response.data;
        
        // Handle DRF error format
        if (typeof data === 'object') {
          // Check for 'detail' or specific field errors
          if (data.detail) {
            message = data.detail;
          } else if (data.password) {
            message = Array.isArray(data.password) ? data.password[0] : data.password;
          } else if (data.email) {
            message = Array.isArray(data.email) ? data.email[0] : data.email;
          } else if (data.non_field_errors) {
            message = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
          } else {
            // Get the first error message from any field
            const firstError = Object.values(data)[0];
            if (Array.isArray(firstError)) {
              message = firstError[0];
            } else if (typeof firstError === 'string') {
              message = firstError;
            }
          }
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-6">
      <div className="max-w-[400px] w-full flex flex-col items-center">
        
        {/* Illustration */}
        <div className="mb-10 relative">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
             src={isLogin ? IMAGES.cactus : IMAGES.cat} 
             alt={isLogin ? "Welcome Back" : "Welcome"} 
             className="w-48 h-48 object-contain drop-shadow-sm transition-all duration-300"
           />
        </div>

        <h1 className="text-[40px] font-bold font-serif text-[#4A3B2C] mb-8 text-center leading-none tracking-tight">
          {isLogin ? "Yay, You're Back!" : "Yay, New Friend!"}
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input 
            placeholder="Email address" 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#F4EBD0]/30 border-[#8B7355]/30 focus:border-[#8B7355]"
          />
          
          <Input 
            placeholder="Password" 
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            onIconClick={() => setShowPassword(!showPassword)}
            className="bg-[#F4EBD0]/30 border-[#8B7355]/30 focus:border-[#8B7355]"
          />

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="pt-6">
            <Button 
              fullWidth 
              type="submit" 
              disabled={loading}
              className={`text-lg font-bold tracking-wide shadow-sm ${loading ? 'opacity-70 cursor-wait' : ''}`}
              style={{ backgroundColor: '#F4EBD0', borderColor: '#8B7355' }}
            >
              {loading ? 'Wait a sec...' : (isLogin ? 'Login' : 'Sign Up')}
            </Button>
          </div>
        </form>

        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="mt-8 text-[#8B7355] underline decoration-1 underline-offset-4 hover:text-[#5A4633] text-sm font-medium transition-colors"
        >
          {isLogin 
            ? "Oops! I've never been here before" 
            : "We're already friends!"}
        </button>
      </div>
    </div>
  );
}
