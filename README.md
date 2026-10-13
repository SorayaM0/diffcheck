
**DiffCheck**

DiffCheck is a lightweight JSON comparison tool I built to quickly see what changed between two JSON objects.

Paste a before and after response, run the comparison, and DiffCheck shows exactly which values were added, removed, or changed — including values inside nested objects and arrays.

**Features**

- Compare two JSON objects
- Detect added, removed, and changed values
- Compare nested objects and arrays recursively
- Show paths such as user.settings.theme and skills[1]
- Format JSON automatically
- Swap before and after inputs
- Detect invalid JSON
- Show a summary of the differences

**Built with**

- React
- TypeScript
- Vite
- CSS

**Why I built it**

When working with APIs or JSON data, it can be annoying to manually search through two responses to figure out what changed.

I wanted DiffCheck to do one thing well: take two JSON values and make their differences immediately obvious.

The main comparison logic recursively walks through objects and arrays, builds paths for nested values, and classifies each difference as added, removed, or changed.

**Running locally**

Clone the repository:

git clone https://github.com/SorayaM0/diffcheck.git

Install dependencies:

npm install

Start the development server:

npm run dev

Then open the local URL shown by Vite.

**Production build**

npm run build

Built by **Soraya Mosavi**.
