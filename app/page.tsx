'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ZodError } from 'zod';

import { loginSchema, LoginInput } from '@/schema/auth.schema';

import AuthCard from '@/components/shared/AuthCard';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      loginSchema.parse(formData);

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setMessage(data.message || 'Login failed.');

        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: Record<string, string> = {};

        error?.issues.forEach((err) => {
          validationErrors[String(err.path[0])] = err.message;
        });

        setErrors(validationErrors);
      } else {
        setMessage('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to continue to your dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        {message && (
          <div
            className={`rounded-xl p-3 text-sm ${
              message.toLowerCase().includes('success')
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
        >
          Sign In
        </Button>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-[#3658D4] hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default LoginPage;