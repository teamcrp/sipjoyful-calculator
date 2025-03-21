
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 mt-12 border-t">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Disclaimer: This calculator provides indicative values only. Actual returns may vary.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm flex items-center gap-1.5">
              Powered by 
              <a 
                href="https://teamcrp.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium hover:text-primary transition-colors"
              >
                teamcrp.in
              </a>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © {currentYear} All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
