import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = [
    {
      label: "Privacy Policy",
      to: "/privacy-policy",
      ariaLabel: "Privacy Policy",
    },
    {
      label: "Terms of Service",
      to: "/terms-of-service",
      ariaLabel: "Terms of Service",
    },
    { label: "Contact Us", to: "/contact-us", ariaLabel: "Contact Us" },
  ];

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-center sm:text-left">
              © {new Date().getFullYear()} All Rights Reserved by Bestwebcreator
            </p>
          </div>

          <div className="flex space-x-6">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="text-sm hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
                aria-label={link.ariaLabel}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
