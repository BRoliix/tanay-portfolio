import { marked, type Tokens } from "marked";

// marked v17 passes token objects to renderer methods (not strings).
// list(token)     — token.items is the array of listitem tokens
// listitem(token) — token.tokens are the inline tokens; use this.parser.parse()

marked.use({
  renderer: {
    list(token: Tokens.List) {
      const body: string = token.items
        .map((item) => this.listitem(item))
        .join("");
      return `<div class="terminal-list">${body}</div>`;
    },

    listitem(token: Tokens.ListItem) {
      const body: string = this.parser.parse(token.tokens);

      // If the rendered body contains a link, wrap the whole item as a nav button
      const hrefMatch = body.match(/href="([^"]*)"/);
      if (hrefMatch) {
        const href = hrefMatch[1];
        const isExternal =
          href.startsWith("http") || href.startsWith("mailto:");
        // Strip nested <a> to avoid invalid nesting
        const innerText = body.replace(/<a [^>]*>|<\/a>/g, "");
        return (
          `<a href="${href}" class="terminal-list-btn"` +
          (isExternal ? ` target="_blank" rel="noopener noreferrer"` : "") +
          `>${innerText}</a>`
        );
      }

      return `<div class="terminal-list-item">${body}</div>`;
    },
  },
});

export { marked };
