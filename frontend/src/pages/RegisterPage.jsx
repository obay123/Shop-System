import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerShop } from '../api/authApi';
import Input from '../components/Input';
import Button from '../components/Button';
import Notification from '../components/Notification';
import FormLayout from '../components/FormLayout';
import { Link } from 'react-router-dom';


const RegisterPage = () => {
    const [name, setName] = useState('');
    const [owner, setOwner] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        const shopData = { name, owner, email, password };
        e.preventDefault();
        try {
            await registerShop(shopData);
            navigate('/login'); // Redirect to login
        } catch (err) {
            setError('خطأ في محاولة انشاء الحساب') 
            console.log(err)
        }
    };

    return (
        <div className='register-form'>
        <FormLayout title="انشاء حساب">
            {error && <Notification message={error} type="error" />}
            <form onSubmit={handleRegister}>
                <Input
                    // label="Shop Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ادخل اسم المتجر"
                    required
                    id="name"
                />
                <Input
                    // label="Owner Name"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="ادخل اسمك الشخصي"
                    id="owner"
                />
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
                    انشاء الحساب
                </Button>
            </form>
            <div
                style={{
                    textAlign: 'center',
                    marginTop: '1rem',
                    fontFamily: 'Cairo, sans-serif',
                }}
            >
                <span>لديك حساب ؟ </span>
                <Link to="/login" style={{ color: '#4CAF50', textDecoration: 'none' }}>
                    تسجيل الدخول
                </Link>
            </div>
        </FormLayout>
        </div>
    );
};

export default RegisterPage;
