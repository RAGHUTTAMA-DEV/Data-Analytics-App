import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import { BarChart3,LogOut,Menu,Upload,User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from "@/hooks/use-media-query";

const Navbar:React.FC = ()=>{
    const {isAuthenticated,signOut}=useAuth();
    const isMobile=useMediaQuery("(max-width:768px)");

    return(
        <header className="bg-white dark:bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-semibold text-foreground">Analytics Nexus</span>
            </Link>
          </div>

          {isAuthenticated ? (
            <>
              {!isMobile && (
                <nav className="hidden md:flex items-center space-x-4 mr-4">
                  <Link
                    to="/dashboard"
                    className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/upload"
                    className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Upload Data
                  </Link>
                </nav>
              )}

              <div className="flex items-center">
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="mr-2">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Analytics Nexus</SheetTitle>
                        <SheetDescription>Navigate through your analytics platform.</SheetDescription>
                      </SheetHeader>
                      <div className="flex flex-col space-y-4 mt-6">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          to="/upload"
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Data
                        </Link>
                        <button
                          onClick={signOut}
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary text-left"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


export default Navbar;