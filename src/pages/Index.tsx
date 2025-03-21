
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import SipForm from "@/components/SipCalculator/SipForm";
import ResultsDisplay from "@/components/SipCalculator/ResultsDisplay";
import ChartVisualizations from "@/components/SipCalculator/ChartVisualizations";
import CalculationTable from "@/components/SipCalculator/CalculationTable";
import { calculateSIP, SipParams, SipResult, formatCurrency } from "@/components/SipCalculator/utils";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    if (!result) return;

    toast({
      title: "Generating report",
      description: "Your investment report is being prepared.",
    });
    
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("SIP Investment Report", pageWidth / 2, 20, { align: "center" });
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 27, { align: "center" });
      
      // Add summary section
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Investment Summary", 14, 40);
      
      // Add summary table
      autoTable(doc, {
        startY: 45,
        head: [["Parameter", "Value"]],
        body: [
          ["Monthly Investment", formatCurrency(result.yearlyResults[0].yearlyInvestment / 12)],
          ["Time Period", `${result.yearlyResults.length} years`],
          ["Expected Return Rate", `${result.yearlyResults[0].yearlyInterest.toFixed(2)}%`],
          ["Total Investment", formatCurrency(result.totalInvestment)],
          ["Total Interest Earned", formatCurrency(result.totalInterest)],
          ["Final Value", formatCurrency(result.finalValue)]
        ],
        theme: "grid",
        headStyles: { fillColor: [66, 66, 66], textColor: [255, 255, 255] },
        styles: { fontSize: 10 }
      });
      
      // Add yearly breakdown section
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Yearly Breakdown", 14, doc.lastAutoTable.finalY + 15);
      
      // Add yearly breakdown table
      const yearlyTableData = result.yearlyResults.map(yr => [
        yr.year,
        formatCurrency(yr.yearlyInvestment),
        formatCurrency(yr.totalInvestment),
        formatCurrency(yr.yearlyInterest),
        formatCurrency(yr.totalInterest),
        formatCurrency(yr.totalValue)
      ]);
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Year", "Yearly Investment", "Total Investment", "Yearly Interest", "Total Interest", "Total Value"]],
        body: yearlyTableData,
        theme: "grid",
        headStyles: { fillColor: [66, 66, 66], textColor: [255, 255, 255] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 15 }
        }
      });
      
      // Add footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Powered by teamcrp.in", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
      }
      
      // Save the PDF
      doc.save("SIP_Investment_Report.pdf");
      
      toast({
        title: "Report downloaded",
        description: "Your investment report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating report",
        description: "There was an error creating your report. Please try again.",
        variant: "destructive"
      });
    }
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
