
import { supabase } from "@/integrations/supabase/client";

interface EmailPayload {
  to: string[];
  subject: string;
  html: string;
}

export const sendEmailToNGOs = async (payload: EmailPayload): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-report-email', {
      body: payload
    });

    if (error) {
      console.error("Error sending email:", error);
      return false;
    }

    console.log("Email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Exception sending email:", error);
    return false;
  }
};
