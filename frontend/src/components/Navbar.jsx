"use client"

import { useState } from "react"

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 bg-gray-950 py-4 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="/logo-nav.svg" alt="TeamCode Logo" className="h-8 w-auto" />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8 ">
                    <NavLink href="#Hero" active>
                        Home
                    </NavLink>
                    <NavLink href="#Features" className="hover:text-purple-800" >Features</NavLink>
                    <NavLink href="#About">About</NavLink>
                    <NavLink href="#Contact">Contact</NavLink>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 bg-gray-900 rounded-md p-4">
                    <div className="flex flex-col space-y-4">
                        <NavLink href="#Hero" active>
                            Home
                        </NavLink>
                        <NavLink href="#Features">Features</NavLink>
                        <NavLink href="#About">About</NavLink>
                        <NavLink href="#Contact">Contact</NavLink>
                    </div>
                </div>
            )}
        </nav>
    )
}

const NavLink = ({ href, children, active }) => {
    return (
        <a
            href={href}
            className={`text-sm font-medium transition-all duration-300 hover:text-purple-500 hover:scale-110 ${active ? "text-white" : "text-gray-300"
                }`}
            onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector(href);
                if (element) {
                    window.scrollTo({
                        top: element.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }}
        >
            {children}
        </a>
    )
}

export default Navbar