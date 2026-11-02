# SHIFT Driving School — Purple & Yellow

A responsive, single-page HTML/CSS/JavaScript website based on the design preview. No npm, framework, or build process is needed.

## Run

Extract the ZIP and open `index.html` in a current browser. Keep the assets folder beside the HTML file. For a local web server, run `python -m http.server 8080` in this folder and open http://localhost:8080.

## Included

- Purple, sunshine-yellow, and pale lavender theme.
- Car opening loader, skip button, replay button, and reduced-motion support.
- Generated learner-car hero artwork stored locally.
- Responsive mobile navigation and layouts.
- Course details dialogs and expandable FAQs.
- Enquiry message builder with validation and copy action.
- Optional email handoff, once a real enquiry email is configured.

## Customise before real business use

1. Replace SHIFT with the actual school name in `index.html` and the SCHOOL object in `script.js`.
2. Set the real email, phone, and address in the SCHOOL object in `script.js`. When email is set, the enquiry section displays those details and offers an email-app handoff. It never sends a message automatically.
3. Review and replace illustrative course descriptions, FAQs, and service details. No fees, ratings, instructor credentials, or pass rates are claimed.
4. Replace the concept notice and demonstration footer after configuring real business details.
5. Adjust the palette using the variables at the beginning of `style.css`.

## Enquiry limitations

The included form runs in the browser. It prepares a message that the visitor can copy, or open in their email app if configured. There is no backend, booking database, payment integration, or automatic email delivery. Names and phone numbers are not persisted by this website.

## Deploy

Upload the contents of this folder to a static hosting provider. The entry point is `index.html`. All required visual assets are included; no external fonts, CDNs, or API keys are required.

## Files

- index.html — page content
- style.css — desktop and mobile styling
- script.js — loader, menu, course dialogs, FAQs, and enquiry behaviour
- assets/learner-car.png — generated hero artwork
