// Saved Library: reads your Instagram "Saved" folder, read-only.
// Runs inside a logged-in instagram.com tab: through Claude in Chrome, or from the bookmarklet in start.html.
// What it does: asks Instagram for the same list the site itself loads when you scroll your Saved folder (GET requests only),
// with a 2.5 to 5.5 second pause between pages, and downloads one JSON file to your computer.
// What it does not do: it clicks nothing on Instagram, doesn't like, save, unsave or send messages,
// and sends the data nowhere except the file that lands on your computer.
(() => {
  const VERSION = 'saved-library/1';
  const LIMIT = Number(window.SAVED_LIMIT) || 3000;
  const H = { 'X-IG-App-ID': '936619743392459', 'X-Requested-With': 'XMLHttpRequest' };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  if (!/(^|\.)instagram\.com$/.test(location.hostname)) {
    alert('Open instagram.com, logged in to your account, then click the bookmark again.');
    return 'NOT_INSTAGRAM';
  }
  if (window.__saved && !window.__saved.done) return 'ALREADY_RUNNING';
  const S = window.__saved = { n: 0, stage: 'list', done: false, error: '', file: '', thumbs: 0 };

  // Small progress box. It does not block the page and takes no action on the account.
  const box = document.createElement('div');
  box.setAttribute('dir', 'ltr');
  box.style.cssText = 'position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#0b1424;color:#fff;' +
    'font:600 16px/1.5 system-ui,-apple-system,Segoe UI,Arial;padding:14px 22px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.35);' +
    'border:3px solid #77CEBF;min-width:300px;text-align:center;pointer-events:none';
  document.body.appendChild(box);
  const show = (main, sub) => { box.innerHTML = `<div style="font-size:19px">${main}</div><div style="opacity:.75;font-size:13px">${sub || 'Read-only: no likes, no saves, no changes to your account'}</div>`; };
  show('Starting to read your saved posts');

  const kindOf = m => m.product_type === 'clips' ? 'reel' : ({ 1: 'photo', 2: 'video', 8: 'carousel' }[m.media_type] || 'post');
  const thumbOf = m => {
    const src = m.image_versions2 ? m : (m.carousel_media || [])[0] || {};
    const c = (src.image_versions2 && src.image_versions2.candidates) || [];
    const small = c.filter(x => x.width >= 240).sort((a, b) => a.width - b.width)[0] || c[c.length - 1];
    return small ? small.url : '';
  };
  const day = ts => ts ? new Date(ts * 1000).toISOString().slice(0, 10) : '';
  const rowOf = (m, order) => {
    const kind = kindOf(m), u = m.user || {};
    return {
      id: m.code, order, kind,
      url: `https://www.instagram.com/${kind === 'reel' ? 'reel' : 'p'}/${m.code}/`,
      author: u.username || '', author_private: !!u.is_private,
      caption: ((m.caption && m.caption.text) || '').slice(0, 2200),
      posted: day(m.taken_at),
      likes: m.like_count ?? null, comments: m.comment_count ?? null,
      plays: m.ig_play_count ?? m.play_count ?? null,
      duration: m.video_duration ? Math.round(m.video_duration) : null,
      _thumb: thumbOf(m),
    };
  };

  const page = async maxId => {
    const url = '/api/v1/feed/saved/posts/' + (maxId ? '?max_id=' + encodeURIComponent(maxId) : '');
    for (let attempt = 0; attempt < 3; attempt++) {
      const r = await fetch(url, { headers: H, credentials: 'include' });
      if (r.ok) {
        const j = await r.json();
        if (j.status && j.status !== 'ok') throw new Error('instagram_status_' + j.status);
        return j;
      }
      if (r.status === 401 || r.status === 403) throw new Error('not_logged_in');
      if (r.status === 429 || r.status >= 500) { show('Instagram asked to slow down, waiting a minute', `Read so far: ${S.n}`); await sleep(60000); continue; }
      throw new Error('http_' + r.status);
    }
    throw new Error('rate_limited');
  };

  // A small thumbnail per post, stored inside the file so the library works offline, even after Instagram's image links expire.
  const shrink = async url => {
    const r = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!r.ok) return '';
    const bmp = await createImageBitmap(await r.blob());
    const W = 120, Hh = 150, c = document.createElement('canvas');
    c.width = W; c.height = Hh;
    const k = Math.max(W / bmp.width, Hh / bmp.height), w = bmp.width * k, h = bmp.height * k;
    c.getContext('2d').drawImage(bmp, (W - w) / 2, (Hh - h) / 2, w, h);
    return c.toDataURL('image/jpeg', 0.72);
  };

  const run = async () => {
    const rows = [], seen = new Set();
    let maxId = null;
    while (rows.length < LIMIT) {
      const j = await page(maxId);
      for (const it of j.items || []) {
        const m = it.media;
        if (!m || !m.code || seen.has(m.code)) continue;
        seen.add(m.code);
        rows.push(rowOf(m, rows.length + 1));
      }
      S.n = rows.length;
      show(`Read ${rows.length.toLocaleString('en-US')} saved posts`);
      if (!j.more_available || !j.next_max_id) break;
      maxId = j.next_max_id;
      await sleep(2500 + Math.random() * 3000);
    }
    if (!rows.length) throw new Error('no_saved_posts');
    S.stage = 'thumbs';
    let i = 0;
    const worker = async () => {
      while (i < rows.length) {
        const row = rows[i++];
        try { row.thumb = row._thumb ? await shrink(row._thumb) : ''; } catch (e) { row.thumb = ''; }
        delete row._thumb;
        S.thumbs++;
        if (S.thumbs % 20 === 0) show(`Making thumbnails ${S.thumbs.toLocaleString('en-US')} of ${rows.length.toLocaleString('en-US')}`);
        await sleep(120);
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    const today = new Date().toISOString().slice(0, 10);
    const payload = { format: VERSION, exported_at: new Date().toISOString(), count: rows.length, posts: rows };
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = S.file = `instagram-saved-${today}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    S.stage = 'saved';
    show(`Done: ${rows.length.toLocaleString('en-US')} saved posts`, `${S.file} is in your Downloads folder. Go back to your AI tool and continue.`);
    setTimeout(() => box.remove(), 20000);
  };

  const MSG = { not_logged_in: 'Log in to Instagram in this browser and try again', rate_limited: 'Instagram asked to slow down. Try again in a few minutes',
                no_saved_posts: 'No saved posts found on this account' };
  run().catch(e => { S.error = String(e.message || e); show('Reading stopped', MSG[S.error] || S.error); })
       .finally(() => { S.done = true; });
  // For polling from Claude in Chrome: returns only numbers and a file name, never text written by someone else
  window.__savedPoll = async () => {
    for (let k = 0; k < 25 && !S.done; k++) await sleep(1000);
    return ['SAVED', 'STATE', S.n, S.thumbs, S.stage, S.done ? 1 : 0, S.error, S.file].join('|');
  };
  return 'STARTED';
})()
