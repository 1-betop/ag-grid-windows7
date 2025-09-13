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
    TestCase: function() {
        return TestCase;
    },
    TestSuite: function() {
        return TestSuite;
    },
    TestSuites: function() {
        return TestSuites;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _fs = /*#__PURE__*/ _interop_require_default._(require("fs"));
const _path = require("path");
const _xmljs = require("xml-js");
let TestCase = class TestCase {
    constructor(classname, name, time){
        this.classname = classname;
        this.name = name;
        this.time = time;
    }
    setFailure(failure) {
        this.failure = failure;
    }
    hasFailure() {
        return this.failure !== undefined;
    }
    print() {
        console.log(`Testcase: ${this.name}`);
    }
};
let TestSuite = class TestSuite {
    constructor(name){
        this.testCases = [];
        this.name = name;
    }
    addTestCase(testCase) {
        this.testCases.push(testCase);
    }
    hasFailure() {
        return this.testCases.some((testCase)=>testCase.hasFailure());
    }
};
let TestSuites = class TestSuites {
    constructor(name){
        this.testSuites = [];
        this.name = name;
    }
    addTestSuite(testSuite) {
        this.testSuites.push(testSuite);
    }
    hasFailures() {
        return this.testSuites.some((testSuite)=>{
            return testSuite.testCases.some((testCase)=>{
                return testCase.failure !== undefined;
            });
        });
    }
    getFailures() {
        const failures = [];
        this.testSuites.forEach((testSuite)=>{
            testSuite.testCases.filter((testCase)=>testCase.failure).forEach((testCase)=>{
                failures.push(testCase.failure);
            });
        });
        return failures;
    }
    toJson(onlyFailures) {
        const result = {
            _declaration: {
                _attributes: {
                    version: '1.0',
                    encoding: 'utf-8'
                }
            },
            testsuites: {
                _attributes: {
                    name: this.name,
                    tests: this.testSuites.reduce((acc, testSuite)=>acc + testSuite.testCases.length, 0),
                    time: this.testSuites.reduce((acc, testSuite)=>acc + testSuite.testCases.reduce((acc, testCase)=>acc + testCase.time, 0), 0),
                    failures: this.testSuites.reduce((acc, testSuite)=>acc + testSuite.testCases.filter((testCase)=>testCase.hasFailure()).length, 0)
                },
                testsuite: this.testSuites.filter((testSuite)=>onlyFailures ? testSuite.hasFailure() : true).map((testSuite)=>({
                        _attributes: {
                            name: testSuite.name,
                            failures: testSuite.testCases.filter((testCase)=>testCase.hasFailure()).length,
                            tests: testSuite.testCases.length,
                            time: testSuite.testCases.reduce((acc, testCase)=>acc + testCase.time, 0)
                        },
                        testcase: testSuite.testCases.filter((testCase)=>onlyFailures ? testCase.hasFailure() : true).map((testCase)=>({
                                _attributes: {
                                    classname: testCase.classname,
                                    name: testCase.name,
                                    time: testCase.time
                                },
                                [testCase.hasFailure() ? 'failure' : '']: testCase.failure
                            }))
                    }))
            }
        };
        // if onlyFailures is set it could be there aren't - we ensure that the expected
        // testsuites >testsuite > testcase hierarchy is maintained and some useful context added
        if (result.testsuites.testsuite.length === 0) {
            result.testsuites.testsuite.push({
                _attributes: {
                    name: `${result.testsuites._attributes.name}: (${result.testsuites._attributes.tests} tests run and passed)`,
                    failures: result.testsuites._attributes.failures,
                    tests: result.testsuites._attributes.tests,
                    time: result.testsuites._attributes.time
                },
                testcase: [
                    {
                        _attributes: {
                            classname: result.testsuites._attributes.name,
                            name: result.testsuites._attributes.name,
                            time: 0
                        }
                    }
                ]
            });
        }
        return result;
    }
    writeJunitReport(outputPath, onlyFailures = false) {
        const result = (0, _xmljs.json2xml)(JSON.stringify(this.toJson(onlyFailures)).replace('<></>', ''), {
            compact: true,
            ignoreComment: true,
            spaces: 4,
            fullTagEmptyElement: true
        });
        _fs.default.mkdirSync((0, _path.dirname)(outputPath), {
            recursive: true
        });
        _fs.default.writeFileSync(outputPath, result, 'utf8');
    }
    print() {
        console.log(JSON.stringify(this.toJson(false)));
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NjcmlwdHMvanVuaXQtcHJvY2Vzc29yL3NyYy9wcm9jZXNzb3IudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0IHsgZGlybmFtZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBqc29uMnhtbCB9IGZyb20gJ3htbC1qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgVGVzdENhc2Uge1xyXG4gICAgY2xhc3NuYW1lOiBzdHJpbmc7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB0aW1lOiBudW1iZXI7XHJcbiAgICBmYWlsdXJlPzogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNsYXNzbmFtZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIHRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY2xhc3NuYW1lID0gY2xhc3NuYW1lO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy50aW1lID0gdGltZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRGYWlsdXJlKGZhaWx1cmU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZmFpbHVyZSA9IGZhaWx1cmU7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzRmFpbHVyZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mYWlsdXJlICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpbnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFRlc3RjYXNlOiAke3RoaXMubmFtZX1gKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRlc3RTdWl0ZSB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB0ZXN0Q2FzZXM6IFRlc3RDYXNlW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRUZXN0Q2FzZSh0ZXN0Q2FzZTogVGVzdENhc2UpIHtcclxuICAgICAgICB0aGlzLnRlc3RDYXNlcy5wdXNoKHRlc3RDYXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNGYWlsdXJlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRlc3RDYXNlcy5zb21lKCh0ZXN0Q2FzZSkgPT4gdGVzdENhc2UuaGFzRmFpbHVyZSgpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRlc3RTdWl0ZXMge1xyXG4gICAgcHJpdmF0ZSBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSB0ZXN0U3VpdGVzOiBUZXN0U3VpdGVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFRlc3RTdWl0ZSh0ZXN0U3VpdGU6IFRlc3RTdWl0ZSkge1xyXG4gICAgICAgIHRoaXMudGVzdFN1aXRlcy5wdXNoKHRlc3RTdWl0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0ZhaWx1cmVzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRlc3RTdWl0ZXMuc29tZSgodGVzdFN1aXRlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXN0U3VpdGUudGVzdENhc2VzLnNvbWUoKHRlc3RDYXNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVzdENhc2UuZmFpbHVyZSAhPT0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RmFpbHVyZXMoKSB7XHJcbiAgICAgICAgY29uc3QgZmFpbHVyZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgdGhpcy50ZXN0U3VpdGVzLmZvckVhY2goKHRlc3RTdWl0ZSkgPT4ge1xyXG4gICAgICAgICAgICB0ZXN0U3VpdGUudGVzdENhc2VzXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCh0ZXN0Q2FzZSkgPT4gdGVzdENhc2UuZmFpbHVyZSlcclxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKCh0ZXN0Q2FzZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZhaWx1cmVzLnB1c2godGVzdENhc2UuZmFpbHVyZSEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZhaWx1cmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHRvSnNvbihvbmx5RmFpbHVyZXM6IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIF9kZWNsYXJhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgX2F0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiAnMS4wJyxcclxuICAgICAgICAgICAgICAgICAgICBlbmNvZGluZzogJ3V0Zi04JyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlc3RzdWl0ZXM6IHtcclxuICAgICAgICAgICAgICAgIF9hdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlc3RzOiB0aGlzLnRlc3RTdWl0ZXMucmVkdWNlKChhY2MsIHRlc3RTdWl0ZSkgPT4gYWNjICsgdGVzdFN1aXRlLnRlc3RDYXNlcy5sZW5ndGgsIDApLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IHRoaXMudGVzdFN1aXRlcy5yZWR1Y2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChhY2MsIHRlc3RTdWl0ZSkgPT4gYWNjICsgdGVzdFN1aXRlLnRlc3RDYXNlcy5yZWR1Y2UoKGFjYywgdGVzdENhc2UpID0+IGFjYyArIHRlc3RDYXNlLnRpbWUsIDApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAwXHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICBmYWlsdXJlczogdGhpcy50ZXN0U3VpdGVzLnJlZHVjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGFjYywgdGVzdFN1aXRlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjICsgdGVzdFN1aXRlLnRlc3RDYXNlcy5maWx0ZXIoKHRlc3RDYXNlKSA9PiB0ZXN0Q2FzZS5oYXNGYWlsdXJlKCkpLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGVzdHN1aXRlOiB0aGlzLnRlc3RTdWl0ZXNcclxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCh0ZXN0U3VpdGUpID0+IChvbmx5RmFpbHVyZXMgPyB0ZXN0U3VpdGUuaGFzRmFpbHVyZSgpIDogdHJ1ZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgodGVzdFN1aXRlKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGVzdFN1aXRlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsdXJlczogdGVzdFN1aXRlLnRlc3RDYXNlcy5maWx0ZXIoKHRlc3RDYXNlKSA9PiB0ZXN0Q2FzZS5oYXNGYWlsdXJlKCkpLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RzOiB0ZXN0U3VpdGUudGVzdENhc2VzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IHRlc3RTdWl0ZS50ZXN0Q2FzZXMucmVkdWNlKChhY2MsIHRlc3RDYXNlKSA9PiBhY2MgKyB0ZXN0Q2FzZS50aW1lLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdGNhc2U6IHRlc3RTdWl0ZS50ZXN0Q2FzZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKHRlc3RDYXNlKSA9PiAob25seUZhaWx1cmVzID8gdGVzdENhc2UuaGFzRmFpbHVyZSgpIDogdHJ1ZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCh0ZXN0Q2FzZSkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc25hbWU6IHRlc3RDYXNlLmNsYXNzbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGVzdENhc2UubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogdGVzdENhc2UudGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt0ZXN0Q2FzZS5oYXNGYWlsdXJlKCkgPyAnZmFpbHVyZScgOiAnJ106IHRlc3RDYXNlLmZhaWx1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIGlmIG9ubHlGYWlsdXJlcyBpcyBzZXQgaXQgY291bGQgYmUgdGhlcmUgYXJlbid0IC0gd2UgZW5zdXJlIHRoYXQgdGhlIGV4cGVjdGVkXHJcbiAgICAgICAgLy8gdGVzdHN1aXRlcyA+dGVzdHN1aXRlID4gdGVzdGNhc2UgaGllcmFyY2h5IGlzIG1haW50YWluZWQgYW5kIHNvbWUgdXNlZnVsIGNvbnRleHQgYWRkZWRcclxuICAgICAgICBpZiAocmVzdWx0LnRlc3RzdWl0ZXMudGVzdHN1aXRlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXN1bHQudGVzdHN1aXRlcy50ZXN0c3VpdGUucHVzaCg8YW55PntcclxuICAgICAgICAgICAgICAgIF9hdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogYCR7cmVzdWx0LnRlc3RzdWl0ZXMuX2F0dHJpYnV0ZXMubmFtZX06ICgke3Jlc3VsdC50ZXN0c3VpdGVzLl9hdHRyaWJ1dGVzLnRlc3RzfSB0ZXN0cyBydW4gYW5kIHBhc3NlZClgLFxyXG4gICAgICAgICAgICAgICAgICAgIGZhaWx1cmVzOiByZXN1bHQudGVzdHN1aXRlcy5fYXR0cmlidXRlcy5mYWlsdXJlcyxcclxuICAgICAgICAgICAgICAgICAgICB0ZXN0czogcmVzdWx0LnRlc3RzdWl0ZXMuX2F0dHJpYnV0ZXMudGVzdHMsXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogcmVzdWx0LnRlc3RzdWl0ZXMuX2F0dHJpYnV0ZXMudGltZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0ZXN0Y2FzZTogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2F0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzbmFtZTogcmVzdWx0LnRlc3RzdWl0ZXMuX2F0dHJpYnV0ZXMubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHJlc3VsdC50ZXN0c3VpdGVzLl9hdHRyaWJ1dGVzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGVKdW5pdFJlcG9ydChvdXRwdXRQYXRoOiBzdHJpbmcsIG9ubHlGYWlsdXJlcyA9IGZhbHNlKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ganNvbjJ4bWwoSlNPTi5zdHJpbmdpZnkodGhpcy50b0pzb24ob25seUZhaWx1cmVzKSkucmVwbGFjZSgnPD48Lz4nLCAnJyksIHtcclxuICAgICAgICAgICAgY29tcGFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgaWdub3JlQ29tbWVudDogdHJ1ZSxcclxuICAgICAgICAgICAgc3BhY2VzOiA0LFxyXG4gICAgICAgICAgICBmdWxsVGFnRW1wdHlFbGVtZW50OiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGZzLm1rZGlyU3luYyhkaXJuYW1lKG91dHB1dFBhdGgpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG91dHB1dFBhdGgsIHJlc3VsdCwgJ3V0ZjgnKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmludCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzLnRvSnNvbihmYWxzZSkpKTtcclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOlsiVGVzdENhc2UiLCJUZXN0U3VpdGUiLCJUZXN0U3VpdGVzIiwiY29uc3RydWN0b3IiLCJjbGFzc25hbWUiLCJuYW1lIiwidGltZSIsInNldEZhaWx1cmUiLCJmYWlsdXJlIiwiaGFzRmFpbHVyZSIsInVuZGVmaW5lZCIsInByaW50IiwiY29uc29sZSIsImxvZyIsInRlc3RDYXNlcyIsImFkZFRlc3RDYXNlIiwidGVzdENhc2UiLCJwdXNoIiwic29tZSIsInRlc3RTdWl0ZXMiLCJhZGRUZXN0U3VpdGUiLCJ0ZXN0U3VpdGUiLCJoYXNGYWlsdXJlcyIsImdldEZhaWx1cmVzIiwiZmFpbHVyZXMiLCJmb3JFYWNoIiwiZmlsdGVyIiwidG9Kc29uIiwib25seUZhaWx1cmVzIiwicmVzdWx0IiwiX2RlY2xhcmF0aW9uIiwiX2F0dHJpYnV0ZXMiLCJ2ZXJzaW9uIiwiZW5jb2RpbmciLCJ0ZXN0c3VpdGVzIiwidGVzdHMiLCJyZWR1Y2UiLCJhY2MiLCJsZW5ndGgiLCJ0ZXN0c3VpdGUiLCJtYXAiLCJ0ZXN0Y2FzZSIsIndyaXRlSnVuaXRSZXBvcnQiLCJvdXRwdXRQYXRoIiwianNvbjJ4bWwiLCJKU09OIiwic3RyaW5naWZ5IiwicmVwbGFjZSIsImNvbXBhY3QiLCJpZ25vcmVDb21tZW50Iiwic3BhY2VzIiwiZnVsbFRhZ0VtcHR5RWxlbWVudCIsImZzIiwibWtkaXJTeW5jIiwiZGlybmFtZSIsInJlY3Vyc2l2ZSIsIndyaXRlRmlsZVN5bmMiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFJYUEsUUFBUTtlQUFSQTs7SUF5QkFDLFNBQVM7ZUFBVEE7O0lBaUJBQyxVQUFVO2VBQVZBOzs7OzZEQTlDRTtzQkFDUzt1QkFDQztBQUVsQixJQUFBLEFBQU1GLFdBQU4sTUFBTUE7SUFNVEcsWUFBWUMsU0FBaUIsRUFBRUMsSUFBWSxFQUFFQyxJQUFZLENBQUU7UUFDdkQsSUFBSSxDQUFDRixTQUFTLEdBQUdBO1FBQ2pCLElBQUksQ0FBQ0MsSUFBSSxHQUFHQTtRQUNaLElBQUksQ0FBQ0MsSUFBSSxHQUFHQTtJQUNoQjtJQUVBQyxXQUFXQyxPQUFlLEVBQUU7UUFDeEIsSUFBSSxDQUFDQSxPQUFPLEdBQUdBO0lBQ25CO0lBRUFDLGFBQWE7UUFDVCxP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