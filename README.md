# RememberLi

![RemeberLI Logo](https://github.com/KlausSchaefers/rememberli/blob/main/src/assets/Logo_Window_Circle_R_Triangle_Small.png)

 RememberLi is a simple note-taking app, that is focussed on finding and remembering the important things in your life.

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
```

This will create platform-specific bundles in `src-tauri/target/release/bundle/`.

## Project Structure

```
rememberli2/
├── src/                    # Vue.js frontend source
│   ├── App.vue            # Main Vue component
│   ├── main.ts            # Vue app entry point
│   └── styles.css         # Global styles
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/
│   │   └── main.rs        # Rust main file with Tauri commands
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── public/                # Static assets
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
└── package.json           # Node.js dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start Vite development server only
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally
- `npm run tauri dev` - Start Tauri development mode
- `npm run tauri build` - Build Tauri application for production

## Features

- **Vue 3** with Composition API and `<script setup>` syntax
- **TypeScript** for type safety
- **Tauri** for cross-platform desktop functionality
- **Vite** for fast development and building
- **Hot Module Replacement** during development
- Example Rust command integration between frontend and backend

## Learn More

- [Tauri Documentation](https://tauri.app/)
- [Vue.js Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)

