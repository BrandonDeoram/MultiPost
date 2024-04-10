"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useSession } from "next-auth/react";
interface NavItem {
  label: string;
  link: string;
}

const navItems: NavItem[] = [
  { label: "Upload", link: "/upload" },
  { label: "Dashboard", link: "/dashboard" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

  const isAuth = false;
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`dark bg-transparent overflow-hidden items-center${
        isOpen ? "h-auto" : "h-16"
      } p-4`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"}>
          <div className="text-white font-bold text-xl rounded-lg cursor-pointer hover:opacity-50 transition ease-linear">
            MultiPost
          </div>
        </Link>

        <div className="lg:hidden" onClick={toggleMenu}>
          <svg
            className={`w-6 h-6 cursor-pointer ${
              isOpen ? "text-white" : "text-white"
            }`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </div>

        <ul
          className={`flex lg:flex ${
            isOpen ? "block" : "hidden"
          } lg:items-center space-x-4 flex-row items-center `}
        >
          {navItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.link}
                className={`text-white ${
                  index === navItems.length - 1
                    ? " p-2 rounded-lg hover:opacity-50 hover:text-white transition ease-linear font-medium"
                    : "hover:opacity-50 transition ease-linear"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
