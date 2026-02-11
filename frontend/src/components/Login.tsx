import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { loginUser } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginProps } from '@/types/user';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('antech@gmail.com');
  const [password, setPassword] = useState('antech123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser({ email, password });
      if (response.success) {
        console.log("User returned with:", response.user);
        onLogin(response.user);
      } else {
        setError(response.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-xl rounded-xl p-8 border border-slate-100">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-center py-4 rounded-lg mb-6">
            <h2 className="mt-2 text-3xl font-extrabold">Welcome back!</h2>
            <p className="text-slate-300">Sign in to continue</p>
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-28 h-28 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              OKR
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-lg text-white py-3 text-lg font-semibold transition-colors duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Demo credentials: <strong>antech@gmail.com</strong> / <strong>antech123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
