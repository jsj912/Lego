// Data for the hidden /off-the-clock page. Every fact here is Joan's.
// `null` / empty means "not provided yet": the page hides it (no filler text).
// Anything marked TODO is a placeholder for Joan to fill in.
// Photos: drop images into /public/interests/<folder>/ (jpg, jpeg, png, webp, avif).

export type RunStat = { label: string; value: string };
export type Book = { title: string; author?: string };

export type Hobby = {
  id: "books" | "running" | "flowers" | "scrapbook" | "build-table";
  title: string;
  /** one-line blurb shown in the detail panel */
  blurb: string | null;
  /** folder name under /public/interests/ */
  folder: string;
  books?: Book[];
  currentlyReading?: string | null;
  runStats?: RunStat[];
  /** caption per photo file name (also used as alt text) */
  captions?: Record<string, string>;
};

export const hobbies: Hobby[] = [
  {
    id: "books",
    title: "The Worldbuilder's Shelf",
    blurb: "I read mostly high fantasy, for the worldbuilding.",
    folder: "books",
    books: [
      { title: "Mistborn", author: "Brandon Sanderson" },
      { title: "Assassin's Apprentice", author: "Robin Hobb · Farseer trilogy" },
      { title: "Fireborne", author: "Rosaria Munda" },
      { title: "The Name of the Wind", author: "Patrick Rothfuss" },
      { title: "The Wise Man's Fear", author: "Patrick Rothfuss" },
      { title: "The Da Vinci Code", author: "Dan Brown" },
      { title: "Angels & Demons", author: "Dan Brown" },
      { title: "Inferno", author: "Dan Brown" },
      { title: "Divergent", author: "Veronica Roth" },
      { title: "The Hunger Games", author: "Suzanne Collins" },
      { title: "The Maze Runner", author: "James Dashner" },
      { title: "The Giver", author: "Lois Lowry" },
    ],
    currentlyReading: null, // TODO: add the book you're currently reading
  },
  {
    id: "running",
    title: "The Running Track",
    blurb: null, // TODO: add a one-line blurb about running
    folder: "running",
    runStats: [], // TODO: add stats, e.g. { label: "Longest run", value: "…" }
  },
  {
    id: "flowers",
    title: "The Flower Stall",
    blurb: "I make bouquets.",
    folder: "flowers",
    captions: {
      "01-gladiolus-bouquet-held.webp": "Pink gladiolus, purple asters and baby's breath in kraft paper",
      "02-gladiolus-kraft-wrap.webp": "Pink gladiolus, purple asters and baby's breath",
      "03-red-roses.webp": "Red roses with baby's breath",
      "04-white-roses-purple.webp": "White roses, purple asters and baby's breath",
    },
  },
  {
    id: "scrapbook",
    title: "The Scrapbook Studio",
    blurb: null, // TODO: add a one-line blurb about scrapbooking
    folder: "scrapbook",
  },
  {
    id: "build-table",
    title: "The Build Table",
    blurb: "1000-piece jigsaw puzzles and brick-building sets.",
    folder: "build-table",
  },
];
