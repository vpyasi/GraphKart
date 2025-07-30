import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Verify() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Missing verification token.');
            return;
        }

       
        axios
            .post('https://graphkart.onrender.com/api/user/verify', { token })
            .then(() => {
                setStatus('success');
                setMessage('Email successfully verified! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000); 
            })
            .catch((err) => {
                console.error(err);
                setStatus('error');
                setMessage(
                    err.response?.data?.message || 'Verification failed. Invalid or expired token.'
                );
            });
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
                {status === 'verifying' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                            Verifying your email...
                        </h2>
                        <p className="text-gray-600">Please wait while we confirm your email.</p>
                    </div>
                )}
                {status === 'success' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-green-600 mb-4">
                            ✅ Verified!
                        </h2>
                        <p className="text-gray-700">{message}</p>
                    </div>
                )}
                {status === 'error' && (
                    <div>
                        <h2 className="text-2xl font-semibold text-red-600 mb-4">
                            ❌ Verification Failed
                        </h2>
                        <p className="text-gray-700">{message}</p>
                        <button
                            className="mt-4 text-blue-600 hover:underline"
                            onClick={() => navigate('/signup')}
                        >
                            Try signing up again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
