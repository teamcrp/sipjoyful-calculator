
export interface SipResult {
  totalInvestment: number;
  totalInterest: number;
  finalValue: number;
  monthlyResults: MonthlyResult[];
  yearlyResults: YearlyResult[];
}

export interface MonthlyResult {
  month: number;
  investment: number;
  interest: number;
  totalValue: number;
}

export interface YearlyResult {
  year: number;
  yearlyInvestment: number;
  totalInvestment: number;
  yearlyInterest: number;
  totalInterest: number;
  totalValue: number;
}

export interface SipParams {
  monthlyInvestment: number;
  years: number;
  expectedReturnRate: number;
}

/**
 * Calculates the future value of SIP investments
 */
export function calculateSIP(params: SipParams): SipResult {
  const { monthlyInvestment, years, expectedReturnRate } = params;
  
  const monthlyRate = expectedReturnRate / 12 / 100;
  const totalMonths = years * 12;
  
  let totalInvestment = 0;
  let totalInterest = 0;
  let currentValue = 0;
  
  const monthlyResults: MonthlyResult[] = [];
  const yearlyResults: YearlyResult[] = [];
  
  let yearlyInvestment = 0;
  let yearlyInterest = 0;
  
  for (let month = 1; month <= totalMonths; month++) {
    // Add this month's investment
    totalInvestment += monthlyInvestment;
    yearlyInvestment += monthlyInvestment;
    
    // Calculate interest for this month
    const monthlyInterest = (currentValue + monthlyInvestment) * monthlyRate;
    currentValue = currentValue + monthlyInvestment + monthlyInterest;
    
    totalInterest += monthlyInterest;
    yearlyInterest += monthlyInterest;
    
    monthlyResults.push({
      month,
      investment: monthlyInvestment,
      interest: monthlyInterest,
      totalValue: currentValue
    });
    
    // At the end of each year, record yearly result
    if (month % 12 === 0) {
      const year = month / 12;
      yearlyResults.push({
        year,
        yearlyInvestment,
        totalInvestment,
        yearlyInterest,
        totalInterest,
        totalValue: currentValue
      });
      
      // Reset yearly counters
      yearlyInvestment = 0;
      yearlyInterest = 0;
    }
  }
  
  return {
    totalInvestment,
    totalInterest,
    finalValue: currentValue,
    monthlyResults,
    yearlyResults
  };
}

/**
 * Format number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value / 100);
}

/**
 * Get growth rate (CAGR) from the SIP results
 */
export function calculateGrowthRate(sipResult: SipResult): number {
  const { totalInvestment, finalValue, monthlyResults } = sipResult;
  const years = monthlyResults.length / 12;
  
  // Calculate CAGR = (FV/PV)^(1/n) - 1
  // For SIP, this is an approximation as investments are periodic
  const growthRate = Math.pow(finalValue / totalInvestment, 1 / years) - 1;
  
  return growthRate * 100; // Return as percentage
}

/**
 * Calculate inflation-adjusted value
 */
export function calculateInflationAdjustedValue(
  sipResult: SipResult, 
  inflationRate: number
): number {
  const { finalValue, monthlyResults } = sipResult;
  const years = monthlyResults.length / 12;
  
  // Apply inflation adjustment: FV / (1 + inflation)^years
  return finalValue / Math.pow(1 + inflationRate / 100, years);
}

/**
 * Generate colors for charts based on state
 */
export function getChartColors() {
  return {
    investment: 'hsl(var(--primary))',
    interest: 'hsl(120, 100%, 35%)',
    totalValue: '#885af8',
    stroke: '#ffffff',
    grid: '#e5e7eb'
  };
}

/**
 * Get suggested SIP amount based on goal
 */
export function suggestSIPAmount(
  goalAmount: number,
  years: number,
  expectedReturnRate: number
): number {
  const monthlyRate = expectedReturnRate / 12 / 100;
  const months = years * 12;
  
  // Formula: PMT = FV / ((1 + r)^n - 1) / r * (1 + r)
  const numerator = goalAmount;
  const denominator = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
  
  return Math.ceil(numerator / denominator);
}
