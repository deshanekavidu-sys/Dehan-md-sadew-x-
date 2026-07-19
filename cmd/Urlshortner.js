/*
  cmd/shortlink.js
  URL shortener using WhiteShadow API
  Exposes: shortlink
*/

const axios = require('axios');

module.exports = {
  name: 'shortlink',
  aliases: ['short', 'shorten'],
  execute: async (ctx) => {
    const {
      socket,
      msg,
      sender,
      quoted,
      text,
      arabianCtx,
      prefix
    } = ctx;

    try { await socket.sendMessage(sender, { react: { text: '🔗', key: msg.key } }); } catch (_) {}

    const url = text?.trim();

    if (!url) {
      return socket.sendMessage(sender, {
        text: `*⚠️ Usage:* ${prefix}shortlink <url>\n*Example:* ${prefix}shortlink kadiya-md-production.up.railway.app`,
        contextInfo: arabianCtx()
      }, { quoted: msg });
    }

    if (!/^https?:\/\//i.test(url)) {
      return socket.sendMessage(sender, {
        text: `*⚠️ Invalid URL.* Make sure it starts with http:// or https://`,
        contextInfo: arabianCtx()
      }, { quoted: msg });
    }

    try {
      const apiUrl = `https://whiteshadow-x-api.onrender.com/api/tools/shortlink?url=${encodeURIComponent(url)}&apitoken=aWK0z4`;
      const { data } = await axios.get(apiUrl, { timeout: 15000 });

      if (!data?.success || !data?.short_url) {
        throw new Error('API returned no short_url');
      }

      const responseText =
        `*↳ ❝ [🔗 𝗨𝗥𝗟 𝗦𝗵𝗼𝗿𝘁𝗲𝗻𝗲𝗿 🔗] ¡! ❞*\n\n` +
        `*⊹₊⟡⋆ Original:* ${data.original_url}\n` +
        `*⊹₊⟡⋆ Short:* ${data.short_url}\n\n` +
        `> *𝗔esthatic 𝗤ueen 𝗕y 𝗜sanka ⋆*`;

      await socket.sendMessage(sender, {
        text: responseText,
        contextInfo: arabianCtx()
      }, { quoted: msg });

    } catch (err) {
      await socket.sendMessage(sender, {
        text: `*❌ Shorten fail ununa.* Try again later.\n_${err.message}_`,
        contextInfo: arabianCtx()
      }, { quoted: msg });
    }
  }
};
