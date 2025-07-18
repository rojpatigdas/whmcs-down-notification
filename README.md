# WHMCS Down Notification

This project monitors the status of a WHMCS instance and sends alerts to Google Chat if downtime is detected.

## Features
- Periodically checks website status
- Sends notifications to Google Chat when the site is down
- Avoids duplicate alerts using persistent script properties

## Setup
1. Replace the placeholder webhook URL in the code with your own Google Chat webhook.
2. Deploy the Apps Script to run on a schedule (time-driven trigger).

## Security Notice
- Do NOT commit real webhook URLs or tokens to version control.
- All sensitive values should be managed securely and are excluded via `.gitignore`. 