# RememberLi


I’ve tried many note-taking apps over the years, but one thing always frustrated me. Finding the important information was harder than it should be. The search just wasn’t good enough.

So I built RememberLi. Instead of adding more and more features, I focused on simplicity. A simple UI, a simple markup language and a **powerful search engine**.


![RemeberLI Preview](https://github.com/KlausSchaefers/rememberli/blob/main/img/Preview2.png)


# Download

[Download the latest release](https://github.com/KlausSchaefers/rememberli/releases/latest)

| Platform | Format | Link |
|----------|--------|------|
| macOS (Apple Silicon) | DMG | [Download .dmg](https://github.com/KlausSchaefers/rememberli/releases/latest/download/Rememberli_2.0.0_aarch64.dmg) |
| Linux | Debian | [Download .deb](https://github.com/KlausSchaefers/rememberli/releases/latest/download/Rememberli_2.0.0_amd64.deb) |
| Linux | AppImage | [Download .AppImage](https://github.com/KlausSchaefers/rememberli/releases/latest/download/Rememberli_2.0.0_amd64.AppImage) |
| Windows | MSI | [Download .msi](https://github.com/KlausSchaefers/rememberli/releases/latest/download/Rememberli_2.0.0_x64_en-US.msi) |
| Windows | Installer | [Download .exe](https://github.com/KlausSchaefers/rememberli/releases/latest/download/Rememberli_2.0.0_x64-setup.exe) |

> **macOS users:** Since RememberLi is not signed with an Apple Developer certificate, macOS will block the app on first launch. To allow it, go to **System Settings → Privacy & Security**, scroll down, and click **Open Anyway** next to the RememberLi message.




### Concept

The app is built around three main concepts:

1. A simple markup language that supports to highlight important elements in a note and help you to find the right notes.
2. A powerful search engine that allows you to find and filter all your notes. It support *magic* commands like ":due", ":todo" "#tag" or "@person" search with smart auto complete.
3. Notes are taken in a chronological order and this order is perserved, even when you filter the list of Notes with the search function.

In addition, you can also set reminders. When a note is due, it will be indicated with a red bar.

### Markup Language

RememberLi supports the following markups that make it easy for you to organize your notes:

1. @name: Create a @person markup
2. #tag: Create a and #tag markup
3. []: Create a open task checkbox 
4. [X]: Create on closed markup checkbox 
5. ->: Create an arrow
6. \`\`\` \`\`\` For code

![RemeberLI Preview](https://github.com/KlausSchaefers/rememberli/blob/main/img/Code.png)



# Installation




# Developer Setup

## Prerequisites

Before getting started, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Rust](https://rustup.rs/)
- Platform-specific dependencies for Tauri (see [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites))

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run tauri dev
```

This will start both the Vite development server for the frontend and launch the Tauri application.

## Building

To create a production build:

```bash
#mac os
npm run tauri build

# linux
docker build -f Dockerfile.linux -t rememberli-linux . && docker run --rm -v \\$(pwd)/linux-build:/output rememberli-linux cp -r /app/src-tauri/target/release/bundle /output
```

## Available Scripts

- `npm run dev` - Start Vite development server only
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally
- `npm run tauri dev` - Start Tauri development mode
- `npm run tauri build` - Build Tauri application for production

## Learn More

- [Tauri Documentation](https://tauri.app/)
- [Vue.js Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)

