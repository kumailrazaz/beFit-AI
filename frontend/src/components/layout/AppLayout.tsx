import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';
import { useIsDesktop } from '../../hooks/useMediaQuery';

export default function AppLayout() {
  const isDesktop = useIsDesktop();

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Desktop Sidebar */}
      {isDesktop && <Sidebar />}

      {/* Main Content */}
      <div className={`${isDesktop ? 'ml-[260px]' : ''}`}>
        <Header />
        <main className={`px-4 lg:px-8 py-6 ${!isDesktop ? 'pb-24' : ''}`}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      {!isDesktop && <BottomNav />}
    </div>
  );
}
