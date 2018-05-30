const {
    app,
    Menu,
    nativeImage,
    Tray,
    ipcMain
} = require('electron');
const path = require('path');

class AppTrayController {
    constructor(mainController) {
        this.mainController = mainController
        this.unreadType = 'none'
        this.platform = require('os').platform()
        this.init()
    }

    init() {
        this.tray = new Tray(this.createTrayIcon())
        this.tray.setToolTip('Wechat Desktop')

        const context = Menu.buildFromTemplate([{
            label: '退出',
            click: () => this.cleanupAndExit()
        }])

        this.tray.setContextMenu(context)

        this.tray.on('click', () => this.clickEvent())

        ipcMain.on('updateUnread', (event, value) => {
            value !== this.unreadType && this.tray.setImage(this.getUnreadImage(value))
        })
    }

    clickEvent() {
        this.mainController.toggle()
    }

    createTrayIcon() {
        switch (this.platform) {
            case 'darwin':
                return nativeImage.createFromPath(path.join(__dirname, '../../assets/icon.png'))
            case 'win32':
                return nativeImage.createFromPath(path.join(__dirname, '../../assets/icon@2x.png'))
            default:
                return nativeImage.createFromPath(path.join(__dirname, '../../assets/icon@2x.png'))
        }
    }

    getUnreadImage(value) {
        this.unreadType = value
        switch (value) {
            case 'important':
                return 'darwin' === this.platform ?
                    nativeImage.createFromPath(path.join(__dirname, '../../assets/iconImportant.png')) :
                    nativeImage.createFromPath(path.join(__dirname, '../../assets/iconImportant@2x.png'))
            case 'minor':
                return 'darwin' === this.platform ?
                    nativeImage.createFromPath(path.join(__dirname, '../../assets/iconUnread.png')) :
                    nativeImage.createFromPath(path.join(__dirname, '../../assets/iconUnread@2x.png'))
            default:
                return 'darwin' === this.platform ?
                    nativeImage.createFromPath(path.join(__dirname, '../../assets/icon.png')) :
                    nativeImage.createFromPath(path.join(__dirname, '../../assets/icon@2x.png'))
        }
    }

    cleanupAndExit() {
        app.exit(0);

    }
}

module.exports = AppTrayController