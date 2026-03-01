import { Suspense } from 'react';
import SubcategoryContent from './SubcategoryContent';
import { Loader2 } from 'lucide-react';

export default function SubcategoryPage({ params }: { params: { slug: string } }) {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-sky animate-spin" />
                <p className="font-bold text-navy/60">Finding your coloring pages...</p>
            </div>
        }>
            <SubcategoryContent slug={params.slug} />
        </Suspense>
    );
}
