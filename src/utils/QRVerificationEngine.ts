// QR Code Token Verification Engine & Printable QR Markup Generator

export class QRVerificationEngine {
  public static verifyToken(scannedToken: string, expectedChapterId: number, expectedToken: string): boolean {
    if (!scannedToken || !expectedToken) return false;
    const cleanScanned = scannedToken.trim().toUpperCase();
    const cleanExpected = expectedToken.trim().toUpperCase();

    // Check token exact match or chapter prefix format (e.g. MEM18_CH1_...)
    return cleanScanned === cleanExpected || cleanScanned.includes(`CH${expectedChapterId}_`);
  }

  // Generates clean SVG markup for Printable QR Cards in Admin Panel
  public static generateQRSVG(qrToken: string, title: string, chapterId: number): string {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="100%" height="100%">
        <rect width="200" height="240" fill="#0F0F10" rx="16" stroke="#E6C280" stroke-width="2"/>
        
        <!-- Header -->
        <text x="100" y="24" fill="#E6C280" font-size="10" font-family="serif" font-weight="bold" text-anchor="middle">CHAPTER #${chapterId}</text>
        <text x="100" y="38" fill="#FFFFFF" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">${title.substring(0, 22)}</text>
        
        <!-- Simulated QR Pattern Frame -->
        <rect x="35" y="50" width="130" height="130" fill="#FFFFFF" rx="8"/>
        
        <!-- Target Corners -->
        <rect x="45" y="60" width="30" height="30" fill="#0F0F10"/>
        <rect x="49" y="64" width="22" height="22" fill="#FFFFFF"/>
        <rect x="53" y="68" width="14" height="14" fill="#0F0F10"/>
        
        <rect x="125" y="60" width="30" height="30" fill="#0F0F10"/>
        <rect x="129" y="64" width="22" height="22" fill="#FFFFFF"/>
        <rect x="133" y="68" width="14" height="14" fill="#0F0F10"/>
        
        <rect x="45" y="140" width="30" height="30" fill="#0F0F10"/>
        <rect x="49" y="144" width="22" height="22" fill="#FFFFFF"/>
        <rect x="53" y="148" width="14" height="14" fill="#0F0F10"/>

        <!-- Center Heart Emblem -->
        <circle cx="100" cy="115" r="14" fill="#0F0F10"/>
        <text x="100" y="119" fill="#F4C2C2" font-size="12" text-anchor="middle">♥</text>

        <!-- QR Data Code Label -->
        <rect x="25" y="192" width="150" height="22" fill="rgba(255,255,255,0.08)" rx="11"/>
        <text x="100" y="206" fill="#E6C280" font-size="9" font-family="monospace" text-anchor="middle">${qrToken}</text>
        
        <text x="100" y="228" fill="rgba(255,255,255,0.5)" font-size="7" font-family="sans-serif" text-anchor="middle">Scan in 18 Memories App</text>
      </svg>
    `;
  }
}
