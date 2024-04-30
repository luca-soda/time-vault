import { app, Menu, shell, BrowserWindow, MenuItemConstructorOptions } from "electron";

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
    selector?: string;
    submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
    mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    buildMenu(): Menu {
        if (process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true") {
            this.setupDevelopmentEnvironment();
        }

        const template = process.platform === "darwin" ? this.buildDarwinTemplate() : this.buildDefaultTemplate();

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        return menu;
    }

    setupDevelopmentEnvironment(): void {
        this.mainWindow.webContents.on("context-menu", (_, props) => {
            const { x, y } = props;

            Menu.buildFromTemplate([
                {
                    label: "Inspect element",
                    click: () => {
                        this.mainWindow.webContents.inspectElement(x, y);
                    },
                },
            ]).popup({ window: this.mainWindow });
        });
    }

    buildDarwinTemplate(): MenuItemConstructorOptions[] {
        const subMenuAbout: DarwinMenuItemConstructorOptions = {
            label: "Time Vault",
        };
        const subMenuEdit: DarwinMenuItemConstructorOptions = {
            label: "Edit",
        };
        const subMenuViewDev: MenuItemConstructorOptions = {
            label: "View",
        };
        const subMenuViewProd: MenuItemConstructorOptions = {
            label: "View",
        };
        const subMenuWindow: DarwinMenuItemConstructorOptions = {
            label: "Window",
        };
        const subMenuHelp: MenuItemConstructorOptions = {
            label: "Help",
        };

        const subMenuView = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true" ? subMenuViewDev : subMenuViewProd;

        return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
    }

    buildDefaultTemplate() {
        const templateDefault = [
            {
                label: "&File",
                submenu: [
                    {
                        label: "&Open",
                        accelerator: "Ctrl+O",
                    },
                    {
                        label: "&Close",
                        accelerator: "Ctrl+W",
                        click: () => {
                            this.mainWindow.close();
                        },
                    },
                ],
            },
            {
                label: "&View",
                submenu:
                    process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true"
                        ? [
                              {
                                  label: "&Reload",
                                  accelerator: "Ctrl+R",
                                  click: () => {
                                      this.mainWindow.webContents.reload();
                                  },
                              },
                              {
                                  label: "Toggle &Full Screen",
                                  accelerator: "F11",
                                  click: () => {
                                      this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                                  },
                              },
                              {
                                  label: "Toggle &Developer Tools",
                                  accelerator: "Alt+Ctrl+I",
                                  click: () => {
                                      this.mainWindow.webContents.toggleDevTools();
                                  },
                              },
                          ]
                        : [
                              {
                                  label: "Toggle &Full Screen",
                                  accelerator: "F11",
                                  click: () => {
                                      this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                                  },
                              },
                          ],
            },
            {
                label: "Help",
                submenu: [
                    {
                        label: "Learn More",
                        click() {
                            shell.openExternal("https://electronjs.org");
                        },
                    },
                    {
                        label: "Documentation",
                        click() {
                            shell.openExternal("https://github.com/electron/electron/tree/main/docs#readme");
                        },
                    },
                    {
                        label: "Community Discussions",
                        click() {
                            shell.openExternal("https://www.electronjs.org/community");
                        },
                    },
                    {
                        label: "Search Issues",
                        click() {
                            shell.openExternal("https://github.com/electron/electron/issues");
                        },
                    },
                ],
            },
        ];

        return templateDefault;
    }
}
