
import { Calculator } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4">
      <div className="container flex items-center justify-center md:justify-start">
        <div className="flex items-center space-x-2">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold">SIP Calculator</h1>
            <p className="text-xs text-muted-foreground">Plan your investment journey</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
