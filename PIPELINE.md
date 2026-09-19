# Course Brief - Drive-backed daily refresh

The Vercel app is a static shell. Daily content lives in one public Google Drive JSON file and audio lives in public Drive files, so daily refreshes do not redeploy the app.

## Stable runtime files

- Drive folder (sweetdevansh@gmail.com): https://drive.google.com/drive/folders/1Qz75-BXWO2FFX_sOZAESbewK9quKeV50?authuser=sweetdevansh%40gmail.com
- JSON file ID: 13HBt6ENPHHHKDOKLFGNWiEowriBwzKZc
- JSON runtime URL: https://drive.google.com/uc?export=download&id=13HBt6ENPHHHKDOKLFGNWiEowriBwzKZc
- Today's audio file ID: 1Ee99cJkRNWJIpX71Xy3PbDL6fzqsgJp8
- Today's audio URL: https://drive.google.com/uc?export=download&id=1Ee99cJkRNWJIpX71Xy3PbDL6fzqsgJp8

The shell fetches the JSON URL with cache disabled. If Drive is unavailable, it falls back to runtime-fallback.json baked into the one-time deployment.

## Every morning

1. Search Devansh's Berkeley calendar for every class that day, including calendar-only courses.
2. Pull live Canvas assignments, submission state, to-do/grading state, announcements/activity, week pages through module page_url, and the latest course files. Also read Berkeley Gmail Canvas notifications and course emails. Recall beats accuracy: over-include and label uncertainty.
3. Enrollment must come from current evidence. INFO 290T Continual Learning is enrolled, not an audit.
4. For every class, write:
   - Do before class: action-only preparation, optionals marked.
   - What you should know before class: synthesized learning takeaways.
   - Session detail: what happened or will happen that day, grounded in that day's lecture deck/week page/announcement.
   - Direct raw bCourses verifier/download links for uploaded PDFs/slides. Do not hide an available upload behind Study.Net or a generic course link.
   - Deliverables with due date, estimate, assignment link, submit link, and status.
5. Preserve all existing past/future days in the manifest and update/add today's day. On Sunday update the coming Mon-Sun week entry.
6. Strip private calendar descriptions, attendees, email addresses, grading queues/student data, internal notes, and anything not appropriate for the same public audience as the Vercel app.
7. Update Drive file 13HBt6ENPHHHKDOKLFGNWiEowriBwzKZc with tools google-drive update using account sweetdevansh@gmail.com, mime type application/json. Do not create a new JSON file; the ID must stay stable.
8. Generate the morning transcript under 350 words and send it to main for WAV generation. Convert to MP3, upload it to the Course Brief Runtime folder, share as anyone-reader, and write its public download URL into that day's audio field before the JSON update. Existing audio files may be overwritten by file ID on later corrections.
9. Verify the public JSON URL returns the new generated_at value, then load https://course-brief-pi.vercel.app on mobile width and visually inspect the current date, class jump breadcrumbs, each class card, raw file links, deliverables, and Listen button.
10. Report only material failure or a credential/permission blocker.

## One-time deployment

The archive containing this file must be deployed once to the existing course-brief-pi Vercel project. After that, normal daily refreshes touch Drive only.
