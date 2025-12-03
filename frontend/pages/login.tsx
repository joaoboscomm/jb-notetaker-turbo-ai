
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { apiService } from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Eye, EyeOff } from 'lucide-react';
import { IMAGES } from '../constants';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await apiService.login(email, password);
      } else {
        await apiService.register(email, password);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-6">
      <div className="max-w-[400px] w-full flex flex-col items-center">
        <div className="mb-10 relative">
           <img 
             src={isLogin ? IMAGES.cactus : IMAGES.cat} 
             alt="Welcome" 
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
          />
          <Input 
            placeholder="Password" 
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            onIconClick={() => setShowPassword(!showPassword)}
          />

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div className="pt-6">
            <Button fullWidth type="submit" disabled={loading}>
              {loading ? 'Wait a sec...' : (isLogin ? 'Login' : 'Sign Up')}
            </Button>
          </div>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="mt-8 text-[#8B7355] underline decoration-1 hover:text-[#5A4633] text-sm font-medium"
        >
          {isLogin ? "Oops! I've never been here before" : "We're already friends!"}
        </button>
      </div>
    </div>
  );
}
