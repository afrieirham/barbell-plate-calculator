# Project Specification: Barbell Calculator App

A simple, client-side web application designed to help users calculate how to load a barbell to reach a target weight.

---

## 1. Technical Stack

- **Framework:** React Router v7 (SPA / Client-only routing)
- **Styling:** Tailwind CSS (configured for **Light Mode only**)
- **State Management:** React state synchronized with URL search parameters and LocalStorage
- **Deployment:** Static hosting (Cloudflare Pages, Vercel, Netlify, or GitHub Pages) since there is no backend server.

---

## 2. Core Features & Requirements

### 2.1 Weight Specifications

- **Unit System:** Kilograms (kg) only. No lbs support is required.
- **Barbell Weight:** User-definable via a numeric input (default standard of 20 kg).

### 2.2 Plate Inventory Management

- Users can toggle which plates they have available.
- The app must pre-populate a list of the most common plate sizes:
  - `25 kg`, `20 kg`, `15 kg`, `10 kg`, `5 kg`, `2.5 kg`, `2 kg`, `1.25 kg`, `1 kg`, `0.5 kg`
- Users toggle each plate to include or exclude it from the calculation.

### 2.3 Target Weight Increments

- Easily increase or decrease the target weight using two dedicated buttons:
  - **`+ 2.5kg` Button**
  - **`- 2.5kg` Button**
- Direct numeric input for target weight must also be supported.

---

## 3. App Logic & Calculations

### 3.1 Barbell Loading Algorithm

To calculate the plates needed for one side of the barbell:

1. **Formula:** `Remaining Weight = (Target Weight - Barbell Weight) / 2`
2. **Plate Matching:**
   - Iterate through the available (active) plates sorted from heaviest to lightest.
   - For each plate, determine how many can fit into the `Remaining Weight` (using pairs, since plates are loaded symmetrically on both sides of the barbell).
   - Subtract the weight of the allocated plates from `Remaining Weight` and continue down the list.
3. **Edge Cases:**
   - If the remaining weight cannot be perfectly matched with the available plates, show the closest possible match _under_ the target weight, along with a warning (e.g., "Exact weight cannot be loaded with current plates").
   - Ensure the target weight cannot be set lower than the barbell weight.

---

## 4. UI/UX Design & Layout (Light Mode Only)

The UI must be clean, highly readable, and styled exclusively for light mode (e.g., white and light gray backgrounds, dark gray text, and vibrant accents like indigo or emerald).

### 4.1 Layout Sections

1. **Header:**
   - Title: "Barbell Plate Calculator"
2. **Target Weight Section:**
   - Large display of the current Target Weight.
   - Quick increment/decrement buttons (`-2.5 kg` and `+2.5 kg`) placed prominently next to or below the weight.
   - A direct manual input field for precise weight entries.
3. **Barbell Configuration Section:**
   - Numeric input to set the Barbell Weight (e.g., standard 20 kg, 15 kg technique bar).
4. **Plate Inventory Checklist:**
   - Visual grid of the available plates: `25`, `20`, `15`, `10`, `5`, `2.5`, `2`, `1.25`, `1`, `0.5`.
   - Simple toggle cards (or checkboxes) allowing users to enable/disable specific plate weights from being used in the calculation.
5. **Results & Visualization Section:**
   - **Primary Display ("Per Side"):** Boldly display the plates required for **one side** of the barbell (e.g., _"Load on each side: 1x 20kg, 1x 5kg"_). This layout must list plates from heaviest (inside) to lightest (outside) to match the physical loading sequence.
   - **Secondary Display ("Total Plates Needed"):** Provide a smaller, secondary breakdown of the total physical plates required for the build (e.g., _"Total plates used: 2x 20kg, 2x 5kg"_). This helps the user quickly grab all the gear they need before they start loading.
   - **Share Configuration Button:** A quick-action button to copy the shareable configuration URL with feedback.

---

## 5. URL Shareability & State Persistence

To allow users to share their current configurations (target weight, barbell weight, and active plate inventory), the app state is serialized and synchronized in the URL parameters.

### 5.1 URL Schema Design

A standard shareable URL will look like this:
`?target=100&bar=20&plates=25,20,10,5,2.5`

- `target`: The target weight to calculate (number).
- `bar`: The weight of the barbell (number).
- `plates`: A comma-separated list of active plate weights.

### 5.2 Synchronization Flow

1. **On Mount (Load):**
   - The app checks the URL for `target`, `bar`, and `plates` query parameters.
   - If present, these settings override the default state.
   - If absent, the app falls back to LocalStorage (or system defaults if it is a first-time user).
2. **On State Change:**
   - Whenever the user updates the target weight, barbell weight, or toggles a plate, the app updates the browser URL parameters in real-time using React Router's `useSearchParams`. The state is also saved to LocalStorage.
3. **Share Feature:**
   - Add a "Share Link" button next to the results.
   - Clicking this button copies the current page URL (complete with parameters) to the user's clipboard and triggers a brief "Link copied!" visual confirmation.

---

## 6. Development Tasks & Milestones

- [ ] **Phase 1: Project Setup**
  - Initialize the React Router v7 project.
  - Install and configure Tailwind CSS.
  - Disable any automatic dark mode media query listeners to enforce a strict Light Mode.
- [ ] **Phase 2: State & Core Logic**
  - Implement state structure for `targetWeight`, `barbellWeight`, and `availablePlates`.
  - Write the mathematical helper function to calculate symmetrical plate distribution.
- [ ] **Phase 3: UI Implementation**
  - Build the input controls (barbell weight & target weight).
  - Create the +/- 2.5kg increment button components.
  - Build the interactive plate selection grid.
- [ ] **Phase 4: Results Display**
  - Render the primary "Per Side" plate breakdown.
  - Render the secondary "Total Plates" list.
  - Add basic error handling (e.g., target weight less than bar weight, or unattainable weights).
- [ ] **Phase 5: Local Storage Persistence**
  - Save the user's preferred barbell weight and available plate configuration to local storage so it persists on page reload.
- [ ] **Phase 6: URL State Sharing**
  - Implement URL query parameter serialization using React Router's `useSearchParams`.
  - Add logic to read and apply configurations from links on initial app load.
  - Create a "Share Configuration" button that copies the URL to the clipboard with a copy-success toast/badge.
