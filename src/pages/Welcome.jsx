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
import { createPageUrl } from "@/utils";

export default function WelcomePage() {
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
      await User.login();
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <Tabs defaultValue="login" className="w-[450px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Associate Login</TabsTrigger>
            <TabsTrigger value="client">Client Next Steps</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle>NWI Visas CRM</CardTitle>
                <CardDescription>Internal access for registered associates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleLogin} className="w-full bg-slate-900 hover:bg-slate-800">
                  <Lock className="w-4 h-4 mr-2" />
                  Login with Google
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="client">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Client Next Steps</CardTitle>
                <CardDescription>
                  Attended a seminar or had a consultation? Let us know your next steps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800">Thank You!</h3>
                    <p className="text-slate-600 mt-2">Your information has been received. A consultant will be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleClientSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={clientForm.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={clientForm.email} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={clientForm.phone} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="notes">What are your next steps?</Label>
                      <Textarea 
                        id="notes" 
                        value={clientForm.notes} 
                        onChange={handleInputChange} 
                        placeholder="e.g., 'I want to proceed with the Express Entry application,' 'Please send me the invoice,' etc." 
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserCheck className="w-4 h-4 mr-2" />}
                      Submit Information
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

       {/* Footer */}
       <footer className="text-center p-4 text-xs text-slate-500">
        © {new Date().getFullYear()} NWI Visas Inc. All Rights Reserved.
      </footer>
    </div>
  );
}
