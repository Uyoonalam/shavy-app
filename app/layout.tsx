import { Inter, Allura } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const allura = Allura({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-allura" 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "380px",
          height: "700px",
          backgroundColor: "1F1C18",
          overflow: "auto",
          border: "8px solid #151416",
          borderRadius: "44px",
          boxShadow: "0 0 0 2px rgb(0, 0, 0), 1px 25px 40px -12px black",
          position: "relative",
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}