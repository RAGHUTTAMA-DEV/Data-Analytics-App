import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import { Button } from '../ui/button'
import { useAuth } from '@/context/AuthContext'
import {Eye,EyeOff,UserPlus} from 'lucide-react'

import { Input } from '@/components/ui/input'

const SignUp: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
    const { signUp, isLoading } = useAuth();
  
    const validateForm = () => {
      let valid = true;
      const newErrors = { username: '', email: '', password: '' };
  
      if (!username) {
        newErrors.username = 'Username is required';
        valid = false;
      } else if (username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
        valid = false;
      }
  
      if (!email) {
        newErrors.email = 'Email is required';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email is invalid';
        valid = false;
      }
  
      if (!password) {
        newErrors.password = 'Password is required';
        valid = false;
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        valid = false;
      }
  
      setErrors(newErrors);
      return valid;
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        await signUp(username, email, password);
      }
    };
  
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="auth-form">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Create Account</h2>
            <p className="text-muted-foreground mt-2">Sign up to get started with User Analytics Nexus</p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="yourusername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={errors.username ? 'border-destructive ' : 'text-blue-500'}
              />
              {errors.username && <p className="text-destructive text-xs mt-1">{errors.username}</p>}
            </div>
  
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>
  
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium ">
                Password
              </label>
              <div className="relative ">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
            </div>
  
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </div>
              )}
            </Button>
          </form>
  
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground ">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary font-medium hover:underline text-red-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignUp;