import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginShop } from '../api/authApi';
import Input from '../components/Input';
import Button from '../components/Button';
import Notification from '../components/Notification';
import FormLayout from '../components/FormLayout';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginShop({ email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('name', response.data.shopName);
            console.log(response.data)
            navigate('/'); 
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className='login-form'>
        <FormLayout title="تسجيل الدخول">
            {error && <Notification message={error} type="error" />}
            <form onSubmit={handleLogin}>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="البريد الالكتروني"
                    required
                    id="email"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="كلمة السر"
                    required
                    id="password"
                />
                <Button type="submit" variant="primary" size="medium">
                 تسجيل الدخول
                </Button>
            </form>
            <div
                style={{
                    textAlign: 'center',
                    marginTop: '1rem',
                    fontFamily: 'Cairo, sans-serif',
                }}
            >
                <span>ليس لديك حساب ؟ </span>
                <Link to="/register" style={{ color: '#4CAF50', textDecoration: 'none' }}>
                    انشاء حساب
                </Link>
            </div>
        </FormLayout>
        </div>
    );
};

export default LoginPage;
