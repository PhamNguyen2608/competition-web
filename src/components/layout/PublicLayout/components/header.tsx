import { Link, useNavigate } from "react-router-dom"
import { NAV_ITEMS, AUTH_NAV_ITEMS } from "../../../../lib/constants"
import { useAppSelector, useAppDispatch } from "../../../../store/hooks"
import AuthService from "../../../../services/authService"
import { logout } from "../../../../features/auth/authSlice"
import { useState } from "react"
import { RewardStructurePortal } from "../../main/RewardStructurePortal"
import SeedButton from "../../../../components/SeedButton"
import { CachedImage } from "../../../ui/image/CachedImage"

export function Header() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const [showRewards, setShowRewards] = useState(false)

  const handleAuthAction = async () => {
    if (user) {
      try {
        await AuthService.logout()
        dispatch(logout())
        navigate('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    } else {
      navigate('/login')
    }
  }

  // Tạo chữ cái đầu cho avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Hàm xử lý hiển thị email
  const formatEmail = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <header className="bg-[#0072BC] text-white">
      <div className="container-custom">
        <nav className="flex flex-col md:flex-row justify-between items-center py-2 gap-4">
          <Link to="/" className="flex items-center">
            <CachedImage 
              src="./logo.png" 
              alt="Hội Liên hiệp Phụ nữ Lương Sơn" 
              className="h-16 md:h-24 w-auto" 
            />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {NAV_ITEMS.map((item) => {
              // Ẩn menu Bảng xếp hạng nếu không phải admin
              if (item.adminOnly && (!user || user.role !== 'admin')) {
                return null;
              }
              
              // Ẩn menu Kết quả thi nếu là admin hoặc chưa đăng nhập
              if (item.userOnly && (!user || user.role === 'admin')) {
                return null;
              }

              return (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
                >
                  {item.label}
                </Link>
              );
            })}
            
            <button
              onClick={() => setShowRewards(true)}
              className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
            >
              Giải thưởng
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAuthAction}
                  className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
                >
                  {AUTH_NAV_ITEMS.authenticated.label}
                </button>
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <div className="font-medium">{user.displayName ?? 'User'}</div>
                    <div className="text-sm text-gray-200">{formatEmail(user.email ?? '')}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-blue-700 font-bold">
                    {getInitials(user.displayName ?? 'User')}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAuthAction}
                className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
              >
                {AUTH_NAV_ITEMS.unauthenticated.label}
              </button>
            )}

            {user && user.role === 'admin' && <SeedButton />}
          </div>
        </nav>
      </div>

      {showRewards && (
        <RewardStructurePortal onClose={() => setShowRewards(false)} />
      )}
    </header>
  )
}