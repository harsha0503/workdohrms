import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import {
    Briefcase, Mail, Lock, Eye, EyeOff, Sun, Moon,
    Shield, Users, Calculator, Building2, User, ArrowRight,
    Sparkles
} from 'lucide-react';
import './Login.css';

// Demo users with different roles
const demoUsers = [
    {
        id: 'admin',
        name: 'Super Admin',
        email: 'admin@hrms.local',
        password: 'password',
        role: 'Super Admin',
        icon: Shield,
        color: '#6c71c4',
        description: 'Full system access'
    },
    {
        id: 'hr',
        name: 'Sarah Johnson',
        email: 'hr@hrms.local',
        password: 'password',
        role: 'HR Manager',
        icon: Users,
        color: '#2aa198',
        description: 'HR operations & recruitment'
    },
    {
        id: 'manager',
        name: 'Michael Chen',
        email: 'manager@hrms.local',
        password: 'password',
        role: 'Department Head',
        icon: Building2,
        color: '#b58900',
        description: 'Team & leave approvals'
    },
    {
        id: 'accountant',
        name: 'Emily Davis',
        email: 'accountant@hrms.local',
        password: 'password',
        role: 'Accountant',
        icon: Calculator,
        color: '#859900',
        description: 'Payroll & finances'
    },
    {
        id: 'employee',
        name: 'John Smith',
        email: 'employee@hrms.local',
        password: 'password',
        role: 'Employee',
        icon: User,
        color: '#268bd2',
        description: 'Basic employee access'
    }
];

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [selectedDemo, setSelectedDemo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Try a demo account below.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async (user) => {
        setSelectedDemo(user.id);
        setEmail(user.email);
        setPassword(user.password);
        setError('');
        setLoading(true);

        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            await authService.login(user.email, user.password);
            navigate('/');
        } catch (err) {
            setError('Demo login failed. Backend may not be running.');
            setSelectedDemo(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Animated Background */}
            <div className="login-background">
                <div className="bg-gradient"></div>
                <div className="bg-pattern"></div>
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>

            {/* Theme Toggle */}
            <button
                className="theme-toggle-btn"
                onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                <div className="theme-icon-wrapper">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </div>
            </button>

            <div className="login-wrapper">
                {/* Left Side - Branding */}
                <div className="login-branding">
                    <div className="branding-content">
                        <div className="brand-logo">
                            <div className="logo-icon-large">
                                <Briefcase size={32} />
                            </div>
                            <span className="logo-text-large">HRMS</span>
                        </div>
                        <h2>Human Resource Management System</h2>
                        <p>Streamline your HR operations with our comprehensive solution for employee management, attendance tracking, payroll processing, and more.</p>

                        <div className="feature-highlights">
                            <div className="feature">
                                <Sparkles size={16} />
                                <span>Employee Management</span>
                            </div>
                            <div className="feature">
                                <Sparkles size={16} />
                                <span>Attendance & Leave</span>
                            </div>
                            <div className="feature">
                                <Sparkles size={16} />
                                <span>Payroll Processing</span>
                            </div>
                            <div className="feature">
                                <Sparkles size={16} />
                                <span>Reports & Analytics</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-container">
                    <div className="login-card animate-scale-in">
                        <div className="login-header">
                            <h1>Welcome Back</h1>
                            <p>Sign in to continue to your dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            {error && (
                                <div className="error-message animate-shake">
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-with-icon">
                                    <Lock size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#" className="forgot-password">Forgot Password?</a>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-block signin-btn"
                                disabled={loading && !selectedDemo}
                            >
                                {loading && !selectedDemo ? (
                                    <>
                                        <div className="spinner small"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="login-divider">
                            <span>or try a demo account</span>
                        </div>

                        {/* Demo Users Section */}
                        <div className="demo-users">
                            {demoUsers.map((user) => {
                                const Icon = user.icon;
                                const isLoading = loading && selectedDemo === user.id;
                                return (
                                    <button
                                        key={user.id}
                                        className={`demo-user-btn ${isLoading ? 'loading' : ''}`}
                                        onClick={() => handleDemoLogin(user)}
                                        disabled={loading}
                                        style={{ '--user-color': user.color }}
                                    >
                                        <div className="demo-user-icon">
                                            {isLoading ? (
                                                <div className="spinner tiny"></div>
                                            ) : (
                                                <Icon size={16} />
                                            )}
                                        </div>
                                        <div className="demo-user-info">
                                            <span className="demo-user-role">{user.role}</span>
                                            <span className="demo-user-desc">{user.description}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <p className="login-footer-text">
                        © 2024 HRMS. Built with ❤️ for modern HR teams.
                    </p>
                </div>
            </div>
        </div>
    );
}
