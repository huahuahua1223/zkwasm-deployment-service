"use client";

import Link from "next/link";
import UserNav from "./UserNav";

export default function NavBar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">ZKWasm Deployment Service</Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/simple-deploy" 
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Simple Deployment
          </Link>
          <Link 
            href="/test-k8s" 
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Test Connection
          </Link>
        </nav>
        
        <UserNav />
      </div>
    </header>
  );
} 