'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Moon, Sun, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminHeader() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();

  const getPageTitle = () => {
    switch (pathname) {
      case '/admin':
        return 'Dashboard';
      case '/admin/users':
        return 'Users Management';
      case '/admin/places':
        return 'Places Management';
      default:
        return 'Dashboard';
    }
  };

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/auth/login',
      redirect: true 
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
      {/* Left side - Dynamic page title */}
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white ml-12 lg:ml-0">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right side - Theme toggle and user menu */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/admin-avatar.png" alt={session?.user?.name || 'Admin'} />
                <AvatarFallback>{getUserInitials(session?.user?.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{session?.user?.name || 'Admin User'}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {session?.user?.email || 'admin@temple-system.com'}
                </p>
                {session?.user?.role && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {session.user.role}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}