import { Link } from "react-router-dom"
import { NAV_ITEMS } from "../../../../lib/constants"

export function Header() {
  return (
    <header className="bg-[#0072BC] text-white">
      <div className="container-custom">
        <nav className="flex flex-col md:flex-row justify-between items-center py-2 gap-4">
          <Link to="/" className="flex items-center">
            <img 
              src="./logo.png" 
              alt="Hội Liên hiệp Phụ nữ Việt Nam" 
              className="h-16 md:h-24 w-auto" 
            />
          </Link>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.href} 
                to={item.href} 
                className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}