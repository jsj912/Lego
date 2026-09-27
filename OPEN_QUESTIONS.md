# Open questions

Things I wasn't sure about. Nothing here was guessed on the site; each item is either hidden or rendered exactly as written in `content/site.ts`.

1. **Resume PDF.** Added (it was saved as `resume.pdf.pdf`; renamed to `public/resume.pdf`).
2. **Contact email.** The site publishes the address in `person.email`. Confirm that's the one you want public.
3. **Paper count mismatch.** `builds[1].finalModel` says "~50 papers" and `publications[1].detail` says "49 papers". Both render as written. Pick one if you want them consistent.
4. **Award title vs timeline label.** The award is "1st Place (Solo) — CySeck Grand CTF Challenge 2026", and the timeline entry drops the year. Both render as written.
5. **Items from the prompt's Section 12** (Samsung/Fidelity titles and dates, the merged Department Coordinator entry, LinkedIn-only roles, CGPA/prize visibility, missing GitHub URLs, RingShield results, hero roles, form endpoint) are still yours to confirm. Edit `content/site.ts` and the site follows.
6. **mAP variant.** Is 0.140 → 0.932 mAP@50 or mAP@50:95? The site now says the SSD-MobileNet baseline scored 0.140 and the RF-DETR Nano experts 0.932, without naming the variant.
7. **Single RF-DETR Nano without the router.** If you have that number, adding it would show what the MoE routing itself contributes.
8. **RingShield evidence.** No implementation yet. An architecture diagram or the evaluation protocol would strengthen the Research card.
9. **An LLM build.** The review points out there's no shipped LLM project. That's a content gap only you can fill.
10. **Smart Glasses and Homomorphic Encryption** are now compact "More sets" rather than fully archived. Say the word and I'll remove them from the page (their manuals would still exist).
11. **Hero role.** Now just "Machine Learning Engineer", per the review. Easy to change in `person.roles`.
12. **Off the clock placeholders** (`content/offTheClock.ts`, marked `TODO`): currently reading, running blurb, running stats, scrapbook blurb. They're hidden on the page until filled.
13. **Logos:** add `samsung`, `fidelity`, `bmsce`, `iitm` (.svg/.png/.webp/.jpg) to `public/logos/`. Until then the tiles show names.
14. **Hobby photos:** flowers (4), build-table (2) and scrapbook (2, incl. pencil sketches) added; `books` and `running` are still empty.
15. **Unmatched set tags** (not counted for any skill brick): ResNet-18 (Places365), RF-DETR Nano, CPU-only deployment, MobileNetV3, PanDerm ViT-B/16, HAM10000, PAD-UFES-20, Isolation Forest, Feature engineering, Haar Cascade, LBPH, OCR, Adaptive thresholding, Homomorphic encryption, IoT sensor data, Dynamic time-stamped graphs, Explainability, Drift monitoring, AMLworld, Elliptic, IEEE-CIS, PaySim.
16. **Skills with no set** now show 1 stud, including Object Detection (previously linked by hand to SET 001), Java, AWS, Spring Batch and Maven (their only set was the removed Fidelity one). Add aliases (e.g. RF-DETR Nano → Object Detection) if you want them counted.
17. **Minifig feet:** a few light flecks of leftover studio-floor reflection at the shoe soles (visible on dark backgrounds). Not edited.
