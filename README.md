# The Saved Library

English translation of [Brain-ai-biz/saved-library](https://github.com/Brain-ai-biz/saved-library) by Eden Bibas / Brain (MIT).

**Everything you saved on Instagram and never went back to, sorted onto shelves.** The tool reads your "Saved" folder read-only, sorts it onto shelves by topic, sums up each post in one sentence, and gives you a list of what is actually worth doing. At the end a page opens on your computer. You click one button and every post flies from the wall of saved posts to its shelf, with search and a share card.

- **Cost:** zero. No API key and no extra subscription. It runs on the subscription you already have.
- **Safe for your account:** read-only. No likes, no saves, no removals and no clicks on Instagram.
- **Privacy:** everything stays on your computer. Post captions go only to the AI tool you are working with, so it can summarize them.
- **You need:** a computer (not a phone), a browser logged in to Instagram (Chrome is simplest), and Python 3.9 or newer (most Macs have it; if it is missing, the tool will tell you).
- **And one of these tools:** [Claude Code](https://claude.com/claude-code) (Claude Pro plan or higher), [Codex](https://chatgpt.com/codex) (included in paid ChatGPT plans), or plain ChatGPT with file upload (the free plan has a daily limit).
- **On a Mac you may see two prompts:** a request to install "command line developer tools" (the first time Python runs), and a request for access to your Downloads folder. Approve both.

## Install

**In Claude Code**
1. You need [Claude Code](https://claude.com/claude-code) installed on your computer.
2. Open it and paste:

> Install the "Saved Library" skill from https://github.com/crsbuilders/saved-library-en : download the repo into your skills folder, ~/.claude/skills/saved-library (if git is not installed, download the repo zip and extract it there). Then read SKILL.md in that folder and follow it to sort my saved posts. Talk to me in English.

**In Codex**

Same thing, with the Codex skills folder:

> Install the "Saved Library" skill from https://github.com/crsbuilders/saved-library-en : download the repo into your skills folder, ~/.agents/skills/saved-library (if git is not installed, download the repo zip and extract it there). Then read SKILL.md in that folder and follow it to sort my saved posts. Talk to me in English.

If the tool asks for permission to download or run a command, approve it. Next time, just open a new chat and type `sort my saved posts`.

**ChatGPT only**
1. Download [saved-library.zip](https://github.com/crsbuilders/saved-library-en/releases/latest/download/saved-library.zip) and double-click it. A `saved-library` folder appears in your Downloads folder.
2. Open `start.html` in that folder and read your saved posts with the button (steps 1 and 2 on the page).
3. In a new ChatGPT chat, attach the file that downloaded and `chatgpt/saved-library-chatgpt.py`, then paste the prompt from the button on the page (or from `chatgpt/prompt.txt`).

## What happens after you type "sort my saved posts"

1. **Reading:** Do you have the Claude extension for Chrome? The tool reads on its own. If not, the `start.html` page opens. You drag one button to your bookmarks bar and click it on Instagram. About a minute per 100 saved posts.
2. **Sorting:** the tool goes through every post, picks shelves that fit what you saved, and sums up each one in a sentence. About a minute per 100.
3. **The library:** the `library.html` page opens on your computer. You can come back to it any time, even offline.

| What you get | What it looks like |
|---|---|
| A wall of all your saved posts, and one click sends each post to its shelf | An opening screen with a button, then a sort of about 13 seconds, shelf by shelf. You can record it and share |
| Search across all saved posts | Matching books light up on the bookcase |
| "Worth doing" | Up to 15 practical things, with checkmarks that are saved |
| A shelf for each topic | A sentence per post and a link to the original post |
| Share card | An image ready for a story |

## Good to know
Summaries are written by AI and may be wrong. Only the caption of each post is read, not what is said in the video. Check the original post before you act on anything.

## What's inside
```
SKILL.md                         The instructions the tool follows
start.html                       The bookmarklet that reads saved posts, for people without the extension
scripts/collector.js             The code that reads saved posts (read-only)
scripts/library.py               Prepares, checks and builds the library
assets/library.html              The library page template
reference/sorting.md             How to sort and summarize
reference/collect.md             What exactly happens during reading, and why it is safe
chatgpt/                         The file and prompt for ChatGPT
```

---

Built with Claude Code 🤖 · Original by [Brain by Eden Bibas](https://brainai.co.il)
