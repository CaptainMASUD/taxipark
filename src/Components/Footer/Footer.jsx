import React from 'react';
import { Github, Mail, Linkedin, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-700 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-teal-400 text-xl font-bold mb-4">Team Captains</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            We are a creative and passionate team building modern and scalable web solutions. Join our journey and let's innovate together.
          </p>
        </div>

        <div>
          <h3 className="text-slate-200 text-base font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/events" className="hover:text-teal-400">Events</a></li>
            <li><a href="/about" className="hover:text-teal-400">About Us</a></li>
            <li><a href="/join" className="hover:text-teal-400">Join Us</a></li>
            <li><a href="https://discord.gg/your-invite" className="hover:text-teal-400">Community</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-slate-200 text-base font-semibold mb-3">Connect With Us</h3>
          <div className="flex gap-4 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
              <Github size={22} />
            </a>
            <a href="mailto:team@captains.dev" className="hover:text-teal-400">
              <Mail size={22} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
              <Linkedin size={22} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
              <Instagram size={22} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
              <Twitter size={22} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} Team Captains All Rights Reserved.
      </div>
    </footer>
  );
}
