# Linguadash

A minimal local-only Next.js English micro-learning game with 3 playable mini-games.

## Features

1. **Word of the Day** - Wordle-style guessing game with hints
2. **Idiom of the Day** - Guess the meaning of English idioms
3. **Grammar Formula** - Test your grammar knowledge with multiple-choice questions

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Client-side state management (no backend, no database)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- (Optional) Google Gemini API key for Idiom of the Day AI matching

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Set up Google Gemini API for Idiom matching:
   - Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a `.env.local` file in the root directory
   - Add: `GEMINI_API_KEY=your_api_key_here`
   - Note: The app will work without the API key, but Idiom matching will use a fallback method

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically reload when you make changes to the code.

## Project Structure

```
/app
  page.tsx          # Main menu
  layout.tsx        # Root layout
  globals.css       # Global styles
  /word
    page.tsx        # Word of the Day game
  /idiom
    page.tsx        # Idiom of the Day game
  /grammar
    page.tsx        # Grammar Formula game

/components
  WordleGrid.tsx    # Wordle-style grid component
  Keyboard.tsx      # Virtual keyboard component
  HintBox.tsx       # Hint display component
  TextInput.tsx     # Text input component

/data
  word.json         # Word of the Day data
  idiom.json        # Idiom of the Day data
  grammar.json      # Grammar Formula data
```

## Game Rules

### Word of the Day
- Number of attempts = number of unique letters in the word
- 3 hints shown at start (meaning, part of speech, origin)
- Each wrong attempt removes one hint
- Wordle-style feedback: green (correct position), yellow (wrong position), gray (not in word)

### Idiom of the Day
- Read the idiom
- Type the meaning
- Flexible matching: keyword overlap, partial similarity
- Shows correct answer after submission

### Grammar Formula
- Read the grammar formula and examples
- Choose the correct answer from multiple-choice options
- Shows explanation after submission

## Customization

You can easily customize the game by editing the JSON files in the `/data` directory:
- `word.json` - Change the word, meaning, part of speech, origin, and example
- `idiom.json` - Change the idiom and its meaning
- `grammar.json` - Change the grammar formula, description, examples, question, and options

## Build for Production

```bash
npm run build
npm start
```

## License

This project is open source and available for personal use.

