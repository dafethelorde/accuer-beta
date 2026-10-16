# Accuer Beta

Build a single-page beta website for Accuer, a quantum-safe agentic swap router for tokenized assets. Use React, Vite, TypeScript, Tailwind CSS and viem only where needed for future onchain integrations. Deliver production-quality frontend code with a refined, editorial fintech look that feels designed by hand.



The website is invite-only. Users must enter a valid beta invite code to unlock the private beta experience. There must be no wallet connection buttons, wallet authentication, transaction signing, or requests for users to connect a wallet anywhere on the website.



The initial version should focus on the complete visual experience, invite verification, simulated routing and a read-only beta community preview. Do not implement real financial transactions or collect funds.



REFERENCE IMAGES



- Image A, the cream logo illustration, is the source of the brand palette. Use it for color only and never place the image on the page.

- Image B, notched pill tags on a dark surface with a halftone dot texture, is the reference for label chips and the background texture.

- Image C, a phone UI with a soft gradient community header, avatar stack, live participant counts and dark feed cards, is the reference for the beta community counter and recent activity feed.

- Image D, frosted glass cards stacked in layers with a progress ring, a dark pill button and a "Coming next" strip peeking beneath the card, is the reference for the route card and invite gate.



Treat images B, C and D as structural and stylistic inspiration. Recreate their shapes, spacing and layering in code.



BRAND PALETTE



Use only these colors:



- Cream base: #F4F4E6

- Light cream: #FAFAF1

- Deeper cream: #E8E9D6

- Deep green ink: #2F3739

- Secondary green: #3F4A4C

- Muted green: #6B7776

- Sage tints made by mixing deep green into cream at 12–20% opacity.



Define all colors as CSS variables and Tailwind tokens. No other hues may appear anywhere, including status states.



Light cream is the default theme. Key panels, including the route preview and footer, use deep green backgrounds with cream text.



LOGO RULE



- No logo, logo image, logo placeholder, reserved logo space or favicon artwork anywhere in the layout.

- The name "Accuer" appears only as plain typographic text in the navigation and footer, set in the heading font with no container, icon or reserved margin.



TYPOGRAPHY



- Inter Tight for headings, with tight tracking and large optical sizes.

- Inter for body text.

- JetBrains Mono for hashes, addresses and numbers.

- Left-aligned editorial headlines, generous whitespace, small uppercase section labels and a clear size hierarchy.



SIGNATURE COMPONENTS



1. Notched pill chips



Build rounded pill chips split into an icon tab and a label using CSS masks or pseudo-elements to create a small semicircular notch.



The icon tab uses deep green with a cream line icon. The label area uses a cream tint with ink text. Use lucide-react icons.



Use these for hero chips, route stage labels and status tags.



2. Halftone texture



Create a subtle dot pattern using a CSS radial gradient at very low opacity. Apply it only to deep green panels and fade it out at the edges using a mask.



3. Layered glass cards



Use frosted cards with backdrop blur, thin translucent borders, 28px corner radii and soft layered shadows.



A second card sits slightly behind the main card and shows a peeking strip beneath it. The strip carries the "Next" label and the upcoming action.



4. Progress ring



Create a small circular progress indicator displaying a percentage. Use it in the invite gate and route card.



5. Pill action buttons



Use deep green pill buttons with cream labels and muted secondary labels where appropriate.



Buttons should feel tactile, with subtle compression on press and clear focus states.



6. Community header



Create a rounded header card with a soft sage-to-cream gradient, a large title, an overlapping avatar stack and a stats line.



7. Feed cards



Create deep green rounded cards with a small geometric avatar, a truncated wallet address, an amount in monospaced type and a relative timestamp.



Wallet addresses in this section are display-only sample data. They must never be used to trigger wallet connections or transactions.



LOOK AND FEEL



- Hand-designed character with asymmetric layouts, varied card sizes and deliberate whitespace.

- Sections change rhythm as the page scrolls.

- No neon gradients, glow effects, purple or blue tints, emojis, stock gradient blobs or identical three-column feature grids.

- Soft low-contrast shadows, 1px hairline borders and consistent 28px and 999px radii.

- Physical-feeling micro-interactions: cards lift slightly on hover, stage transitions slide and settle, and buttons compress on press.

- Respect prefers-reduced-motion.

- Mobile-first design, with one column on small screens and a centered max-width layout on desktop.

- Large tap targets, visible focus states and accessible contrast.



CONTENT AND CONFIGURATION RULES



Every visible text element must contain finished, professional product copy.



Do not include lorem ipsum, bracketed placeholders, TODO notes, developer commentary or echoes of these instructions.



All configurable values live in src/config.ts.



If a configurable value is missing, the relevant section renders a clearly labelled preview state rather than showing empty or broken content.



The website must be usable without connecting a wallet, entering a seed phrase, providing a private key or signing a transaction.



PAGE STRUCTURE



