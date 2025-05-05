"use client";
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Loader from '../../../components/ui/Loader'
import Logo from './schbanglogo.png'

const Header = () => {
    const path = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Questions', path: '/dashboard/questions' },
        { name: 'Upgrade', path: '/dashboard/upgrade' },
        { name: 'How it Works', path: '/dashboard/howitworks' }
    ];

    useEffect(() => {
        const handleStart = (url) => {
            if (url !== path) setLoading(true);
        };
        const handleComplete = () => setLoading(false);

        router.events?.on?.('routeChangeStart', handleStart);
        router.events?.on?.('routeChangeComplete', handleComplete);
        router.events?.on?.('routeChangeError', handleComplete);

        return () => {
            router.events?.off?.('routeChangeStart', handleStart);
            router.events?.off?.('routeChangeComplete', handleComplete);
            router.events?.off?.('routeChangeError', handleComplete);
        };
    }, [path, router]);
    
    return (
        <>
            {loading && <Loader />}
            <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/dashboard">
                                <div className="flex items-center cursor-pointer">
                                    <Image src={Logo} width={40} height={40} alt='SchbangInterview' />
                                    <span className="ml-2 text-xl font-medium text-gray-900">Interview | SchbangPeople</span>
                                </div>
                            </Link>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.name} 
                                    href={item.path}
                                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                                        path === item.path 
                                        ? 'text-blue-600 border-b-2 border-blue-600' 
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-4">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
