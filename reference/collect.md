# Reading from Instagram: what exactly happens

## What the code does
`scripts/collector.js` runs inside an instagram.com tab where the person is already logged in. It asks the site for the list `api/v1/feed/saved/posts`, the same list Instagram itself loads when you scroll your "Saved" folder, page by page (about 21 posts per page), with a random pause of 2.5 to 5.5 seconds between pages. Then it shrinks each post's image to 120 by 150 pixels, so the library works offline too, and downloads one JSON file.

## What it does not do
- No request changes anything: read requests (GET) only. No like, save, removal, follow, comment or message.
- It does not click any Instagram button. The download itself is a link the code creates on its own.
- It does not send the data to any server. The code has no address other than Instagram and its image server.
- It does not read messages, followers, password or cookies.

## What is in the file
For each post: ID, link, type (reel, photo, carousel), the creator's username, whether the account is private, the caption (up to 2,200 characters), post date, likes, comments, views, length, and a small image. The order is the save order: the first one is what you saved last.

## The bookmarklet (start.html)
- The button on the page is a bookmark that holds exactly the same code. Drag it to your bookmarks bar, and click it while you are on instagram.com.
- **Safari:** does not always allow dragging. In the "Develop" menu, check "Allow JavaScript from Smart Search Field". Chrome is easier.
- **Firefox:** works. If nothing happens, check that the bookmark was saved with an address that starts with `javascript:`.
- **An organization that blocks bookmarks with code** (work computer): use Claude with the Chrome extension, or another computer.
- **Phone:** not supported.

## More than 3,000 saved posts
Before the run, in the Instagram tab: `window.SAVED_LIMIT = 6000` (in route A, add the line at the start of the code). Above 3,000 the run is long, so explain that.

## If Instagram asks you to slow down
The code waits a minute and tries again, up to three times, then stops with `rate_limited`. Do not shorten the pauses and do not run in parallel. Wait 10 minutes and run again from the start.

## The route without the extension and without the bookmarklet
Instagram's official download ("Download your information" in settings, JSON format) includes the list of saved posts, but only a link and the creator's name, with no captions. You cannot summarize posts or build topic shelves from that, so the skill does not use it.
