/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode } from 'react';

const Footer = () => (
  <footer className="bg-white border-t mt-10 w-full">
    <div className="w-full px-4 py-6 text-sm text-gray-500 flex justify-between flex-col sm:flex-row items-center max-w-7xl mx-auto">
      <p>&copy; {new Date().getFullYear()} Neo4j E-Commerce. All rights reserved.</p>
      <div className="space-x-4 mt-2 sm:mt-0">
        <a href="#" className="hover:text-blue-600">Privacy</a>
        <a href="#" className="hover:text-blue-600">Terms</a>
        <a href="#" className="hover:text-blue-600">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
