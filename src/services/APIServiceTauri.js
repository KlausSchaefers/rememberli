import Logger from "../util/Logger";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { open as openShell } from "@tauri-apps/plugin-shell";

export default class APIServiceTauri {
  constructor() {
    this.cleanUp();
    this.init();
  }

  async init() {}

  onAppLoaded() {
    Logger.log(-2, "APIService.onAppLoaded()");
  }

  getElectronLog() {
    Logger.log(-2, "APIService.getElectronLog()");
  }

  async run(code) {
    // Open a new terminal
    //await invoke('open_shell');

    // Run a shell command
    const output = await invoke('run_shell_command', { command: code });
    console.log("Command output:", output);
  }

  onLogReply(data) {
    Logger.log(-2, "APIService.onLogReply()", data);
    console.table(data.log);
  }

  cleanUp() {}

  openLink(e) {
    Logger.log(-2, "APIService.openLink()", e);
    e.stopPropagation();
    e.preventDefault();
    if (e.target && e.target.href) {
      openShell(e.target.href);
    }
  }

  async save(file) {
    Logger.log(-2, "APIService.save()", file);

    try {
      let filePath = file.url;
      if (!file.url) {
        filePath = await save({
          filters: [
            {
              name: "RememberLi Files",
              extensions: ["rmli"],
            },
          ],
        });
        file.url = filePath;
      }

      if (filePath) {
        const result = await invoke("save_json_file", { filePath, data: file.content });
        console.log("File saved successfully:", result);
        this.onSaveReply({ success: true, filePath });
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  }

  onSaveReply(e) {
    Logger.log(2, "APIService.onSaveReply()", e);
    if (this.saveReplyCallback) {
      this.saveReplyCallback(e);
    }
  }

  onSave(callback) {
    this.saveReplyCallback = callback;
  }

  onLoadReply(e) {
    Logger.log(2, "APIService.onLoadReply()", e);
    if (this.loadReplyCallback) {
      this.loadReplyCallback(e);
    }
  }

  async load(filePath) {
    Logger.log(-2, "APIService.load()", filePath);

    try {
      if (filePath && typeof filePath === "string") {
        const data = await invoke("load_json_file", { filePath });
        console.log("File loaded successfully:", data);
        this.onSelectReply(data);
      }
    } catch (error) {
      console.error("Error loading file:", error);
    }
  }

  onLoad(callback) {
    this.loadReplyCallback = callback;
  }

  onSelectReply(e) {
    Logger.log(2, "APIService.onSelectReply()", e);
    if (this.selectReplyCallback) {
      this.selectReplyCallback(e);
    }
  }

  onSelect(callback) {
    this.selectReplyCallback = callback;
  }

  async select() {
    Logger.log(2, "APIService.select()");

    try {
      const filePath = await open({
        multiple: false,
        filters: [
          {
            name: "RememberLi Files",
            extensions: ["rmli"],
          },
        ],
      });

      if (filePath && typeof filePath === "string") {
        const data = await invoke("load_json_file", { filePath });
        console.log("File selected and loaded successfully:", data);
        this.onSelectReply(data);
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  }
}
