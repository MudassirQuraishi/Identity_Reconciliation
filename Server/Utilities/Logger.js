const fs = require("fs");
const path = require("path");
class Logger {
    static logFolder = path.join(__dirname, "../Logs");
    static logPath = path.join(this.logFolder, "app.log");
    static maxFileSize = 1024 * 1024;
    static logToFile({ message, type }) {
        if (!fs.existsSync(this.logFolder)) fs.mkdirSync(this.logFolder);

        const timeStamp = new Date().toISOString();
        const formattedString = `[Time:${timeStamp}][Log-Type:${type}] [Message :${message}]\n`;

        fs.appendFile(this.logPath, formattedString, (err) => {
            if (err) {
                console.error("Error Writing to log file");
            }
        });
        const { size } = fs.statSync(this.logPath);

        if (size > this.maxFileSize) {
            this.rotateLogFile();
        }
    }
    static rotateLogFile() {
        const oldLogPath = this.logPath.replace(
            ".log",
            `_old_${Date.now()}.log`
        );
        fs.renameSync(this.logPath, oldLogPath);
    }
    static info(message) {
        this.logToFile({ message: message, type: "Info" });
    }
    static warn(message) {
        this.logToFile({ message: message, type: "Warning" });
    }
    static error(message) {
        this.logToFile({ message: message, type: "Error" });
    }
    static log(message) {
        this.logToFile({ message: message, type: "Log" });
    }
}
module.exports = Logger;
