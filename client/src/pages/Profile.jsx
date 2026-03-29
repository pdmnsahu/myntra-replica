import { useState } from 'react';
import { RiUserLine, RiLockLine, RiCheckLine } from 'react-icons/ri';
import { updateProfile, changePassword } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import { showSuccess, showError } from '../utils/toastHelper';

function ProfileSection({ user, onUpdate }) {
  const [form, setForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(form);
      onUpdate(res.data.user);
      setSaved(true);
      showSuccess('Profile updated!');
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      showError(err?.response?.data?.error || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <RiUserLine size={20} className="text-dark" />
        <h2 className="font-semibold text-dark">Personal Information</h2>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-dark text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {form.avatar
            ? <img src={form.avatar} alt="" className="w-full h-full rounded-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
            : (user?.name?.charAt(0).toUpperCase() || 'U')}
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-dark mb-1">Avatar URL</label>
          <input
            value={form.avatar}
            onChange={e => setForm({ ...form, avatar: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
            className="input-field text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-dark mb-1.5">Full Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-dark mb-1.5">Email Address</label>
          <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed" />
          <p className="text-xs text-muted mt-1">Email cannot be changed</p>
        </div>
      </div>

      <Button onClick={handleSave} loading={loading} className="mt-5" size="md">
        {saved ? <><RiCheckLine className="mr-1" /> Saved!</> : 'Save Changes'}
      </Button>
    </div>
  );
}

function PasswordSection() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Required';
    if (form.newPassword.length < 6) e.newPassword = 'At least 6 characters';
    if (form.newPassword !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      showSuccess('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      showError(err?.response?.data?.error || 'Failed to change password');
    }
    setLoading(false);
  };

  const field = (key, label, placeholder) => (
    <div>
      <label className="block text-xs font-semibold text-dark mb-1.5">{label}</label>
      <input
        type="password"
        value={form[key]}
        onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
        placeholder={placeholder}
        className={`input-field ${errors[key] ? 'border-primary' : ''}`}
      />
      {errors[key] && <p className="text-xs text-primary mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <RiLockLine size={20} className="text-dark" />
        <h2 className="font-semibold text-dark">Change Password</h2>
      </div>
      <div className="space-y-4 max-w-sm">
        {field('currentPassword', 'Current Password', 'Enter current password')}
        {field('newPassword', 'New Password', 'At least 6 characters')}
        {field('confirm', 'Confirm New Password', 'Re-enter new password')}
        <Button onClick={handleChange} loading={loading} size="md">Update Password</Button>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuthStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-2xl font-semibold text-dark mb-6">My Profile</h1>
      <div className="space-y-5">
        <ProfileSection user={user} onUpdate={updateUser} />
        <PasswordSection />
      </div>
    </div>
  );
}
