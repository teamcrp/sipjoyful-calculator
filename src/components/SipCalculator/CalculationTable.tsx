
import { useState } from "react";
import { SipResult, formatCurrency } from "./utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, CalendarDays, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CalculationTableProps {
  result: SipResult | null;
}

const CalculationTable = ({ result }: CalculationTableProps) => {
  const [activeTab, setActiveTab] = useState("yearly");
  const [searchTerm, setSearchTerm] = useState("");

  if (!result) {
    return null;
  }

  const { yearlyResults, monthlyResults } = result;

  // Filter yearlyResults based on search term
  const filteredYearlyResults = yearlyResults.filter(item => 
    item.year.toString().includes(searchTerm)
  );

  // Filter monthlyResults based on search term
  const filteredMonthlyResults = monthlyResults.filter(item => 
    item.month.toString().includes(searchTerm)
  );

  return (
    <Card className="glass-card w-full animate-fade-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display">Detailed Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="yearly" className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Yearly</span>
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <span>Monthly</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${activeTab === "yearly" ? "year" : "month"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 neo-input w-full sm:w-[200px]"
              />
            </div>
          </div>
          
          <TabsContent value="yearly" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Yearly Investment</TableHead>
                    <TableHead>Yearly Returns</TableHead>
                    <TableHead>Total Investment</TableHead>
                    <TableHead>Total Returns</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredYearlyResults.length > 0 ? (
                    filteredYearlyResults.map((item) => (
                      <TableRow key={item.year}>
                        <TableCell className="font-medium">{item.year}</TableCell>
                        <TableCell>{formatCurrency(item.yearlyInvestment)}</TableCell>
                        <TableCell className="text-green-600">
                          {formatCurrency(item.yearlyInterest)}
                        </TableCell>
                        <TableCell>{formatCurrency(item.totalInvestment)}</TableCell>
                        <TableCell className="text-green-600">
                          {formatCurrency(item.totalInterest)}
                        </TableCell>
                        <TableCell className="font-semibold text-primary">
                          {formatCurrency(item.totalValue)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No results found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Returns</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMonthlyResults.length > 0 ? (
                    filteredMonthlyResults.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell className="font-medium">{item.month}</TableCell>
                        <TableCell>{formatCurrency(item.investment)}</TableCell>
                        <TableCell className="text-green-600">
                          {formatCurrency(item.interest)}
                        </TableCell>
                        <TableCell className="font-semibold text-primary">
                          {formatCurrency(item.totalValue)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No results found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CalculationTable;
