"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createExec: function() {
        return createExec;
    },
    createGetExecValue: function() {
        return createGetExecValue;
    }
});
const _child_process = require("child_process");
const _terminalcolors = require("./terminal-colors");
const createGetExecValue = ({ isVerbose })=>(cmd, label)=>{
        if (isVerbose) {
            let msg = '> ';
            if (label) {
                msg += `${_terminalcolors.TERMINAL_COLORS.grey}# ${label}${_terminalcolors.TERMINAL_COLORS.reset}`;
                msg += '\n  ';
            }
            msg += `${_terminalcolors.TERMINAL_COLORS.green}${cmd}${_terminalcolors.TERMINAL_COLORS.reset}`;
            console.log(msg);
        }
        const value = (0, _child_process.execSync)(cmd).toString().trim();
        if (isVerbose) {
            const msg = `= ${_terminalcolors.TERMINAL_COLORS.cyan}${value}${_terminalcolors.TERMINAL_COLORS.reset}`;
            console.log(msg);
        }
        return value;
    };
const createExec = ({ isVerbose })=>(cmd, label)=>{
        if (isVerbose) {
            let msg = '> ';
            if (label) {
                msg += `${_terminalcolors.TERMINAL_COLORS.grey}# ${label}${_terminalcolors.TERMINAL_COLORS.reset}`;
                msg += '\n  ';
            }
            msg += `${_terminalcolors.TERMINAL_COLORS.green}${cmd}${_terminalcolors.TERMINAL_COLORS.reset}`;
            console.log(msg);
        }
        const output = (0, _child_process.execSync)(cmd);
        if (isVerbose) {
            console.log(output.toString());
        }
    };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NjcmlwdHMvc3VicmVwby9zcmMvbGliL2V4ZWMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcclxuXHJcbmltcG9ydCB7IFRFUk1JTkFMX0NPTE9SUyBhcyB0YyB9IGZyb20gJy4vdGVybWluYWwtY29sb3JzJztcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVHZXRFeGVjVmFsdWUgPVxyXG4gICAgKHsgaXNWZXJib3NlIH06IHsgaXNWZXJib3NlPzogYm9vbGVhbiB9KSA9PlxyXG4gICAgKGNtZDogc3RyaW5nLCBsYWJlbD86IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGlmIChpc1ZlcmJvc2UpIHtcclxuICAgICAgICAgICAgbGV0IG1zZyA9ICc+ICc7XHJcbiAgICAgICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgbXNnICs9IGAke3RjLmdyZXl9IyAke2xhYmVsfSR7dGMucmVzZXR9YDtcclxuICAgICAgICAgICAgICAgIG1zZyArPSAnXFxuICAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1zZyArPSBgJHt0Yy5ncmVlbn0ke2NtZH0ke3RjLnJlc2V0fWA7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBleGVjU3luYyhjbWQpLnRvU3RyaW5nKCkudHJpbSgpO1xyXG5cclxuICAgICAgICBpZiAoaXNWZXJib3NlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IGA9ICR7dGMuY3lhbn0ke3ZhbHVlfSR7dGMucmVzZXR9YDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH07XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlRXhlYyA9XHJcbiAgICAoeyBpc1ZlcmJvc2UgfTogeyBpc1ZlcmJvc2U/OiBib29sZWFuIH0pID0+XHJcbiAgICAoY21kOiBzdHJpbmcsIGxhYmVsPzogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgaWYgKGlzVmVyYm9zZSkge1xyXG4gICAgICAgICAgICBsZXQgbXNnID0gJz4gJztcclxuICAgICAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICBtc2cgKz0gYCR7dGMuZ3JleX0jICR7bGFiZWx9JHt0Yy5yZXNldH1gO1xyXG4gICAgICAgICAgICAgICAgbXNnICs9ICdcXG4gICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNnICs9IGAke3RjLmdyZWVufSR7Y21kfSR7dGMucmVzZXR9YDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IGV4ZWNTeW5jKGNtZCk7XHJcblxyXG4gICAgICAgIGlmIChpc1ZlcmJvc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cob3V0cHV0LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVFeGVjIiwiY3JlYXRlR2V0RXhlY1ZhbHVlIiwiaXNWZXJib3NlIiwiY21kIiwibGFiZWwiLCJtc2ciLCJ0YyIsImdyZXkiLCJyZXNldCIsImdyZWVuIiwiY29uc29sZSIsImxvZyIsInZhbHVlIiwiZXhlY1N5bmMiLCJ0b1N0cmluZyIsInRyaW0iLCJjeWFuIiwib3V0cHV0Il0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUE0QmFBLFVBQVU7ZUFBVkE7O0lBeEJBQyxrQkFBa0I7ZUFBbEJBOzs7K0JBSlk7Z0NBRWE7QUFFL0IsTUFBTUEscUJBQ1QsQ0FBQyxFQUFFQyxTQUFTLEVBQTJCLEdBQ3ZDLENBQUNDLEtBQWFDO1FBQ1YsSUFBSUYsV0FBVztZQUNYLElBQUlHLE1BQU07WUFDVixJQUFJRCxPQUFPO2dCQUNQQyxPQUFPLENBQUMsRUFBRUMsK0JBQUUsQ0FBQ0MsSUFBSSxDQUFDLEVBQUUsRUFBRUgsTUFBTSxFQUFFRSwrQkFBRSxDQUFDRSxLQUFLLENBQUMsQ0FBQztnQkFDeENILE9BQU87WUFDWDtZQUNBQSxPQUFPLENBQUMsRUFBRUMsK0JBQUUsQ0FBQ0csS0FBSyxDQUFDLEVBQUVOLElBQUksRUFBRUcsK0JBQUUsQ0FBQ0UsS0FBSyxDQUFDLENBQUM7WUFFckNFLFFBQVFDLEdBQUcsQ0FBQ047UUFDaEI7UUFFQSxNQUFNTyxRQUFRQyxJQUFBQSx1QkFBUSxFQUFDVixLQUFLVyxRQUFRLEdBQUdDLElBQUk7UUFFM0MsSUFBSWIsV0FBVztZQUNYLE1BQU1HLE1BQU0sQ0FBQyxFQUFFLEVBQUVDLCtCQUFFLENBQUNVLElBQUksQ0FBQyxFQUFFSixNQUFNLEVBQUVOLCtCQUFFLENBQUNFLEtBQUssQ0FBQyxDQUFDO1lBQzdDRSxRQUFRQyxHQUFHLENBQUNOO1FBQ2hCO1FBRUEsT0FBT087SUFDWDtBQUVHLE1BQU1aLGFBQ1QsQ0FBQyxFQUFFRSxTQUFTLEVBQTJCLEdBQ3ZDLENBQUNDLEtBQWFDO1FBQ1YsSUFBSUYsV0FBVztZQUNYLElBQUlHLE1BQU07WUFDVixJQUFJRCxPQUFPO2dCQUNQQyxPQUFPLENBQUMsRUFBRUMsK0JBQUUsQ0FBQ0MsSUFBSSxDQUFDLEVBQUUsRUFBRUgsTUFBTSxFQUFFRSwrQkFBRSxDQUFDRSxLQUFLLENBQUMsQ0FBQztnQkFDeENILE9BQU87WUFDWDtZQUNBQSxPQUFPLENBQUMsRUFBRUMsK0JBQUUsQ0FBQ0csS0FBSyxDQUFDLEVBQUVOLElBQUksRUFBRUcsK0JBQUUsQ0FBQ0UsS0FBSyxDQUFDLENBQUM7WUFFckNFLFFBQVFDLEdBQUcsQ0FBQ047UUFDaEI7UUFDQSxNQUFNWSxTQUFTSixJQUFBQSx1QkFBUSxFQUFDVjtRQUV4QixJQUFJRCxXQUFXO1lBQ1hRLFFBQVFDLEdBQUcsQ0FBQ00sT0FBT0gsUUFBUTtRQUMvQjtJQUNKIn0=