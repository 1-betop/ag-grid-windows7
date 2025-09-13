"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _fs = require("fs");
const _prompts = /*#__PURE__*/ _interop_require_default._(require("prompts"));
const _helpers = require("yargs/helpers");
const _yargs = /*#__PURE__*/ _interop_require_default._(require("yargs/yargs"));
const _runSubRepoCommand = require("./lib/runSubRepoCommand");
const _terminalcolors = require("./lib/terminal-colors");
const SUBREPO_FOLDER = 'external';
const subRepos = (0, _fs.readdirSync)(SUBREPO_FOLDER, {
    withFileTypes: true
}).filter((entry)=>entry.isDirectory()).map((directory)=>directory.name);
const runCommand = ({ command, subRepoFolder, isVerbose })=>{
    try {
        (0, _runSubRepoCommand.runSubRepoCommand)({
            command,
            subRepoFolder,
            isVerbose
        });
    } catch (error) {
        if (error.stdout) {
            const output = error.stdout.toString() || error.message;
            const msg = `ERROR:\n${_terminalcolors.TERMINAL_COLORS.red}${output}${_terminalcolors.TERMINAL_COLORS.reset}`;
            console.error(msg);
        } else {
            console.error(error);
        }
    }
};
const getPromptSubrepo = async ({ command })=>{
    const { promptSubrepo } = await (0, _prompts.default)({
        type: 'select',
        name: 'promptSubrepo',
        message: `Which subrepo do you want to run "${command}" on?`,
        choices: [
            {
                title: '- Cancel -',
                value: false
            }
        ].concat(subRepos.map((repo)=>{
            return {
                title: repo,
                value: repo
            };
        }))
    });
    return promptSubrepo;
};
(0, _yargs.default)((0, _helpers.hideBin)(process.argv)).usage('Usage: <command> [options]').command('$0 <command>', 'Wrapper for `git subrepo` commands', (yargs)=>{
    return yargs.positional('command', {
        describe: 'Git subrepo command\n\n' + 'push: git subrepo push\n' + 'pull: git subrepo pull\n' + 'check: Check whether .gitrepo is in a valid state\n',
        choices: [
            'push',
            'pull',
            'check'
        ]
    });
}, async (argv)=>{
    const { subrepo: subrepoArg, command, verbose } = argv;
    let subrepo = subrepoArg;
    if (!subrepo) {
        const promptSubrepo = await getPromptSubrepo({
            command: command
        });
        if (!promptSubrepo) {
            return;
        }
        subrepo = promptSubrepo;
    }
    runCommand({
        command: command,
        subRepoFolder: `${SUBREPO_FOLDER}/${subrepo}`,
        isVerbose: Boolean(verbose)
    });
}).option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
}).option('subrepo', {
    alias: 's',
    choices: subRepos,
    description: 'Subrepo to run the command on'
}).help().parse();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NjcmlwdHMvc3VicmVwby9zcmMvY2xpLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlYWRkaXJTeW5jIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgcHJvbXB0cyBmcm9tICdwcm9tcHRzJztcclxuaW1wb3J0IHsgaGlkZUJpbiB9IGZyb20gJ3lhcmdzL2hlbHBlcnMnO1xyXG5pbXBvcnQgeWFyZ3MgZnJvbSAneWFyZ3MveWFyZ3MnO1xyXG5cclxuaW1wb3J0IHsgcnVuU3ViUmVwb0NvbW1hbmQgfSBmcm9tICcuL2xpYi9ydW5TdWJSZXBvQ29tbWFuZCc7XHJcbmltcG9ydCB0eXBlIHsgQ29tbWFuZCwgU3VicmVwb0NvbW1hbmRQYXJhbXMgfSBmcm9tICcuL2xpYi9ydW5TdWJSZXBvQ29tbWFuZCc7XHJcbmltcG9ydCB7IFRFUk1JTkFMX0NPTE9SUyBhcyB0YyB9IGZyb20gJy4vbGliL3Rlcm1pbmFsLWNvbG9ycyc7XHJcblxyXG5jb25zdCBTVUJSRVBPX0ZPTERFUiA9ICdleHRlcm5hbCc7XHJcbmNvbnN0IHN1YlJlcG9zID0gcmVhZGRpclN5bmMoU1VCUkVQT19GT0xERVIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KVxyXG4gICAgLmZpbHRlcigoZW50cnk6IGFueSkgPT4gZW50cnkuaXNEaXJlY3RvcnkoKSlcclxuICAgIC5tYXAoKGRpcmVjdG9yeTogYW55KSA9PiBkaXJlY3RvcnkubmFtZSk7XHJcblxyXG5jb25zdCBydW5Db21tYW5kID0gKHsgY29tbWFuZCwgc3ViUmVwb0ZvbGRlciwgaXNWZXJib3NlIH06IFN1YnJlcG9Db21tYW5kUGFyYW1zKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJ1blN1YlJlcG9Db21tYW5kKHsgY29tbWFuZCwgc3ViUmVwb0ZvbGRlciwgaXNWZXJib3NlIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICAgIGlmIChlcnJvci5zdGRvdXQpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gZXJyb3Iuc3Rkb3V0LnRvU3RyaW5nKCkgfHwgZXJyb3IubWVzc2FnZTtcclxuICAgICAgICAgICAgY29uc3QgbXNnID0gYEVSUk9SOlxcbiR7dGMucmVkfSR7b3V0cHV0fSR7dGMucmVzZXR9YDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGdldFByb21wdFN1YnJlcG8gPSBhc3luYyAoeyBjb21tYW5kIH06IHsgY29tbWFuZDogc3RyaW5nIH0pID0+IHtcclxuICAgIGNvbnN0IHsgcHJvbXB0U3VicmVwbyB9ID0gYXdhaXQgcHJvbXB0cyh7XHJcbiAgICAgICAgdHlwZTogJ3NlbGVjdCcsXHJcbiAgICAgICAgbmFtZTogJ3Byb21wdFN1YnJlcG8nLFxyXG4gICAgICAgIG1lc3NhZ2U6IGBXaGljaCBzdWJyZXBvIGRvIHlvdSB3YW50IHRvIHJ1biBcIiR7Y29tbWFuZH1cIiBvbj9gLFxyXG4gICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICctIENhbmNlbCAtJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgc3ViUmVwb3MubWFwKChyZXBvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiByZXBvLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXBvLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHByb21wdFN1YnJlcG87XHJcbn07XHJcblxyXG55YXJncyhoaWRlQmluKHByb2Nlc3MuYXJndikpXHJcbiAgICAudXNhZ2UoJ1VzYWdlOiA8Y29tbWFuZD4gW29wdGlvbnNdJylcclxuICAgIC5jb21tYW5kKFxyXG4gICAgICAgICckMCA8Y29tbWFuZD4nLFxyXG4gICAgICAgICdXcmFwcGVyIGZvciBgZ2l0IHN1YnJlcG9gIGNvbW1hbmRzJyxcclxuICAgICAgICAoeWFyZ3MpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHlhcmdzLnBvc2l0aW9uYWwoJ2NvbW1hbmQnLCB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmliZTpcclxuICAgICAgICAgICAgICAgICAgICAnR2l0IHN1YnJlcG8gY29tbWFuZFxcblxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICdwdXNoOiBnaXQgc3VicmVwbyBwdXNoXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgJ3B1bGw6IGdpdCBzdWJyZXBvIHB1bGxcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAnY2hlY2s6IENoZWNrIHdoZXRoZXIgLmdpdHJlcG8gaXMgaW4gYSB2YWxpZCBzdGF0ZVxcbicsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbJ3B1c2gnLCAncHVsbCcsICdjaGVjayddLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFzeW5jIChhcmd2KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgc3VicmVwbzogc3VicmVwb0FyZywgY29tbWFuZCwgdmVyYm9zZSB9ID0gYXJndjtcclxuICAgICAgICAgICAgbGV0IHN1YnJlcG8gPSBzdWJyZXBvQXJnO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzdWJyZXBvKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9tcHRTdWJyZXBvID0gYXdhaXQgZ2V0UHJvbXB0U3VicmVwbyh7IGNvbW1hbmQ6IGNvbW1hbmQhIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9tcHRTdWJyZXBvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHN1YnJlcG8gPSBwcm9tcHRTdWJyZXBvO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBydW5Db21tYW5kKHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmQgYXMgQ29tbWFuZCxcclxuICAgICAgICAgICAgICAgIHN1YlJlcG9Gb2xkZXI6IGAke1NVQlJFUE9fRk9MREVSfS8ke3N1YnJlcG99YCxcclxuICAgICAgICAgICAgICAgIGlzVmVyYm9zZTogQm9vbGVhbih2ZXJib3NlKSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgKVxyXG4gICAgLm9wdGlvbigndmVyYm9zZScsIHtcclxuICAgICAgICBhbGlhczogJ3YnLFxyXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ1J1biB3aXRoIHZlcmJvc2UgbG9nZ2luZycsXHJcbiAgICB9KVxyXG4gICAgLm9wdGlvbignc3VicmVwbycsIHtcclxuICAgICAgICBhbGlhczogJ3MnLFxyXG4gICAgICAgIGNob2ljZXM6IHN1YlJlcG9zLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU3VicmVwbyB0byBydW4gdGhlIGNvbW1hbmQgb24nLFxyXG4gICAgfSlcclxuICAgIC5oZWxwKClcclxuICAgIC5wYXJzZSgpO1xyXG4iXSwibmFtZXMiOlsiU1VCUkVQT19GT0xERVIiLCJzdWJSZXBvcyIsInJlYWRkaXJTeW5jIiwid2l0aEZpbGVUeXBlcyIsImZpbHRlciIsImVudHJ5IiwiaXNEaXJlY3RvcnkiLCJtYXAiLCJkaXJlY3RvcnkiLCJuYW1lIiwicnVuQ29tbWFuZCIsImNvbW1hbmQiLCJzdWJSZXBvRm9sZGVyIiwiaXNWZXJib3NlIiwicnVuU3ViUmVwb0NvbW1hbmQiLCJlcnJvciIsInN0ZG91dCIsIm91dHB1dCIsInRvU3RyaW5nIiwibWVzc2FnZSIsIm1zZyIsInRjIiwicmVkIiwicmVzZXQiLCJjb25zb2xlIiwiZ2V0UHJvbXB0U3VicmVwbyIsInByb21wdFN1YnJlcG8iLCJwcm9tcHRzIiwidHlwZSIsImNob2ljZXMiLCJ0aXRsZSIsInZhbHVlIiwiY29uY2F0IiwicmVwbyIsInlhcmdzIiwiaGlkZUJpbiIsInByb2Nlc3MiLCJhcmd2IiwidXNhZ2UiLCJwb3NpdGlvbmFsIiwiZGVzY3JpYmUiLCJzdWJyZXBvIiwic3VicmVwb0FyZyIsInZlcmJvc2UiLCJCb29sZWFuIiwib3B0aW9uIiwiYWxpYXMiLCJkZXNjcmlwdGlvbiIsImhlbHAiLCJwYXJzZSJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OztvQkFBNEI7a0VBQ1I7eUJBQ0k7Z0VBQ047bUNBRWdCO2dDQUVJO0FBRXRDLE1BQU1BLGlCQUFpQjtBQUN2QixNQUFNQyxXQUFXQyxJQUFBQSxlQUFXLEVBQUNGLGdCQUFnQjtJQUFFRyxlQUFlO0FBQUssR0FDOURDLE1BQU0sQ0FBQyxDQUFDQyxRQUFlQSxNQUFNQyxXQUFXLElBQ3hDQyxHQUFHLENBQUMsQ0FBQ0MsWUFBbUJBLFVBQVVDLElBQUk7QUFFM0MsTUFBTUMsYUFBYSxDQUFDLEVBQUVDLE9BQU8sRUFBRUMsYUFBYSxFQUFFQyxTQUFTLEVBQXdCO0lBQzNFLElBQUk7UUFDQUMsSUFBQUEsb0NBQWlCLEVBQUM7WUFBRUg7WUFBU0M7WUFBZUM7UUFBVTtJQUMxRCxFQUFFLE9BQU9FLE9BQVk7UUFDakIsSUFBSUEsTUFBTUMsTUFBTSxFQUFFO1lBQ2QsTUFBTUMsU0FBU0YsTUFBTUMsTUFBTSxDQUFDRSxRQUFRLE1BQU1ILE1BQU1JLE9BQU87WUFDdkQsTUFBTUMsTUFBTSxDQUFDLFFBQVEsRUFBRUMsK0JBQUUsQ0FBQ0MsR0FBRyxDQUFDLEVBQUVMLE9BQU8sRUFBRUksK0JBQUUsQ0FBQ0UsS0FBSyxDQUFDLENBQUM7WUFDbkRDLFFBQVFULEtBQUssQ0FBQ0s7UUFDbEIsT0FBTztZQUNISSxRQUFRVCxLQUFLLENBQUNBO1FBQ2xCO0lBQ0o7QUFDSjtBQUVBLE1BQU1VLG1CQUFtQixPQUFPLEVBQUVkLE9BQU8sRUFBdUI7SUFDNUQsTUFBTSxFQUFFZSxhQUFhLEVBQUUsR0FBRyxNQUFNQyxJQUFBQSxnQkFBTyxFQUFDO1FBQ3BDQyxNQUFNO1FBQ05uQixNQUFNO1FBQ05VLFNBQVMsQ0FBQyxrQ0FBa0MsRUFBRVIsUUFBUSxLQUFLLENBQUM7UUFDNURrQixTQUFTO1lBQ0w7Z0JBQ0lDLE9BQU87Z0JBQ1BDLE9BQU87WUFDWDtTQUNILENBQUNDLE1BQU0sQ0FDSi9CLFNBQVNNLEdBQUcsQ0FBQyxDQUFDMEI7WUFDVixPQUFPO2dCQUNISCxPQUFPRztnQkFDUEYsT0FBT0U7WUFDWDtRQUNKO0lBRVI7SUFFQSxPQUFPUDtBQUNYO0FBRUFRLElBQUFBLGNBQUssRUFBQ0MsSUFBQUEsZ0JBQU8sRUFBQ0MsUUFBUUMsSUFBSSxHQUNyQkMsS0FBSyxDQUFDLDhCQUNOM0IsT0FBTyxDQUNKLGdCQUNBLHNDQUNBLENBQUN1QjtJQUNHLE9BQU9BLE1BQU1LLFVBQVUsQ0FBQyxXQUFXO1FBQy9CQyxVQUNJLDRCQUNBLDZCQUNBLDZCQUNBO1FBQ0pYLFNBQVM7WUFBQztZQUFRO1lBQVE7U0FBUTtJQUN0QztBQUNKLEdBQ0EsT0FBT1E7SUFDSCxNQUFNLEVBQUVJLFNBQVNDLFVBQVUsRUFBRS9CLE9BQU8sRUFBRWdDLE9BQU8sRUFBRSxHQUFHTjtJQUNsRCxJQUFJSSxVQUFVQztJQUVkLElBQUksQ0FBQ0QsU0FBUztRQUNWLE1BQU1mLGdCQUFnQixNQUFNRCxpQkFBaUI7WUFBRWQsU0FBU0E7UUFBUztRQUNqRSxJQUFJLENBQUNlLGVBQWU7WUFDaEI7UUFDSjtRQUVBZSxVQUFVZjtJQUNkO0lBRUFoQixXQUFXO1FBQ1BDLFNBQVNBO1FBQ1RDLGVBQWUsQ0FBQyxFQUFFWixlQUFlLENBQUMsRUFBRXlDLFFBQVEsQ0FBQztRQUM3QzVCLFdBQVcrQixRQUFRRDtJQUN2QjtBQUNKLEdBRUhFLE1BQU0sQ0FBQyxXQUFXO0lBQ2ZDLE9BQU87SUFDUGxCLE1BQU07SUFDTm1CLGFBQWE7QUFDakIsR0FDQ0YsTUFBTSxDQUFDLFdBQVc7SUFDZkMsT0FBTztJQUNQakIsU0FBUzVCO0lBQ1Q4QyxhQUFhO0FBQ2pCLEdBQ0NDLElBQUksR0FDSkMsS0FBSyJ9