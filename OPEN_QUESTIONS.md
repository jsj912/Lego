# Open questions

Things I wasn't sure about. Nothing here was guessed on the site; each item is either hidden or rendered exactly as written in `content/site.ts`.

1. **Resume PDF.** `public/resume.pdf` is not in the repo yet, so the "Download Blueprint" button is hidden. Drop the file in and rebuild.
2. **Contact email.** The site publishes the address in `person.email`. Confirm that's the one you want public.
3. **Paper count mismatch.** `builds[1].finalModel` says "~50 papers" and `publications[1].detail` says "49 papers". Both render as written. Pick one if you want them consistent.
4. **Award title vs timeline label.** The award is "1st Place (Solo) — CySeck Grand CTF Challenge 2026", and the timeline entry drops the year. Both render as written.
5. **Items from the prompt's Section 12** (Samsung/Fidelity titles and dates, the merged Department Coordinator entry, LinkedIn-only roles, CGPA/prize visibility, missing GitHub URLs, RingShield results, hero roles, form endpoint) are still yours to confirm. Edit `content/site.ts` and the site follows.
