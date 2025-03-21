
import { useState } from "react";
import { SipResult, formatCurrency, getChartColors } from "./utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { 
  BarChart2, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  TrendingUp
} from "lucide-react";

interface ChartVisualizationsProps {
  result: SipResult | null;
}

const ChartVisualizations = ({ result }: ChartVisualizationsProps) => {
  const [activeTab, setActiveTab] = useState("growth");
  const chartColors = getChartColors();

  if (!result) {
    return null;
  }

  const { totalInvestment, totalInterest, yearlyResults } = result;
  
  // Prepare data for distribution pie chart
  const distributionData = [
    { name: "Investment", value: totalInvestment },
    { name: "Returns", value: totalInterest }
  ];

  // Custom tooltip formatter for monetary values
  const CurrencyTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-sm">
          <p className="font-medium">{`Year ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value as number)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip formatter for pie chart
  const PieTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-sm">
          <p style={{ color: payload[0].color }}>
            {`${payload[0].name}: ${formatCurrency(payload[0].value as number)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card w-full animate-fade-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display">Investment Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="growth" className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              <span>Growth</span>
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4" />
              <span>Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-1.5">
              <PieChartIcon className="h-4 w-4" />
              <span>Distribution</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="growth" className="h-[350px] mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={yearlyResults}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="year" 
                  label={{ 
                    value: 'Years', 
                    position: 'insideBottomRight', 
                    offset: -5 
                  }} 
                />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  label={{ 
                    value: 'Amount (₹)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalInvestment" 
                  name="Investment" 
                  stroke={chartColors.investment} 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalValue" 
                  name="Total Value" 
                  stroke={chartColors.totalValue} 
                  strokeWidth={2.5}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="breakdown" className="h-[350px] mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yearlyResults}
                margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="year" 
                  label={{ 
                    value: 'Years', 
                    position: 'insideBottomRight', 
                    offset: -5 
                  }} 
                />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  label={{ 
                    value: 'Amount (₹)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}  
                />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend />
                <Bar 
                  dataKey="yearlyInvestment" 
                  name="Investment" 
                  fill={chartColors.investment} 
                  stackId="a" 
                />
                <Bar 
                  dataKey="yearlyInterest" 
                  name="Returns" 
                  fill={chartColors.interest} 
                  stackId="a" 
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="distribution" className="h-[350px] mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill={chartColors.investment} stroke={chartColors.stroke} />
                  <Cell fill={chartColors.interest} stroke={chartColors.stroke} />
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChartVisualizations;
