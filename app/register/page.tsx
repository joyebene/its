'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ZodError } from 'zod';

import {
  registerSchema,
  RegisterInput,
} from '@/schema/auth.schema';

import AuthCard from '@/components/shared/AuthCard';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';


export enum UserRole {
  USER = "USER",
  WAREHOUSE = "WAREHOUSE",
  LOGISTICS = "LOGISTICS",
  CUSTOMS = "CUSTOMS",
}

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterInput>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: UserRole.USER,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      registerSchema.parse(formData);

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/');
      } else {
        setMessage(data.message || 'Registration failed.');

        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: Record<string, string> = {};

        error.issues.forEach((err) => {
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
      title="Create Account"
      subtitle="Create your account to start using the platform."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="First Name"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />

          <Input
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <Input
          type="email"
          label="Email Address"
          name="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          type="password"
          label="Password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          label="Phone Number"
          name="phone"
          placeholder="+234..."
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          error={errors.role}
        >
          {Object.values(UserRole).map((type) => (
            <option
              key={type}
              value={type}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </option>
          ))}
        </Select>

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
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/"
            className="font-semibold text-[#3658D4] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;