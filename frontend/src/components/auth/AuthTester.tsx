import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Lock,
  Shield,
  RefreshCw,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'failed';
  message: string;
  timestamp?: Date;
}

const AuthTester: React.FC = () => {
  const { user, session, signUp, signIn, signOut, resetPassword, loading } = useAuth();
  const { toast } = useToast();
  
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpassword123');
  const [testFullName, setTestFullName] = useState('Test User');
  const [resetEmail, setResetEmail] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const addTestResult = (test: string, status: 'success' | 'failed', message: string) => {
    const result: TestResult = {
      test,
      status,
      message,
      timestamp: new Date()
    };
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Individual test functions
  const testSignUp = async () => {
    try {
      const result = await signUp(testEmail, testPassword, testFullName);
      if (result.error) {
        addTestResult('Sign Up', 'failed', result.error.message);
        toast({
          title: "Sign Up Failed",
          description: result.error.message,
          variant: "destructive"
        });
      } else {
        addTestResult('Sign Up', 'success', 'Account created successfully! Check email for verification.');
        toast({
          title: "Sign Up Success",
          description: "Check your email for verification link",
          variant: "default"
        });
      }
    } catch (error: any) {
      addTestResult('Sign Up', 'failed', error.message);
    }
  };

  const testSignIn = async () => {
    try {
      const result = await signIn(testEmail, testPassword);
      if (result.error) {
        addTestResult('Sign In', 'failed', result.error.message);
        toast({
          title: "Sign In Failed",
          description: result.error.message,
          variant: "destructive"
        });
      } else {
        addTestResult('Sign In', 'success', 'Successfully signed in!');
        toast({
          title: "Sign In Success",
          description: "Welcome back!",
          variant: "default"
        });
      }
    } catch (error: any) {
      addTestResult('Sign In', 'failed', error.message);
    }
  };

  const testSignOut = async () => {
    try {
      const result = await signOut();
      if (result.error) {
        addTestResult('Sign Out', 'failed', result.error.message);
      } else {
        addTestResult('Sign Out', 'success', 'Successfully signed out!');
        toast({
          title: "Sign Out Success",
          description: "You have been logged out",
          variant: "default"
        });
      }
    } catch (error: any) {
      addTestResult('Sign Out', 'failed', error.message);
    }
  };

  const testPasswordReset = async () => {
    const emailToUse = resetEmail || testEmail;
    try {
      const result = await resetPassword(emailToUse);
      if (result.error) {
        addTestResult('Password Reset', 'failed', result.error.message);
        toast({
          title: "Password Reset Failed",
          description: result.error.message,
          variant: "destructive"
        });
      } else {
        addTestResult('Password Reset', 'success', `Password reset email sent to ${emailToUse}`);
        toast({
          title: "Password Reset Success",
          description: "Check your email for reset instructions",
          variant: "default"
        });
      }
    } catch (error: any) {
      addTestResult('Password Reset', 'failed', error.message);
    }
  };

  const runFullAuthTest = async () => {
    setIsRunningTests(true);
    clearResults();
    
    // Test sequence: Sign out first (if signed in), then test sign up, sign in, and sign out
    if (user) {
      await testSignOut();
      // Wait a bit for sign out to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Test sign up (will likely fail if user exists, which is expected)
    await testSignUp();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test sign in
    await testSignIn();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test password reset
    await testPasswordReset();
    
    setIsRunningTests(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Testing Suite</h1>
        <p className="text-gray-600">Test all authentication flows to ensure everything works correctly</p>
        
        {/* Common Issues Alert */}
        {testResults.some(r => r.message.includes('Signups not allowed')) && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <div className="text-amber-500 mr-3">⚠️</div>
              <div className="text-left">
                <h3 className="font-semibold text-amber-800">Supabase Configuration Issue</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Sign-ups are disabled in your Supabase instance. To fix:
                </p>
                <ol className="text-sm text-amber-700 mt-2 list-decimal list-inside space-y-1">
                  <li>Go to Supabase Dashboard → Authentication → Settings</li>
                  <li>Enable "Enable sign up" or create a test user manually</li>
                  <li>Add your localhost URL to allowed redirect URLs</li>
                </ol>
                <p className="text-xs text-amber-600 mt-2">
                  See SUPABASE_AUTH_SETUP.md for detailed instructions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Auth Status */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Current Authentication Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">User Status</p>
              <Badge variant={user ? "default" : "secondary"}>
                {user ? `Signed in as ${user.email}` : 'Not signed in'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email Verified</p>
              <Badge variant={user?.email_confirmed_at ? "default" : "secondary"}>
                {user?.email_confirmed_at ? 'Verified' : 'Not verified'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Session</p>
              <Badge variant={session ? "default" : "secondary"}>
                {session ? 'Active' : 'No session'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Test Configuration */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Test Email</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="testPassword">Test Password</Label>
              <Input
                id="testPassword"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="testpassword123"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testFullName">Full Name</Label>
              <Input
                id="testFullName"
                type="text"
                value={testFullName}
                onChange={(e) => setTestFullName(e.target.value)}
                placeholder="Test User"
              />
            </div>
            <div>
              <Label htmlFor="resetEmail">Password Reset Email</Label>
              <Input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Leave empty to use test email"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Individual Test Buttons */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Individual Tests</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            onClick={testSignUp} 
            variant="outline" 
            disabled={loading || isRunningTests}
            className="flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </Button>
          <Button 
            onClick={testSignIn} 
            variant="outline" 
            disabled={loading || isRunningTests}
            className="flex items-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Button>
          <Button 
            onClick={testSignOut} 
            variant="outline" 
            disabled={loading || isRunningTests || !user}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
          <Button 
            onClick={testPasswordReset} 
            variant="outline" 
            disabled={loading || isRunningTests}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Password</span>
          </Button>
        </div>
      </Card>

      {/* Run All Tests */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Full Authentication Test</h2>
            <p className="text-gray-600 text-sm">Run all authentication tests in sequence</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={clearResults} 
              variant="outline"
              disabled={isRunningTests}
            >
              Clear Results
            </Button>
            <Button 
              onClick={runFullAuthTest}
              disabled={loading || isRunningTests}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-3 p-4 rounded-lg ${
                  result.status === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{result.test}</p>
                    {result.timestamp && (
                      <p className="text-xs text-gray-500">
                        {result.timestamp.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  <p className={`text-sm ${
                    result.status === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  ✓ {testResults.filter(r => r.status === 'success').length} Passed
                </Badge>
                <Badge variant="destructive">
                  ✗ {testResults.filter(r => r.status === 'failed').length} Failed
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Total Tests: {testResults.length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AuthTester;
