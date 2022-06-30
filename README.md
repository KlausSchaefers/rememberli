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
Windows [Download](https://github.com/KlausSchaefers/rememberli/releases/download/v1.0.17/RememberLi-Setup-1.0.17.exe)

Mac [Download](https://github.com/KlausSchaefers/rememberli/releases/download/v1.0.17/RememberLi-1.0.17.dmg)

Linux - Snapp [Download](https://github.com/KlausSchaefers/rememberli/releases/download/v1.0.13/RememberLi_1.0.13_amd64.snap)

Linux - AppImage [Download](https://github.com/KlausSchaefers/rememberli/releases/download/v1.0.13/RememberLi-1.0.13.AppImage)

Linux - Deb [Download](https://github.com/KlausSchaefers/rememberli/releases/download/v1.0.15/RememberLi_1.0.15_amd64.deb)

## Mac Install 

On MacOs you might get a warning that the author is unkown and you cannot start the application. This happens becasue I didn't sign the app (cost me 99$)

![Mac os error](https://github.com/KlausSchaefers/rememberli/blob/main/src/assets/MacError1.png)

To still open the app, perform the following steps:

- Open "System Preferences" and go to "Security & Privacy"

![Mac os error](https://github.com/KlausSchaefers/rememberli/blob/main/src/assets/MacError2.png)

- In the "Allow apps downloaded from..." enable Rememberli by clicking "Open Anyway"

![Mac os error](https://github.com/KlausSchaefers/rememberli/blob/main/src/assets/MacError3.png)

- In following dialog click on "Open"

![Mac os error](https://github.com/KlausSchaefers/rememberli/blob/main/src/assets/MacError4.png)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve 
```

### Compiles and minifies for production

Make sure github access token is set

```
export GH_TOKEN=<your token>
```

```
npm run electron:build -- --win --linux --mac -p always
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
