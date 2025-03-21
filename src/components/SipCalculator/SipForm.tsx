
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { SipParams } from "./utils";
import { InfoIcon } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SipFormProps {
  onCalculate: (params: SipParams) => void;
  isCalculating?: boolean;
}

const SipForm = ({ onCalculate, isCalculating = false }: SipFormProps) => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [years, setYears] = useState<number>(10);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);

  // Trigger calculation whenever any input value changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onCalculate({
        monthlyInvestment,
        years,
        expectedReturnRate
      });
    }, 300); // Add a small debounce to prevent too many calculations

    return () => clearTimeout(debounceTimer);
  }, [monthlyInvestment, years, expectedReturnRate, onCalculate]);

  const handleMonthlyInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMonthlyInvestment(value);
  };

  const handleMonthlyInvestmentSlider = (value: number[]) => {
    setMonthlyInvestment(value[0]);
  };

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setYears(Math.min(Math.max(value, 1), 30));
  };

  const handleYearsSlider = (value: number[]) => {
    setYears(value[0]);
  };

  const handleExpectedReturnRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setExpectedReturnRate(Math.min(Math.max(value, 1), 30));
  };

  const handleExpectedReturnRateSlider = (value: number[]) => {
    setExpectedReturnRate(value[0]);
  };

  return (
    <Card className="glass-card w-full animate-fade-up">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-display">SIP Calculator</CardTitle>
        <CardDescription>
          Calculate your wealth growth through systematic investments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthlyInvestment" className="flex items-center">
                  Monthly Investment (₹)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">
                          The amount you plan to invest every month in your SIP
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm font-medium">₹{monthlyInvestment.toLocaleString()}</span>
              </div>
              <Input
                type="number"
                id="monthlyInvestment"
                className="neo-input"
                value={monthlyInvestment}
                onChange={handleMonthlyInvestmentChange}
                min={500}
                max={200000}
                step={500}
              />
              <Slider
                value={[monthlyInvestment]}
                onValueChange={handleMonthlyInvestmentSlider}
                min={500}
                max={200000}
                step={500}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹500</span>
                <span>₹2,00,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="years" className="flex items-center">
                  Investment Period (Years)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">
                          The duration for which you'll continue your SIP investment
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm font-medium">{years} years</span>
              </div>
              <Input
                type="number"
                id="years"
                className="neo-input"
                value={years}
                onChange={handleYearsChange}
                min={1}
                max={30}
                step={1}
              />
              <Slider
                value={[years]}
                onValueChange={handleYearsSlider}
                min={1}
                max={30}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 year</span>
                <span>30 years</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="expectedReturnRate" className="flex items-center">
                  Expected Return Rate (% p.a.)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[220px] text-sm">
                          The annual return rate you expect from your investment. Equity funds typically return 10-12% p.a. over the long term.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm font-medium">{expectedReturnRate}%</span>
              </div>
              <Input
                type="number"
                id="expectedReturnRate"
                className="neo-input"
                value={expectedReturnRate}
                onChange={handleExpectedReturnRateChange}
                min={1}
                max={30}
                step={0.1}
              />
              <Slider
                value={[expectedReturnRate]}
                onValueChange={handleExpectedReturnRateSlider}
                min={1}
                max={30}
                step={0.1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SipForm;
