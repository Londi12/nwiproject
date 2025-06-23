import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setFullName(currentUser.full_name || '');
      } catch (e) {
        console.error("Failed to fetch user", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    try {
      const updatedUser = await User.updateMyUserData({ full_name: fullName });
      setUser(updatedUser);
      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (e) {
      console.error("Failed to update profile", e);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        </div>
    );
  }

  if (!user) {
    return <div className="text-center text-red-500">Could not load user profile.</div>;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Profile Settings</h1>
      <Card className="max-w-2xl border-0 shadow-sm">
        <form onSubmit={handleUpdateProfile}>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your personal information here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {successMessage && (
              <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user.email} disabled className="bg-slate-100" />
              <p className="text-sm text-slate-500">Your email address is used for logging in and cannot be changed.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Card className="bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Password changes are handled through your login provider (e.g., Google). You can manage your password in your provider's account settings.</p>
              </Card>
            </div>
            
            {/* Additional Profile Information */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-medium text-slate-900">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input value={user.id} disabled className="bg-slate-100" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={user.role} disabled className="bg-slate-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Created</Label>
                  <Input 
                    value={user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'} 
                    disabled 
                    className="bg-slate-100" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <Input 
                    value={user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'} 
                    disabled 
                    className="bg-slate-100" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
