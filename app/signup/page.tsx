import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { LoginContent } from '../login/page';

export const metadata = {
    title: 'Sign Up - Akidsy',
    description: 'Create your Akidsy account',
};

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center p-6 font-sans text-navy"><Loader2 className="w-12 h-12 animate-spin text-sky" /></div>}>
            <LoginContent initialIsSignUp={true} />
        </Suspense>
    );
}
