# 🚀 MarkFlow - Premium Markdown WYSIWYG Editor

MarkFlow is a dual-pane, real-time Markdown WYSIWYG editor built using React, TypeScript, Vite, and TipTap. It is designed to provide content writers and web developers with a fluid, visual editing environment that syncs directly with raw Markdown syntax.

---

## ✨ Why MarkFlow Was Created

When building content-driven sites—such as **Astro websites, Gatsby blogs, or static document hubs**—managing content files directly inside text editors (like VS Code) can be cumbersome and disruptive to writing flows.

- **The VS Code Pain Point**: Adding rich formatting, aligning internal links, referencing public image assets, or embedding YouTube/iframe scripts requires constant manual typing of complex brackets and tag syntax.
- **Bi-directional Freedom**: MarkFlow solves this by letting you write in a visual, responsive WYSIWYG interface on the left while simultaneously generating clean Markdown on the right. You can also edit raw Markdown directly and see the visual preview update in real-time.
- **Crawl & Dev Port Security**: By default, Vite binds to ports like `5173`. MarkFlow is configured to listen specifically on **port `5175`**, ensuring it never conflicts with your active Astro development server (`:4321`) or wrangler functions (`:8787`).

---

## 🛠️ Key Features

- **🔄 Bi-directional Real-Time Syncing**: Edits made in the WYSIWYG editor convert to Markdown via `turndown`, and edits in the Markdown area compile instantly to rich text preview via `marked`.
- **📜 Locked Scroll Synchronization**: Both editor heights are linked percentage-wise, allowing you to track the exact paragraph you are editing across views without manual scrolling.
- **🎥 Media Embedding**: Simple, dialog-driven support for inserting web links, images, and responsive YouTube videos.
- **💾 Import/Export Utilities**: Directly upload existing `.md` files into the workspace, edit them, and export/download them back to your computer.
- **📋 Single-Click Copy MD**: A dedicated primary button instantly copies clean Markdown into your clipboard, complete with success checkmark indicator micro-animations.
- **🎨 Glassmorphic Dark & Light Theme**: Toggle between a high-contrast dark layout and a clean, airy light layout.
- **📊 Real-time Document Stats**: Track word count, character count, and estimated reading time directly in the footer.

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies using npm:
```bash
npm install --legacy-peer-deps
```

### 2. Launch Local Dev
Start the development server:
```bash
npm run dev
```

### 3. Open in Browser
Visit the app in your web browser:
👉 **[http://localhost:5175](http://localhost:5175)**
