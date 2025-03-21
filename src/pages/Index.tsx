
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import SipForm from "@/components/SipCalculator/SipForm";
import ResultsDisplay from "@/components/SipCalculator/ResultsDisplay";
import ChartVisualizations from "@/components/SipCalculator/ChartVisualizations";
import CalculationTable from "@/components/SipCalculator/CalculationTable";
import { calculateSIP, SipParams, SipResult } from "@/components/SipCalculator/utils";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [result, setResult] = useState<SipResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Initial calculation on component mount
  useEffect(() => {
    // Set default values for first calculation
    const defaultParams: SipParams = {
      monthlyInvestment: 5000,
      years: 10,
      expectedReturnRate: 12
    };
    
    handleCalculate(defaultParams);
  }, []);

  const handleCalculate = (params: SipParams) => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const newResult = calculateSIP(params);
      setResult(newResult);
      setIsCalculating(false);
    }, 300);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "SIP Calculator Results",
        text: "Check out my investment plan using this SIP Calculator!",
        url: window.location.href,
      }).catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share it with others.",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Report generated",
      description: "Your investment report is downloading.",
    });
    
    // In a real application, this would generate a PDF report
    // For now, just show a toast notification
  };

  return (
    <>
      <Helmet>
        <title>SIP Calculator - Plan Your Investment Growth</title>
        <meta name="description" content="Calculate your wealth growth through systematic investment plans (SIP). Plan your investments, visualize returns, and achieve financial goals." />
        <meta name="keywords" content="SIP calculator, mutual funds, investment calculator, wealth growth, financial planning, systematic investment plan" />
        <meta property="og:title" content="SIP Calculator - Plan Your Investment Growth" />
        <meta property="og:description" content="Calculate your wealth growth through systematic investment plans (SIP). Plan your investments, visualize returns, and achieve financial goals." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SIP Calculator - Plan Your Investment Growth" />
        <meta name="twitter:description" content="Calculate your wealth growth through systematic investment plans (SIP). Plan your investments, visualize returns, and achieve financial goals." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 w-full">
          <div className="container py-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                  <SipForm onCalculate={handleCalculate} isCalculating={isCalculating} />
                </div>
                
                <div className="lg:col-span-2 space-y-8">
                  <ResultsDisplay result={result} />
                  
                  {result && (
                    <div className="flex flex-wrap gap-4 justify-end animate-fade-up">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </Button>
                      
                      <Button 
                        className="flex items-center gap-2"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Report</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {result && (
                <>
                  <Separator className="my-12" />
                  
                  <div className="space-y-12 mt-4">
                    <div>
                      <h2 className="text-2xl font-display font-semibold mb-6">
                        Visualize Your Wealth Growth
                      </h2>
                      <ChartVisualizations result={result} />
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-display font-semibold mb-6">
                        Detailed Investment Breakdown
                      </h2>
                      <CalculationTable result={result} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
