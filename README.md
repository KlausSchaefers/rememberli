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

## Download
Windows [Download](https://github.com/KlausSchaefers/rememberli/releases/download/Version1.0.3/RememberLi.Setup.1.0.3.exe)

Mac [Download](https://github.com/KlausSchaefers/rememberli/releases/download/Version1.0.3/RememberLi-1.0.3.dmg)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve 
```

### Compiles and minifies for production
```
npm run electron:build -- --win --linux --mac
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## Mention
The logo background is based on the work https://pxhere.com/en/photo/1624621
