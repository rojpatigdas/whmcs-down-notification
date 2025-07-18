// Code.js
// Monitors the status of a website and sends an alert to Google Chat if the site is down.
// Configure your webhook URL in the variable below. Do not commit real tokens to version control.

/**
 * Checks the status of a website and sends an alert to Google Chat if the site is down.
 * Uses script properties to track consecutive failures and avoid duplicate alerts.
 */
function checkWebsiteStatus() {
  const url = "https://secure.itgenius.com.au"; // URL to monitor
  const chatWebhookUrl = "YOUR_CHAT_WEBHOOK_URL"; // TODO: Insert your Google Chat webhook URL here.
  const scriptProperties = PropertiesService.getScriptProperties(); // Used to store persistent script state
  const consecutiveFailures = scriptProperties.getProperty("consecutiveFailures") ? parseInt(scriptProperties.getProperty("consecutiveFailures")) : 0;
  const alertSent = scriptProperties.getProperty("alertSent"); // Flag to avoid duplicate alerts

  try {
    const response = UrlFetchApp.fetch(url); // Attempt to fetch the website
    const statusCode = response.getResponseCode();

    if (statusCode === 200) {
      // Site is up, reset failure counters
      scriptProperties.deleteProperty("consecutiveFailures");
      scriptProperties.deleteProperty("alertSent");
    } else {
      // Site is down, increment failure counter
      const newConsecutiveFailures = consecutiveFailures + 1;
      scriptProperties.setProperty("consecutiveFailures", newConsecutiveFailures);

      // Only send alert if failures reach threshold and alert hasn't been sent
      if (newConsecutiveFailures >= 2 && !alertSent) {
        UrlFetchApp.fetch(chatWebhookUrl, {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify({ text: `🚨 BILL DOWN!!! 🚨\nURL: ${url}` })
        });
        scriptProperties.setProperty("alertSent", "true");
      } else {
        console.log(`Website down. Consecutive failures: ${newConsecutiveFailures}`);
      }
    }
  } catch (error) {
    // Handle fetch errors (e.g., network issues)
    const newConsecutiveFailures = consecutiveFailures + 1;
    scriptProperties.setProperty("consecutiveFailures", newConsecutiveFailures);

    if (newConsecutiveFailures >= 2 && !alertSent) {
      UrlFetchApp.fetch(chatWebhookUrl, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({ text: `🚨 BILL DOWN!!! 🚨\nURL: ${url}` })
      });
      scriptProperties.setProperty("alertSent", "true");
    } else {
      console.error(`Error checking website: ${error}. Consecutive failures: ${newConsecutiveFailures}`);
    }
  }
}
