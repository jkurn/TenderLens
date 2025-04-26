import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-700 text-sm">&copy; {new Date().getFullYear()} TenderLens. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="#" className="text-neutral-700 hover:text-primary text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-neutral-700 hover:text-primary text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-neutral-700 hover:text-primary text-sm">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
