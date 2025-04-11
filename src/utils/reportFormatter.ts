
import { Tables } from "@/integrations/supabase/types";
import { ngoEmails } from "@/config/ngoEmails";

type Report = Tables<"reports">;

interface EmailContent {
  to: string[];
  subject: string;
  html: string;
}

export const formatReportForEmail = (
  report: Report,
  imageUrl: string,
  reporterName: string
): EmailContent => {
  // Format date for email
  const reportDate = new Date(report.created_at).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  // Generate severity label with appropriate styling
  const getSeverityLabel = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "#DC2626", // red
      serious: "#F59E0B", // amber
      normal: "#3B82F6", // blue
    };
    
    const color = colors[severity as keyof typeof colors] || "#3B82F6";
    
    return `<span style="color: ${color}; font-weight: bold; text-transform: capitalize;">${severity}</span>`;
  };

  // Create HTML email content
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #14b8a6; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Stray Animal Report</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>A new stray animal has been reported by ${reporterName}.</p>
        
        <div style="margin: 20px 0;">
          <img src="${imageUrl}" style="max-width: 100%; border-radius: 8px;" alt="Reported animal" />
        </div>
        
        <h2 style="color: #14b8a6; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Report Details</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 150px;">Species:</td>
            <td style="padding: 8px 0; text-transform: capitalize;">${report.species}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Count:</td>
            <td style="padding: 8px 0;">${report.count}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Severity:</td>
            <td style="padding: 8px 0;">${getSeverityLabel(report.severity)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Location:</td>
            <td style="padding: 8px 0;">
              ${report.landmark || `Lat: ${report.latitude.toFixed(6)}, Lng: ${report.longitude.toFixed(6)}`}
              <div style="margin-top: 5px;">
                <a href="https://www.google.com/maps?q=${report.latitude},${report.longitude}" style="color: #14b8a6; text-decoration: none;" target="_blank">View on Google Maps</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Reported On:</td>
            <td style="padding: 8px 0;">${reportDate}</td>
          </tr>
          ${report.notes ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Notes:</td>
            <td style="padding: 8px 0;">${report.notes}</td>
          </tr>` : ''}
        </table>
        
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin-top: 20px;">
          <h3 style="margin-top: 0; color: #14b8a6;">How to help</h3>
          <p>This animal needs your assistance. Please respond to this report if you're able to help.</p>
          <p style="margin-bottom: 0;">You can reply directly to this email to get in touch with the reporter.</p>
        </div>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 14px; color: #6b7280;">
        <p>This report was sent via Stray Saver, an application designed to help stray animals find safety and care.</p>
        <p style="margin-bottom: 0;">© ${new Date().getFullYear()} Stray Saver</p>
      </div>
    </div>
  `;

  return {
    to: ngoEmails,
    subject: `[Stray Saver] New ${report.severity.toUpperCase()} Report: ${report.species} near ${report.landmark || 'your area'}`,
    html,
  };
};
