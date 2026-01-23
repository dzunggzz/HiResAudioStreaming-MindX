import { css } from "lit";

export const sharedStyles = css`
  @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&display=swap");

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :host {
    --weq8-font-stack: "Outfit", sans-serif;
    --weq8-font-size: 11px;
    --weq8-font-weight: 500;
    
    --weq8-bg: rgba(17, 24, 39, 0.4); /* gray-900 with opacity */
    --weq8-border: rgba(255, 255, 255, 0.1);
    --weq8-text: #f3f4f6;
    --weq8-text-dim: #9ca3af;
    --weq8-accent: linear-gradient(to right, #60a5fa, #a855f7);
    --weq8-accent-solid: #a855f7;
    --weq8-handle-shadow: 0 0 10px 2px rgba(168, 85, 247, 0.4);

    font-family: var(--weq8-font-stack);
    font-size: var(--weq8-font-size);
    font-weight: var(--weq8-font-weight);
    color: var(--weq8-text);
  }
`;
