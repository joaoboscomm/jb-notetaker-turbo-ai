
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Eye, EyeOff } from 'lucide-react';
import { storageService } from '../services/storage';
import { User } from '../types';
import { IMAGES } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const user = await storageService.login(email, password);
        onLogin(user);
      } else {
        const user = await storageService.register(email, password);
        onLogin(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-6">
      <div className="max-w-[400px] w-full flex flex-col items-center">
        
        {/* Illustration */}
        <div className="mb-10 relative">
           <img 
             src={isLogin ? IMAGES.cactus : IMAGES.cat} 
             alt={isLogin ? "Welcome Back" : "Welcome"} 
             className="w-48 h-48 object-contain drop-shadow-sm transition-all duration-300"
           />
        </div>

        <h1 className="text-[40px] font-bold serif text-[#4A3B2C] mb-8 text-center leading-none tracking-tight">
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
};
