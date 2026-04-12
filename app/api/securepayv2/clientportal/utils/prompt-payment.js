/**
 * ════════════════════════════════════════════════════════════════
 * HANDLER: promptMobileStk
 * PURPOSE: Send STK push request to M-Pesa provider
 * RETURNS: { success, message, data }
 * ════════════════════════════════════════════════════════════════
 */

export async function promptMobileStk({ auth, payload }) {
    try {
      const projectId = payload?.project_id;
      const mpesaMobileNumber = payload?.mpesa_mobile_number;
      const amount = payload?.amount;
  
      // ✅ VALIDATION
      if (!projectId) {
        return { success: false, message: "project_id is required" };
      }
  
      if (!mpesaMobileNumber) {
        return { success: false, message: "mpesa_mobile_number is required" };
      }
  
      if (amount === undefined || amount === null || amount === "") {
        return { success: false, message: "amount is required" };
      }
  
      console.log("promptMobileStk called with:", { auth, payload });
  
      // ✅ STK REQUEST
      const STK_URL = "https://api.asanetic.com/mpesastk.php";
  
      const requestPayload = {
        onlinetrx: "true",
        paidamt: String(amount),
        accno: String(projectId),
        telno: String(mpesaMobileNumber)
      };
  
      const requestBody = new URLSearchParams(requestPayload).toString();
  
      const providerResponse = await fetch(STK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: requestBody
      });
  
      const rawBody = await providerResponse.text();
  
      let parsedBody = null;
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        parsedBody = null;
      }
  
      // ❌ PROVIDER ERROR
      if (!providerResponse.ok) {
        return {
          success: false,
          message: `STK provider request failed (${providerResponse.status})`,
          data: {
            request_payload: requestPayload,
            provider_status: providerResponse.status,
            provider_response: parsedBody || rawBody
          }
        };
      }
  
      // ✅ SUCCESS
      return {
        success: true,
        message: "M-Pesa STK prompt sent",
        data: {
          request_payload: requestPayload,
          provider_status: providerResponse.status,
          provider_response: parsedBody || rawBody
        }
      };
  
    } catch (error) {
      console.error("Error in promptMobileStk:", error);
  
      return {
        success: false,
        message: error?.message || "Operation failed"
      };
    }
  }