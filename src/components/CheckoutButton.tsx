'use client';

import React from 'react';

export function CheckoutButton({
    children,
    className,
    priceId,
    userEmail
}: {
    children: React.ReactNode,
    className?: string,
    priceId: string,
    userEmail?: string
}) {
    return (
        <button
            onClick={async () => {
                // Instantly save price to localStorage for the signup flow
                localStorage.setItem('checkoutPriceId', priceId);

                if (!userEmail) {
                    window.location.href = `/signup?message=Please create an account to start your trial&priceId=${priceId}`;
                    return;
                }

                try {
                    const res = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ priceId, userEmail })
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                } catch (error) {
                    console.error("Failed to redirect to checkout:", error);
                }
            }}
            className={className}
        >
            {children}
        </button>
    );
}