1. Navigation



- Plain text "Accuer" on the left.

- Links to How it works, Beta and FAQ.

- An "Enter beta" pill button on the right.



The button scrolls to the invite gate.



2. Hero



Headline:



"Agent-signed, post-quantum-verified routing for tokenized assets"



Subhead:



"Accuer finds the best path for your swap, signs it with quantum-resistant keys and enforces it onchain through a Uniswap v4 hook."



Buttons:



- "Enter beta"

- "See how it works"



Notched pill chips:



- Quantum-resistant signatures

- Agent-driven routing

- Onchain enforcement



On the right, create a layered glass card composition previewing the route card. Partially crop the composition over a deep green panel with a subtle halftone texture.



The hero must communicate the product immediately without relying on generic crypto imagery.



3. Invite Gate



This is the primary access control for the beta.



Create a layered glass card with the following content:



Header label: "Beta access"



Title: "Private beta access"



Text:



"Accuer is open to invited participants during the beta. Enter your invite code to continue."



Input label: "Invite code"



Input placeholder: "Enter your invite code"



Button: "Verify code"



Muted secondary label: "Invite only"



Peeking strip:



"Next" followed by "Route your intent"



Success message:



"Access granted. Welcome to the Accuer beta."



Error message:



"This invite code is invalid or has already been used."



Invite verification logic



- Hash the entered code with SHA-256 in the browser.

- Compare the hash against the configured invite hash list.

- Track redeemed codes and reject repeat attempts within the supported redemption scope.

- Persist unlocked access in sessionStorage with try/catch handling.

- Restore access from sessionStorage when the page reloads within the same browser session.

- Unlock the route preview, beta pledge information and community preview after successful verification.

- Keep the route and beta sections locked until a valid invite code is accepted.

- Display accessible loading, success and error states.

- Do not expose raw invite codes in the interface, logs or source code.



Important: client-side verification is appropriate for a frontend prototype but cannot securely enforce globally single-use invite codes. Do not claim global redemption security unless a trusted backend is implemented.



4. Route Preview



This section becomes visible only after successful invite verification.



Place it on a deep green panel with cream text and a subtle halftone texture.



Title:



"Route your intent"



Description:



"Describe the swap you want and Accuer builds, signs and verifies the best route."



Input placeholder:



"Swap 500 USDC into tokenized T-bills at best price"



Button:



"Find best route"



Muted secondary label:



"Simulated"



Route card



Build a main glass card containing:



- A progress ring.

- Four stages with progress at 25%, 50%, 75% and 100%.

- Notched pill chips for each stage:

  1. Intent parsed

  2. Routes simulated

  3. Route signed

  4. Hook verified

- A peeking strip beneath the card showing the next upcoming stage.

- Smooth transitions between stages.



Hop diagram



Display each simulated route hop with:



- Pool name.

- Expected output.

- Fee.

- Price impact.



Route comparison



Display:



- The selected route.

- The direct pool comparison.

- Estimated savings in basis points.



Clearly identify all figures as simulated estimates.



Route commitment



Create a panel titled "Route commitment" containing:



- A mock WOTS+ commitment hash.

- A mock one-time key index.

- A copy button for the commitment hash.



Footnote:



"Each signing key is used once and rotates after every intent."



Use a mock simulation module that returns data in the exact shape expected from a future agent response, so a live agent can replace the mock without changing the UI.



Show a persistent "Simulated route" badge until a real routing and signing system is integrated.



Do not claim that a simulated route has been cryptographically signed, verified or executed onchain.



5. Beta Pledge Information



This section becomes visible only after successful invite verification.



There must be no wallet connection, transaction signing, payment collection or real pledge execution.



Title:



"Beta pledges"



Description:



"Pledge funds to support the Accuer beta. Pledging is available only while the beta is open."



For this version, present the pledge experience as a preview of the planned beta participation process.



Include:



- A clearly labelled "Preview" badge.

- A pledge amount input using minimum and maximum display values from config.

- A "Pledge" button that does not initiate a transaction or collect funds.

- A countdown to the configured beta close date.

- A transaction status preview with notched pill chips labelled "Pending", "Confirmed" and "Failed".

- A clear note that pledge functionality is not yet active.



The pledge button should display a helpful message such as:



"Pledge functionality is not yet available. No funds have been collected."



When the beta close date has passed, show:



"The beta pledge window has closed. Thank you to everyone who took part."



Do not imply that a pledge has been submitted, confirmed or recorded onchain.



6. Beta Community Counter



This section becomes visible only after successful invite verification.



Recreate the community header structure using the soft sage-to-cream gradient.



Header content:



- Small label: "Beta community"

- Title: "Total pledged"

- A large animated sample number in monospaced type.

- An overlapping avatar stack generated deterministically from sample wallet-address strings using simple geometric shapes in brand tints.

- A stats line with a live-style indicator and clearly labelled sample pledger count and remaining invites.



