
import { formatCurrency, formatPercentage, SipResult, calculateGrowthRate } from "./utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleOff, Coins, LineChart, PiggyBank, TrendingUp } from "lucide-react";

interface ResultsDisplayProps {
  result: SipResult | null;
}

const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  if (!result) {
    return (
      <Card className="glass-card w-full h-[300px] flex items-center justify-center animate-fade-up">
        <div className="text-center text-muted-foreground space-y-2">
          <CircleOff className="mx-auto h-8 w-8 opacity-40" />
          <p>Enter your investment details and calculate to see results</p>
        </div>
      </Card>
    );
  }

  const { totalInvestment, totalInterest, finalValue } = result;
  const growthRate = calculateGrowthRate(result);
  const wealthGain = (finalValue / totalInvestment - 1) * 100;

  return (
    <div className="space-y-6 animate-fade-up">
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display">Investment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center text-muted-foreground mb-2">
                <PiggyBank className="h-4 w-4 mr-2" />
                <span className="text-sm">Invested Amount</span>
              </div>
              <p className="text-2xl font-semibold">{formatCurrency(totalInvestment)}</p>
            </div>
            
            <div className="flex flex-col space-y-1 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center text-muted-foreground mb-2">
                <Coins className="h-4 w-4 mr-2" />
                <span className="text-sm">Estimated Returns</span>
              </div>
              <p className="text-2xl font-semibold text-green-600">{formatCurrency(totalInterest)}</p>
            </div>
            
            <div className="flex flex-col space-y-1 p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center text-primary/80 mb-2">
                <LineChart className="h-4 w-4 mr-2" />
                <span className="text-sm">Total Value</span>
              </div>
              <p className="text-2xl font-semibold text-primary">{formatCurrency(finalValue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium">Annualized Return</h3>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-3xl font-bold text-primary">{formatPercentage(growthRate)}</span>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground mt-2">
                Your money is expected to grow at {formatPercentage(growthRate)} per annum
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium">Wealth Gained</h3>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">{formatPercentage(wealthGain)}</span>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground mt-2">
                Your investment is expected to grow {formatPercentage(wealthGain)} over the period
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsDisplay;
