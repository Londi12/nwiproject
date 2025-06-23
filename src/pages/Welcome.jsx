import React, { useState } from 'react';
import { Lead } from "@/entities/all";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, 
  Mail, 
  Phone, 
  MapPin,
  Lock,
  UserCheck,
  Loader2,
  CheckCircle
} from "lucide-react";


export default function WelcomePage({ onNavigate }) {
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClientForm(prev => ({ ...prev, [id]: value }));
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormSubmitted(false);
    try {
      await Lead.create({
        name: clientForm.name,
        email: clientForm.email,
        phone: clientForm.phone,
        notes: clientForm.notes,
        source: "Client Next Steps Form",
        status: "New",
        interest_area: "Immigration Services"
      });
      setFormSubmitted(true);
      setClientForm({ name: '', email: '', phone: '', notes: '' });
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting your information. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await User.login();
      console.log('Login successful:', result);

      // The App.jsx auth state listener should handle the navigation automatically
      // No need to manually navigate or reload
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">NWI Visas</h1>
              <p className="text-xs text-slate-500">Immigration Services</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="font-medium">+1 (647) 560-8677</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>info@nwivisas.com</span>
            </div>
            {import.meta.env.DEV && onNavigate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('admin')}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Lock className="w-3 h-3 mr-1" />
                Admin (DEV)
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Associate Login</TabsTrigger>
              <TabsTrigger value="client">Client Next Steps</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="border-0 shadow-lg rounded-xl">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl">NWI Visas CRM</CardTitle>
                  <CardDescription>Internal access for registered associates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleLogin} className="w-full bg-slate-900 hover:bg-slate-800 h-11">
                    <Lock className="w-4 h-4 mr-2" />
                    Login with Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="client">
              <Card className="border-0 shadow-lg rounded-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl">Client Next Steps</CardTitle>
                  <CardDescription className="text-slate-600">
                    Attended a seminar or had a consultation? Let us know your next steps.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {formSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800">Thank You!</h3>
                      <p className="text-slate-600 mt-2">Your information has been received. A consultant will be in touch shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleClientSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                        <Input
                          id="name"
                          value={clientForm.name}
                          onChange={handleInputChange}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={clientForm.email}
                          onChange={handleInputChange}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
                        <Input
                          id="phone"
                          value={clientForm.phone}
                          onChange={handleInputChange}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-medium text-slate-700">What are your next steps?</Label>
                        <Textarea
                          id="notes"
                          value={clientForm.notes}
                          onChange={handleInputChange}
                          placeholder="e.g., 'I want to proceed with the Express Entry application,' 'Please send me the invoice,' etc."
                          required
                          className="min-h-[100px] resize-none"
                        />
                      </div>
                      <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserCheck className="w-4 h-4 mr-2" />}
                        Submit Information
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

       {/* Footer */}
       <footer className="text-center p-4 text-xs text-slate-500">
        © {new Date().getFullYear()} NWI Visas Inc. All Rights Reserved.
      </footer>
    </div>
  );
}