Below the header:



- A progress bar toward the configured sample goal.

- A "Recent pledges" feed using deep green cards.

- Truncated sample wallet addresses.

- Sample amounts.

- Relative timestamps.

- A visible "Preview data" badge beside the counter and feed.



Data requirements



The initial version uses PREVIEW mode only.



Use static sample data stored in configuration. Every displayed number must be explicitly identified as sample data and must not be presented as an actual onchain balance, real pledge total or verified participant count.



The avatar stack must be deterministic so the same sample address always generates the same geometric avatar.



Structure the data adapter so a future LIVE mode can read total pledged, pledger count and recent pledge events from a configured pledge contract through an RPC endpoint.



For the current version:



- Do not connect to a wallet.

- Do not submit transactions.

- Do not claim live contract data.

- Do not require contract addresses or RPC configuration to render the page.

- Provide typed loading, empty and error states for the future LIVE adapter.



In PREVIEW mode, the interface must clearly identify all sample data.



7. How It Works



Title:



"How Accuer works"



Present the four steps as a staggered vertical timeline with large step numerals in monospaced type, varied card widths and no uniform grid.



Step 1 — State your intent



"Describe the swap in plain language and Accuer's agent interprets the request."



Step 2 — Simulate the routes



"The agent evaluates paths across tokenized asset pools and selects the best outcome."



Step 3 — Sign with quantum-resistant keys



"The chosen route is committed with a one-time hash-based signature."



Step 4 — Enforce onchain



"A Uniswap v4 hook verifies the commitment before the swap executes and applies a dynamic fee."



These descriptions explain the intended architecture. The website must distinguish planned functionality from implemented functionality wherever necessary.



8. FAQ



Create an accessible accordion with hairline dividers and smooth height transitions.



Question:



"What is Accuer?"



Answer:



"Accuer is an agentic swap router that uses quantum-resistant signatures and a Uniswap v4 hook to route trades in tokenized assets."



Question:



"Why quantum-resistant signatures?"



Answer:



"Hash-based signatures are designed to resist attacks from quantum computers and can support verification workflows onchain."



Question:



"Who can join the beta?"



Answer:



"Access is by invite code only."



Question:



"What happens to pledged funds?"



Answer:



"The beta pledge functionality is not yet active, and this preview does not collect funds. Before real pledges open, the applicable contract, terms and handling of funds will be disclosed."



9. Risk Notice and Footer



Use a deep green panel with cream text and a subtle halftone texture.



Risk notice:



"Accuer is beta software and has not completed a formal security audit. Route previews are simulated, and pledge functionality is not yet active. Do not interpret this website as confirmation that a transaction has been signed, verified or executed."



Footer:



- Plain text "Accuer".

- Links to X and Telegram using configured URLs.

- "© Accuer" with the current year computed in code.



If a social URL is missing, hide the corresponding link or show an appropriately labelled preview state. Never display broken links.



ENGINEERING REQUIREMENTS



Use:



- React.

- Vite.

- TypeScript.

- Tailwind CSS.

- lucide-react.

- viem only where it supports future onchain integration or typed blockchain utilities. The initial PREVIEW experience must work without wallet access.



Required files and modules:



- src/config.ts

- A typed data adapter.

- A mock route simulator.

- An invite verification module.

- A pledge hooks file.

- Theme tokens.

- Focused components for the notched chip, glass card, progress ring and avatar stack.

- A README covering setup, configuration, preview mode and future live integration.



Define typed interfaces for:



- Route data.

- Route hops.

- Pledge events.

- Pledge preview data.

- Invite configuration.

- Application configuration.

- Data adapter responses.



Keep all configurable values in src/config.ts, including:



- Invite code hashes.

- Beta close date.

- Pledge minimum and maximum.

- Sample pledge goal.

- Sample community metrics.

- Sample pledge events.

- X and Telegram URLs.

- Feature flags and data mode.



The initial configuration must use PREVIEW mode.



ACCESSIBILITY AND ERROR HANDLING



- Use semantic HTML.

- Provide accessible input labels.

- Support keyboard navigation.

- Make focus states visible.

- Ensure appropriate text contrast.

- Respect prefers-reduced-motion.

- Handle unavailable browser storage gracefully.

- Handle malformed configuration without crashing the page.

- Ensure every button has a meaningful action.

- Avoid dead links and nonfunctional controls.

- Never require a wallet to access the beta interface.



DELIVERABLE



Generate the complete project with all required source files and a README containing installation and run instructions.



The project must run locally with:



npm install

npm run dev



Also include the production build command:



npm run build



The final implementation must be responsive, polished, typed, maintainable and ready to sync to GitHub for deployment through GitHub Pages.



The website must function entirely in preview mode without a deployed smart contract, backend, wallet connection or paid infrastructure.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a332e58c-8a3a-4476-af8d-4e340989509e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
