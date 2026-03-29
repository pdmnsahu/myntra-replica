import { Link } from 'react-router-dom';
import { RiInstagramLine, RiFacebookBoxLine, RiTwitterLine, RiYoutubeLine } from 'react-icons/ri';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-display text-2xl font-bold tracking-widest mb-4">DRAPE</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's premier fashion destination. Discover the latest trends in clothing, footwear, and beauty.
            </p>
            <div className="flex gap-4 mt-4">
              {[RiInstagramLine, RiFacebookBoxLine, RiTwitterLine, RiYoutubeLine].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors"><Icon size={20} /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Women', 'Men', 'Kids', 'Beauty', 'Footwear'].map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat.toLowerCase()}`} className="hover:text-white transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Customer Care', 'Track Order', 'Return Policy', 'Size Guide', 'FAQs'].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['About Us', 'Careers', 'Press', 'Sustainability', 'Investors'].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Drape Fashion Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Use</a>
            <a href="#" className="hover:text-gray-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
