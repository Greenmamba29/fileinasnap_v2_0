import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signin' | 'signup' | 'reset';
  onModeChange?: (mode: 'signin' | 'signup' | 'reset') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  mode: initialMode = 'signin', 
  onModeChange 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      switch (mode) {
        case 'signin':
          result = await signIn(formData.email, formData.password);
          if (!result.error) {
            toast({
              title: "Welcome back!",
              description: "You've been successfully signed in.",
            });
            onClose();
          }
          break;
          
        case 'signup':
          result = await signUp(formData.email, formData.password, formData.fullName);
          if (!result.error) {
            toast({
              title: "Account created!",
              description: "Please check your email to verify your account.",
            });
            onClose();
          }
          break;
          
        case 'reset':
          result = await resetPassword(formData.email);
          if (!result.error) {
            toast({
              title: "Reset email sent!",
              description: "Check your email for password reset instructions.",
            });
            setMode('signin');
          }
          break;
      }

      if (result?.error) {
        toast({
          title: "Authentication Error",
          description: result.error.message || "An error occurred during authentication.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
    });
  };

  const handleModeChange = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
    resetForm();
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Welcome back';
      case 'signup': return 'Create account';
      case 'reset': return 'Reset password';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signin': return 'Sign in to your FileInASnap account';
      case 'signup': return 'Create a new FileInASnap account';
      case 'reset': return 'Enter your email to reset your password';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-center">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'signin' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending reset email...'}
              </>
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
              </>
            )}
          </Button>

          <div className="text-center space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => handleModeChange('reset')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot your password?
                </button>
                <div className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signin')}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <div className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signin')}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
