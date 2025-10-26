import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-BusDev-emerald text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-xl">Testera</h3>
            <p className="mt-4 text-sm dark:text-[#E2DFD2] text-[#36454F]">
              AI-powered job assessment platform for smarter hiring.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-testera-zircon hover:text-white">About Us</a></li>
              <li><a href="#" className="text-testera-zircon hover:text-white">Services</a></li>
              <li><a href="#" className="text-testera-zircon hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-bold">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-testera-zircon hover:text-white">Blog</a></li>
              <li><a href="#" className="text-testera-zircon hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-testera-zircon hover:text-white">Support</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-bold">Stay Updated</h4>
            <p className="text-testera-zircon">Subscribe to our newsletter</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded bg-testera-firefly text-white"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Testera. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};