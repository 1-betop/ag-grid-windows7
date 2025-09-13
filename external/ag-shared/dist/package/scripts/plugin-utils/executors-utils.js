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
    batchExecutor: function() {
        return batchExecutor;
    },
    batchWorkerExecutor: function() {
        return batchWorkerExecutor;
    },
    consolePrefix: function() {
        return consolePrefix;
    },
    deleteFile: function() {
        return deleteFile;
    },
    ensureDirectory: function() {
        return ensureDirectory;
    },
    exists: function() {
        return exists;
    },
    gitCurrentBranch: function() {
        return gitCurrentBranch;
    },
    gitFiles: function() {
        return gitFiles;
    },
    gitShow: function() {
        return gitShow;
    },
    inputGlob: function() {
        return inputGlob;
    },
    parseFile: function() {
        return parseFile;
    },
    parseFileContents: function() {
        return parseFileContents;
    },
    readFile: function() {
        return readFile;
    },
    readGitFiles: function() {
        return readGitFiles;
    },
    readJSONFile: function() {
        return readJSONFile;
    },
    writeFile: function() {
        return writeFile;
    },
    writeJSONFile: function() {
        return writeJSONFile;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _child_process = require("child_process");
const _fs = require("fs");
const _promises = /*#__PURE__*/ _interop_require_wildcard._(require("fs/promises"));
const _glob = /*#__PURE__*/ _interop_require_wildcard._(require("glob"));
const _os = /*#__PURE__*/ _interop_require_wildcard._(require("os"));
const _path = /*#__PURE__*/ _interop_require_wildcard._(require("path"));
const _typescript = /*#__PURE__*/ _interop_require_wildcard._(require("typescript"));
async function exists(filePath) {
    try {
        return (await _promises.stat(filePath))?.isFile();
    } catch  {
        return false;
    }
}
async function readJSONFile(filePath) {
    return await exists(filePath) ? JSON.parse(await _promises.readFile(filePath, 'utf-8')) : null;
}
async function readFile(filePath) {
    return await exists(filePath) ? await _promises.readFile(filePath, 'utf-8') : null;
}
async function writeJSONFile(filePath, data, indent = 2) {
    const dataContent = JSON.stringify(data, null, indent);
    await writeFile(filePath, dataContent);
}
async function writeFile(filePath, newContent) {
    const outputDir = _path.dirname(filePath);
    await _promises.mkdir(outputDir, {
        recursive: true
    });
    await _promises.writeFile(filePath, newContent);
}
async function deleteFile(filePath) {
    if (await exists(filePath)) {
        await _promises.rm(filePath);
    }
}
function parseFileContents(contents) {
    return _typescript.createSourceFile('tempFile.ts', contents, _typescript.ScriptTarget.Latest, true);
}
function parseFile(filePath) {
    return parseFileContents((0, _fs.readFileSync)(filePath, 'utf8'));
}
function inputGlob(fullPath) {
    return _glob.sync(`${fullPath}/**/*.ts`, {
        ignore: [
            `${fullPath}/**/*.test.ts`,
            `${fullPath}/**/*.spec.ts`
        ]
    });
}
function gitCurrentBranch() {
    return (0, _child_process.execSync)('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf-8'
    }).trim();
}
function gitFiles(fullPath, commit) {
    return (0, _child_process.execSync)([
        `git ls-tree -r --name-only ${commit}`,
        `grep -E '^${fullPath}/[^:]*\\.ts$'`,
        `grep -vE '\\.(test|spec)\\.ts$'`
    ].join(' | '), {
        encoding: 'utf-8'
    }).split('\n').filter(Boolean);
}
function gitShow(file, commit) {
    return (0, _child_process.execSync)(`git show ${commit}:${file}`, {
        encoding: 'utf-8'
    });
}
function readGitFiles(fullPath, commit) {
    return gitFiles(fullPath, commit).map((file)=>gitShow(file, commit));
}
async function ensureDirectory(dirPath) {
    await _promises.mkdir(dirPath, {
        recursive: true
    });
}
function batchExecutor(executor, completeCb) {
    return async function*(_taskGraph, inputs, overrides, context) {
        const tasks = Object.keys(inputs);
        console.info(`Batched execution of ${tasks.length} tasks (single threaded)...`);
        const start = performance.now();
        for(let taskIndex = 0; taskIndex < tasks.length; taskIndex++){
            const task = tasks[taskIndex];
            const inputOptions = inputs[task];
            let success = false;
            let terminalOutput = '';
            try {
                await executor({
                    ...inputOptions,
                    ...overrides
                }, context);
                success = true;
            } catch (e) {
                terminalOutput += `${e}`;
            }
            yield {
                task,
                result: {
                    success,
                    terminalOutput
                }
            };
        }
        const duration = performance.now() - start;
        console.info(`Batched execution of ${tasks.length} jobs complete in ${Math.floor(duration / 100) / 10}s`);
        await completeCb?.();
    };
}
function batchWorkerExecutor(workerModule, extraMsgContent) {
    return async function*(taskGraph, inputs, overrides, _context) {
        const results = new Map();
        let threadCount;
        if (process.env.CI == null) {
            threadCount = Math.round(_os.cpus().length / 2);
        } else {
            threadCount = 2;
        }
        const { Tinypool } = await import('tinypool');
        const pool = new Tinypool({
            runtime: 'child_process',
            filename: workerModule,
            maxThreads: threadCount,
            env: process.env
        });
        process.on('exit', ()=>{
            pool.cancelPendingTasks();
            pool.destroy().catch((e)=>console.error(e));
        });
        const tasks = Object.keys(inputs);
        console.info(`Batched execution of ${tasks.length} tasks, using ${pool.threads.length} threads...`);
        const start = performance.now();
        const contents = extraMsgContent?.() ?? {};
        for(let taskIndex = 0; taskIndex < tasks.length; taskIndex++){
            const taskName = tasks[taskIndex];
            const task = taskGraph.tasks[taskName];
            const inputOptions = inputs[taskName];
            const opts = {
                options: {
                    ...inputOptions,
                    ...overrides
                },
                context: {
                    projectName: task.target.project,
                    targetName: task.target.target,
                    configurationName: task.target.configuration
                },
                taskName,
                ...contents
            };
            results.set(taskName, pool.run(opts));
        }
        // Run yield loop after dispatch to avoid serializing execution.
        for(let taskIndex = 0; taskIndex < tasks.length; taskIndex++){
            const taskName = tasks[taskIndex];
            yield results.get(taskName);
        }
        await Promise.allSettled(results.values());
        const duration = performance.now() - start;
        console.info(`Batched execution of ${tasks.length} jobs complete in ${Math.floor(duration / 100) / 10}s`);
        await pool.destroy();
    };
}
async function consolePrefix(prefix, cb) {
    const fns = {};
    const fnNames = [
        'log',
        'debug',
        'info',
        'warn',
        'error'
    ];
    const timesCalled = {
        debug: 0,
        error: 0,
        info: 0,
        log: 0,
        warn: 0
    };
    for (const fn of fnNames){
        fns[fn] = console[fn];
        console[fn] = (arg, ...args)=>{
            // Filter license message.
            if (typeof arg === 'string' && arg.startsWith('*')) return;
            timesCalled[fn]++;
            fns[fn].call(console, prefix, arg, ...args);
        };
    }
    try {
        await cb();
        return timesCalled;
    } finally{
        Object.assign(console, fns);
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NjcmlwdHMvcGx1Z2luLXV0aWxzL2V4ZWN1dG9ycy11dGlscy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEV4ZWN1dG9yQ29udGV4dCwgVGFza0dyYXBoIH0gZnJvbSAnQG54L2RldmtpdCc7XHJcbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XHJcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcclxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMvcHJvbWlzZXMnO1xyXG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xyXG5pbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xyXG5cclxuZXhwb3J0IHR5cGUgVGFza1Jlc3VsdCA9IHtcclxuICAgIHN1Y2Nlc3M6IGJvb2xlYW47XHJcbiAgICB0ZXJtaW5hbE91dHB1dDogc3RyaW5nO1xyXG4gICAgc3RhcnRUaW1lPzogbnVtYmVyO1xyXG4gICAgZW5kVGltZT86IG51bWJlcjtcclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIEJhdGNoRXhlY3V0b3JUYXNrUmVzdWx0ID0ge1xyXG4gICAgdGFzazogc3RyaW5nO1xyXG4gICAgcmVzdWx0OiBUYXNrUmVzdWx0O1xyXG59O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4aXN0cyhmaWxlUGF0aDogc3RyaW5nKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiAoYXdhaXQgZnMuc3RhdChmaWxlUGF0aCkpPy5pc0ZpbGUoKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRKU09ORmlsZShmaWxlUGF0aDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gKGF3YWl0IGV4aXN0cyhmaWxlUGF0aCkpID8gSlNPTi5wYXJzZShhd2FpdCBmcy5yZWFkRmlsZShmaWxlUGF0aCwgJ3V0Zi04JykpIDogbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRGaWxlKGZpbGVQYXRoOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiAoYXdhaXQgZXhpc3RzKGZpbGVQYXRoKSkgPyBhd2FpdCBmcy5yZWFkRmlsZShmaWxlUGF0aCwgJ3V0Zi04JykgOiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd3JpdGVKU09ORmlsZShmaWxlUGF0aDogc3RyaW5nLCBkYXRhOiB1bmtub3duLCBpbmRlbnQgPSAyKSB7XHJcbiAgICBjb25zdCBkYXRhQ29udGVudCA9IEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIGluZGVudCk7XHJcbiAgICBhd2FpdCB3cml0ZUZpbGUoZmlsZVBhdGgsIGRhdGFDb250ZW50KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdyaXRlRmlsZShmaWxlUGF0aDogc3RyaW5nLCBuZXdDb250ZW50OiBzdHJpbmcgfCBCdWZmZXIpIHtcclxuICAgIGNvbnN0IG91dHB1dERpciA9IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XHJcbiAgICBhd2FpdCBmcy5ta2RpcihvdXRwdXREaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG4gICAgYXdhaXQgZnMud3JpdGVGaWxlKGZpbGVQYXRoLCBuZXdDb250ZW50KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUZpbGUoZmlsZVBhdGg6IHN0cmluZykge1xyXG4gICAgaWYgKGF3YWl0IGV4aXN0cyhmaWxlUGF0aCkpIHtcclxuICAgICAgICBhd2FpdCBmcy5ybShmaWxlUGF0aCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpbGVDb250ZW50cyhjb250ZW50czogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gdHMuY3JlYXRlU291cmNlRmlsZSgndGVtcEZpbGUudHMnLCBjb250ZW50cywgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCwgdHJ1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpbGUoZmlsZVBhdGg6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHBhcnNlRmlsZUNvbnRlbnRzKHJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0ZjgnKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnB1dEdsb2IoZnVsbFBhdGg6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGdsb2Iuc3luYyhgJHtmdWxsUGF0aH0vKiovKi50c2AsIHtcclxuICAgICAgICBpZ25vcmU6IFtgJHtmdWxsUGF0aH0vKiovKi50ZXN0LnRzYCwgYCR7ZnVsbFBhdGh9LyoqLyouc3BlYy50c2BdLFxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnaXRDdXJyZW50QnJhbmNoKCkge1xyXG4gICAgcmV0dXJuIGV4ZWNTeW5jKCdnaXQgcmV2LXBhcnNlIC0tYWJicmV2LXJlZiBIRUFEJywgeyBlbmNvZGluZzogJ3V0Zi04JyB9KS50cmltKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnaXRGaWxlcyhmdWxsUGF0aDogc3RyaW5nLCBjb21taXQ6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGV4ZWNTeW5jKFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgYGdpdCBscy10cmVlIC1yIC0tbmFtZS1vbmx5ICR7Y29tbWl0fWAsXHJcbiAgICAgICAgICAgIGBncmVwIC1FICdeJHtmdWxsUGF0aH0vW146XSpcXFxcLnRzJCdgLFxyXG4gICAgICAgICAgICBgZ3JlcCAtdkUgJ1xcXFwuKHRlc3R8c3BlYylcXFxcLnRzJCdgLFxyXG4gICAgICAgIF0uam9pbignIHwgJyksXHJcbiAgICAgICAgeyBlbmNvZGluZzogJ3V0Zi04JyB9XHJcbiAgICApXHJcbiAgICAgICAgLnNwbGl0KCdcXG4nKVxyXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnaXRTaG93KGZpbGU6IHN0cmluZywgY29tbWl0OiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBleGVjU3luYyhgZ2l0IHNob3cgJHtjb21taXR9OiR7ZmlsZX1gLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVhZEdpdEZpbGVzKGZ1bGxQYXRoOiBzdHJpbmcsIGNvbW1pdDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZ2l0RmlsZXMoZnVsbFBhdGgsIGNvbW1pdCkubWFwKChmaWxlKSA9PiBnaXRTaG93KGZpbGUsIGNvbW1pdCkpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5zdXJlRGlyZWN0b3J5KGRpclBhdGg6IHN0cmluZykge1xyXG4gICAgYXdhaXQgZnMubWtkaXIoZGlyUGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBiYXRjaEV4ZWN1dG9yPEV4ZWN1dG9yT3B0aW9ucz4oXHJcbiAgICBleGVjdXRvcjogKG9wdHM6IEV4ZWN1dG9yT3B0aW9ucywgY3R4OiBFeGVjdXRvckNvbnRleHQpID0+IFByb21pc2U8dm9pZD4sXHJcbiAgICBjb21wbGV0ZUNiPzogKCkgPT4gUHJvbWlzZTx2b2lkPiB8IHZvaWRcclxuKSB7XHJcbiAgICByZXR1cm4gYXN5bmMgZnVuY3Rpb24qIChcclxuICAgICAgICBfdGFza0dyYXBoOiBUYXNrR3JhcGgsXHJcbiAgICAgICAgaW5wdXRzOiBSZWNvcmQ8c3RyaW5nLCBFeGVjdXRvck9wdGlvbnM+LFxyXG4gICAgICAgIG92ZXJyaWRlczogRXhlY3V0b3JPcHRpb25zLFxyXG4gICAgICAgIGNvbnRleHQ6IEV4ZWN1dG9yQ29udGV4dFxyXG4gICAgKTogQXN5bmNHZW5lcmF0b3I8QmF0Y2hFeGVjdXRvclRhc2tSZXN1bHQsIGFueSwgdW5rbm93bj4ge1xyXG4gICAgICAgIGNvbnN0IHRhc2tzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5pbmZvKGBCYXRjaGVkIGV4ZWN1dGlvbiBvZiAke3Rhc2tzLmxlbmd0aH0gdGFza3MgKHNpbmdsZSB0aHJlYWRlZCkuLi5gKTtcclxuICAgICAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGZvciAobGV0IHRhc2tJbmRleCA9IDA7IHRhc2tJbmRleCA8IHRhc2tzLmxlbmd0aDsgdGFza0luZGV4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgdGFzayA9IHRhc2tzW3Rhc2tJbmRleF07XHJcbiAgICAgICAgICAgIGNvbnN0IGlucHV0T3B0aW9ucyA9IGlucHV0c1t0YXNrXTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCB0ZXJtaW5hbE91dHB1dCA9ICcnO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgZXhlY3V0b3IoeyAuLi5pbnB1dE9wdGlvbnMsIC4uLm92ZXJyaWRlcyB9LCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtaW5hbE91dHB1dCArPSBgJHtlfWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHlpZWxkIHsgdGFzaywgcmVzdWx0OiB7IHN1Y2Nlc3MsIHRlcm1pbmFsT3V0cHV0IH0gfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydDtcclxuICAgICAgICBjb25zb2xlLmluZm8oYEJhdGNoZWQgZXhlY3V0aW9uIG9mICR7dGFza3MubGVuZ3RofSBqb2JzIGNvbXBsZXRlIGluICR7TWF0aC5mbG9vcihkdXJhdGlvbiAvIDEwMCkgLyAxMH1zYCk7XHJcblxyXG4gICAgICAgIGF3YWl0IGNvbXBsZXRlQ2I/LigpO1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJhdGNoV29ya2VyRXhlY3V0b3I8RXhlY3V0b3JPcHRpb25zPih3b3JrZXJNb2R1bGU6IHN0cmluZywgZXh0cmFNc2dDb250ZW50PzogKCkgPT4gb2JqZWN0KSB7XHJcbiAgICByZXR1cm4gYXN5bmMgZnVuY3Rpb24qIChcclxuICAgICAgICB0YXNrR3JhcGg6IFRhc2tHcmFwaCxcclxuICAgICAgICBpbnB1dHM6IFJlY29yZDxzdHJpbmcsIEV4ZWN1dG9yT3B0aW9ucz4sXHJcbiAgICAgICAgb3ZlcnJpZGVzOiBFeGVjdXRvck9wdGlvbnMsXHJcbiAgICAgICAgX2NvbnRleHQ6IEV4ZWN1dG9yQ29udGV4dFxyXG4gICAgKTogQXN5bmNHZW5lcmF0b3I8QmF0Y2hFeGVjdXRvclRhc2tSZXN1bHQsIGFueSwgdW5rbm93bj4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IE1hcDxzdHJpbmcsIFByb21pc2U8QmF0Y2hFeGVjdXRvclRhc2tSZXN1bHQ+PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgICAgbGV0IHRocmVhZENvdW50O1xyXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5DSSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocmVhZENvdW50ID0gTWF0aC5yb3VuZChvcy5jcHVzKCkubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyZWFkQ291bnQgPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB7IFRpbnlwb29sIH0gPSBhd2FpdCBpbXBvcnQoJ3Rpbnlwb29sJyk7XHJcbiAgICAgICAgY29uc3QgcG9vbCA9IG5ldyBUaW55cG9vbCh7XHJcbiAgICAgICAgICAgIHJ1bnRpbWU6ICdjaGlsZF9wcm9jZXNzJyxcclxuICAgICAgICAgICAgZmlsZW5hbWU6IHdvcmtlck1vZHVsZSxcclxuICAgICAgICAgICAgbWF4VGhyZWFkczogdGhyZWFkQ291bnQsXHJcbiAgICAgICAgICAgIGVudjogcHJvY2Vzcy5lbnYgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPixcclxuICAgICAgICB9KTtcclxuICAgICAgICBwcm9jZXNzLm9uKCdleGl0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBwb29sLmNhbmNlbFBlbmRpbmdUYXNrcygpO1xyXG4gICAgICAgICAgICBwb29sLmRlc3Ryb3koKS5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcihlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRhc2tzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5pbmZvKGBCYXRjaGVkIGV4ZWN1dGlvbiBvZiAke3Rhc2tzLmxlbmd0aH0gdGFza3MsIHVzaW5nICR7cG9vbC50aHJlYWRzLmxlbmd0aH0gdGhyZWFkcy4uLmApO1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgY29uc3QgY29udGVudHMgPSBleHRyYU1zZ0NvbnRlbnQ/LigpID8/IHt9O1xyXG4gICAgICAgIGZvciAobGV0IHRhc2tJbmRleCA9IDA7IHRhc2tJbmRleCA8IHRhc2tzLmxlbmd0aDsgdGFza0luZGV4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgdGFza05hbWUgPSB0YXNrc1t0YXNrSW5kZXhdO1xyXG4gICAgICAgICAgICBjb25zdCB0YXNrID0gdGFza0dyYXBoLnRhc2tzW3Rhc2tOYW1lXTtcclxuICAgICAgICAgICAgY29uc3QgaW5wdXRPcHRpb25zID0gaW5wdXRzW3Rhc2tOYW1lXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9wdHMgPSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB7IC4uLmlucHV0T3B0aW9ucywgLi4ub3ZlcnJpZGVzIH0sXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdE5hbWU6IHRhc2sudGFyZ2V0LnByb2plY3QsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TmFtZTogdGFzay50YXJnZXQudGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25OYW1lOiB0YXNrLnRhcmdldC5jb25maWd1cmF0aW9uLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRhc2tOYW1lLFxyXG4gICAgICAgICAgICAgICAgLi4uY29udGVudHMsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlc3VsdHMuc2V0KHRhc2tOYW1lLCBwb29sLnJ1bihvcHRzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSdW4geWllbGQgbG9vcCBhZnRlciBkaXNwYXRjaCB0byBhdm9pZCBzZXJpYWxpemluZyBleGVjdXRpb24uXHJcbiAgICAgICAgZm9yIChsZXQgdGFza0luZGV4ID0gMDsgdGFza0luZGV4IDwgdGFza3MubGVuZ3RoOyB0YXNrSW5kZXgrKykge1xyXG4gICAgICAgICAgICBjb25zdCB0YXNrTmFtZSA9IHRhc2tzW3Rhc2tJbmRleF07XHJcbiAgICAgICAgICAgIHlpZWxkIHJlc3VsdHMuZ2V0KHRhc2tOYW1lKSE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbFNldHRsZWQocmVzdWx0cy52YWx1ZXMoKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydDtcclxuICAgICAgICBjb25zb2xlLmluZm8oYEJhdGNoZWQgZXhlY3V0aW9uIG9mICR7dGFza3MubGVuZ3RofSBqb2JzIGNvbXBsZXRlIGluICR7TWF0aC5mbG9vcihkdXJhdGlvbiAvIDEwMCkgLyAxMH1zYCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHBvb2wuZGVzdHJveSgpO1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbnNvbGVQcmVmaXgocHJlZml4OiBzdHJpbmcsIGNiOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSB7XHJcbiAgICBjb25zdCBmbnM6IGFueSA9IHt9O1xyXG4gICAgY29uc3QgZm5OYW1lcyA9IFsnbG9nJywgJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddIGFzIGNvbnN0O1xyXG4gICAgY29uc3QgdGltZXNDYWxsZWQ6IFJlY29yZDwodHlwZW9mIGZuTmFtZXMpW251bWJlcl0sIG51bWJlcj4gPSB7XHJcbiAgICAgICAgZGVidWc6IDAsXHJcbiAgICAgICAgZXJyb3I6IDAsXHJcbiAgICAgICAgaW5mbzogMCxcclxuICAgICAgICBsb2c6IDAsXHJcbiAgICAgICAgd2FybjogMCxcclxuICAgIH07XHJcbiAgICBmb3IgKGNvbnN0IGZuIG9mIGZuTmFtZXMpIHtcclxuICAgICAgICBmbnNbZm5dID0gY29uc29sZVtmbl07XHJcblxyXG4gICAgICAgIGNvbnNvbGVbZm5dID0gKGFyZzogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBGaWx0ZXIgbGljZW5zZSBtZXNzYWdlLlxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgJiYgYXJnLnN0YXJ0c1dpdGgoJyonKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGltZXNDYWxsZWRbZm5dKys7XHJcbiAgICAgICAgICAgIGZuc1tmbl0uY2FsbChjb25zb2xlLCBwcmVmaXgsIGFyZywgLi4uYXJncyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgY2IoKTtcclxuICAgICAgICByZXR1cm4gdGltZXNDYWxsZWQ7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oY29uc29sZSwgZm5zKTtcclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOlsiYmF0Y2hFeGVjdXRvciIsImJhdGNoV29ya2VyRXhlY3V0b3IiLCJjb25zb2xlUHJlZml4IiwiZGVsZXRlRmlsZSIsImVuc3VyZURpcmVjdG9yeSIsImV4aXN0cyIsImdpdEN1cnJlbnRCcmFuY2giLCJnaXRGaWxlcyIsImdpdFNob3ciLCJpbnB1dEdsb2IiLCJwYXJzZUZpbGUiLCJwYXJzZUZpbGVDb250ZW50cyIsInJlYWRGaWxlIiwicmVhZEdpdEZpbGVzIiwicmVhZEpTT05GaWxlIiwid3JpdGVGaWxlIiwid3JpdGVKU09ORmlsZSIsImZpbGVQYXRoIiwiZnMiLCJzdGF0IiwiaXNGaWxlIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsImluZGVudCIsImRhdGFDb250ZW50Iiwic3RyaW5naWZ5IiwibmV3Q29udGVudCIsIm91dHB1dERpciIsInBhdGgiLCJkaXJuYW1lIiwibWtkaXIiLCJyZWN1cnNpdmUiLCJybSIsImNvbnRlbnRzIiwidHMiLCJjcmVhdGVTb3VyY2VGaWxlIiwiU2NyaXB0VGFyZ2V0IiwiTGF0ZXN0IiwicmVhZEZpbGVTeW5jIiwiZnVsbFBhdGgiLCJnbG9iIiwic3luYyIsImlnbm9yZSIsImV4ZWNTeW5jIiwiZW5jb2RpbmciLCJ0cmltIiwiY29tbWl0Iiwiam9pbiIsInNwbGl0IiwiZmlsdGVyIiwiQm9vbGVhbiIsImZpbGUiLCJtYXAiLCJkaXJQYXRoIiwiZXhlY3V0b3IiLCJjb21wbGV0ZUNiIiwiX3Rhc2tHcmFwaCIsImlucHV0cyIsIm92ZXJyaWRlcyIsImNvbnRleHQiLCJ0YXNrcyIsIk9iamVjdCIsImtleXMiLCJjb25zb2xlIiwiaW5mbyIsImxlbmd0aCIsInN0YXJ0IiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0YXNrSW5kZXgiLCJ0YXNrIiwiaW5wdXRPcHRpb25zIiwic3VjY2VzcyIsInRlcm1pbmFsT3V0cHV0IiwiZSIsInJlc3VsdCIsImR1cmF0aW9uIiwiTWF0aCIsImZsb29yIiwid29ya2VyTW9kdWxlIiwiZXh0cmFNc2dDb250ZW50IiwidGFza0dyYXBoIiwiX2NvbnRleHQiLCJyZXN1bHRzIiwiTWFwIiwidGhyZWFkQ291bnQiLCJwcm9jZXNzIiwiZW52IiwiQ0kiLCJyb3VuZCIsIm9zIiwiY3B1cyIsIlRpbnlwb29sIiwicG9vbCIsInJ1bnRpbWUiLCJmaWxlbmFtZSIsIm1heFRocmVhZHMiLCJvbiIsImNhbmNlbFBlbmRpbmdUYXNrcyIsImRlc3Ryb3kiLCJjYXRjaCIsImVycm9yIiwidGhyZWFkcyIsInRhc2tOYW1lIiwib3B0cyIsIm9wdGlvbnMiLCJwcm9qZWN0TmFtZSIsInRhcmdldCIsInByb2plY3QiLCJ0YXJnZXROYW1lIiwiY29uZmlndXJhdGlvbk5hbWUiLCJjb25maWd1cmF0aW9uIiwic2V0IiwicnVuIiwiZ2V0IiwiUHJvbWlzZSIsImFsbFNldHRsZWQiLCJ2YWx1ZXMiLCJwcmVmaXgiLCJjYiIsImZucyIsImZuTmFtZXMiLCJ0aW1lc0NhbGxlZCIsImRlYnVnIiwibG9nIiwid2FybiIsImZuIiwiYXJnIiwiYXJncyIsInN0YXJ0c1dpdGgiLCJjYWxsIiwiYXNzaWduIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFpR2dCQSxhQUFhO2VBQWJBOztJQXFDQUMsbUJBQW1CO2VBQW5CQTs7SUFpRU1DLGFBQWE7ZUFBYkE7O0lBdkpBQyxVQUFVO2VBQVZBOztJQTZDQUMsZUFBZTtl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