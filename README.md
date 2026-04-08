# Calendar App

A Next.js calendar app with Tailwind CSS styling, date range selection, and local notes.

## Features

- Interactive monthly calendar view
- Previous and next month navigation
- Today shortcut to jump back to the current date
- Clear selection control for resetting selected dates
- Single-day selection
- Date range selection with highlighted dates between the start and end date
- Daily, range, and monthly notes
- Notes are saved locally in the browser with `localStorage`
- Mark a selected date as a holiday
- Holiday dates are visually highlighted on the calendar
- Holiday selections persist in `localStorage`
- Light, dark, and system theme modes
- Theme preference is saved locally
- Responsive compact card layout designed to fit the screen
- Modern Tailwind CSS styling with soft borders, shadows, and image-led header
- Animated month transitions with Framer Motion

## Run Locally

Clone the repository to your local machine:

```bash
git clone https://github.com/ayantik2006/Interactive-Calendar-Component.git
```

Move into the project folder:

```bash
cd Interactive-Calendar-Component
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

## Useful Commands

Run lint checks:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server after building:

```bash
npm run start
```

## Windows PowerShell Note

If PowerShell blocks `npm` scripts because of execution policy, use `npm.cmd` instead:

```bash
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```
