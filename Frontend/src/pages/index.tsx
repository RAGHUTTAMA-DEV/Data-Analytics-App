import React from "react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { BarChart2,Database,Upload,LineChart,PieChart } from "lucide-react";
import Navbar from "@/components/Layout/Navbar";


const index=()=>{
    const {isAuthenticated}=useAuth();
    return (
        <div className="min-h-screen flex flex-col">
        <Navbar />
  
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 -z-10"></div>
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                    Unlock Insights with Analytics Nexus
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                    Upload your data, analyze patterns, and transform raw numbers into actionable insights with our
                    powerful analytics platform.
                  </p>
                  {isAuthenticated ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/dashboard">
                        <Button size="lg" className="w-full sm:w-auto">
                          Go to Dashboard
                        </Button>
                      </Link>
                      <Link to="/upload">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                          Upload Data
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/signup">
                        <Button size="lg" className="w-full sm:w-auto">
                          Get Started
                        </Button>
                      </Link>
                      <Link to="/signin">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-lg">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    <div className="relative">
                      <div className="bg-white dark:bg-card shadow-xl rounded-2xl p-6 border border-border">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
                          <BarChart2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-4">
                          <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                            <LineChart className="h-16 w-16 text-primary/60" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-24 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center">
                              <PieChart className="h-10 w-10 text-accent/60" />
                            </div>
                            <div className="h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                              <BarChart2 className="h-10 w-10 text-primary/60" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Features Section */}
          <section className="py-16 bg-secondary/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Powerful Analytics Features</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Everything you need to analyze your data effectively and generate valuable insights.
                </p>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Easy Data Upload</h3>
                  <p className="text-muted-foreground">
                    Simply upload your JSON data with our intuitive interface. No complicated setup required.
                  </p>
                </div>
  
                <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Data Management</h3>
                  <p className="text-muted-foreground">
                    Organize and manage all your datasets in one central dashboard with secure storage.
                  </p>
                </div>
  
                <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <BarChart2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground">
                    Automatically calculate key statistics and visualize your data with beautiful charts.
                  </p>
                </div>
              </div>
            </div>
          </section>
  
          {/* CTA Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-primary/90 to-accent/90 rounded-2xl p-8 md:p-12 text-white">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data?</h2>
                  <p className="text-lg opacity-90 mb-8">
                    Start analyzing your data today and uncover valuable insights for better decision-making.
                  </p>
                  {isAuthenticated ? (
                    <Link to="/upload">
                      <Button size="lg" variant="secondary" className="font-semibold">
                        Upload Your First Dataset
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/signup">
                      <Button size="lg" variant="secondary" className="font-semibold">
                        Create Free Account
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
  
        <footer className="bg-background border-t border-border py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <BarChart2 className="h-6 w-6 text-primary mr-2" />
                <span className="text-lg font-semibold">Analytics Nexus</span>
              </div>
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Analytics Nexus. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
}

export default index;