"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _fs = require("fs");
const _glob = /*#__PURE__*/ _interop_require_default._(require("glob"));
const _path = /*#__PURE__*/ _interop_require_default._(require("path"));
const LICENSE_REGEX = /(Copyright \(c\) 2015-)(\d+)( AG GRID LTD)/gm;
async function updateLicenses() {
    const fullPath = _path.default.join(__dirname, '../../../..');
    const licenseGlob = `${fullPath}/**/LICENSE.txt`;
    const currentYear = new Date().getFullYear();
    const licenseFiles = _glob.default.sync(licenseGlob, {
        ignore: [
            '**/node_modules/**'
        ]
    });
    licenseFiles.forEach((filePath)=>{
        const contents = (0, _fs.readFileSync)(filePath, 'utf-8');
        const newContents = contents.replace(LICENSE_REGEX, `$1${currentYear}$3`);
        if (newContents !== contents) {
            (0, _fs.writeFileSync)(filePath, newContents);
        }
    });
}
updateLicenses();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NjcmlwdHMvbGljZW5zZS91cGRhdGVMaWNlbnNlcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmMgfSBmcm9tICdmcyc7XHJcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmNvbnN0IExJQ0VOU0VfUkVHRVggPSAvKENvcHlyaWdodCBcXChjXFwpIDIwMTUtKShcXGQrKSggQUcgR1JJRCBMVEQpL2dtO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlTGljZW5zZXMoKSB7XHJcbiAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi8uLicpO1xyXG4gICAgY29uc3QgbGljZW5zZUdsb2IgPSBgJHtmdWxsUGF0aH0vKiovTElDRU5TRS50eHRgO1xyXG4gICAgY29uc3QgY3VycmVudFllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gICAgY29uc3QgbGljZW5zZUZpbGVzID0gZ2xvYi5zeW5jKGxpY2Vuc2VHbG9iLCB7XHJcbiAgICAgICAgaWdub3JlOiBbJyoqL25vZGVfbW9kdWxlcy8qKiddLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbGljZW5zZUZpbGVzLmZvckVhY2goKGZpbGVQYXRoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29udGVudHMgPSByZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGYtOCcpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdDb250ZW50cyA9IGNvbnRlbnRzLnJlcGxhY2UoTElDRU5TRV9SRUdFWCwgYCQxJHtjdXJyZW50WWVhcn0kM2ApO1xyXG4gICAgICAgIGlmIChuZXdDb250ZW50cyAhPT0gY29udGVudHMpIHtcclxuICAgICAgICAgICAgd3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgbmV3Q29udGVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG51cGRhdGVMaWNlbnNlcygpO1xyXG4iXSwibmFtZXMiOlsiTElDRU5TRV9SRUdFWCIsInVwZGF0ZUxpY2Vuc2VzIiwiZnVsbFBhdGgiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsImxpY2Vuc2VHbG9iIiwiY3VycmVudFllYXIiLCJEYXRlIiwiZ2V0RnVsbFllYXIiLCJsaWNlbnNlRmlsZXMiLCJnbG9iIiwic3luYyIsImlnbm9yZSIsImZvckVhY2giLCJmaWxlUGF0aCIsImNvbnRlbnRzIiwicmVhZEZpbGVTeW5jIiwibmV3Q29udGVudHMiLCJyZXBsYWNlIiwid3JpdGVGaWxlU3luYyJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7Ozs7b0JBQTRDOytEQUMzQjsrREFDQTtBQUVqQixNQUFNQSxnQkFBZ0I7QUFFdEIsZUFBZUM7SUFDWCxNQUFNQyxXQUFXQyxhQUFJLENBQUNDLElBQUksQ0FBQ0MsV0FBVztJQUN0QyxNQUFNQyxjQUFjLENBQUMsRUFBRUosU0FBUyxlQUFlLENBQUM7SUFDaEQsTUFBTUssY0FBYyxJQUFJQyxPQUFPQyxXQUFXO0lBRTFDLE1BQU1DLGVBQWVDLGFBQUksQ0FBQ0MsSUFBSSxDQUFDTixhQUFhO1FBQ3hDTyxRQUFRO1lBQUM7U0FBcUI7SUFDbEM7SUFFQUgsYUFBYUksT0FBTyxDQUFDLENBQUNDO1FBQ2xCLE1BQU1DLFdBQVdDLElBQUFBLGdCQUFZLEVBQUNGLFVBQVU7UUFFeEMsTUFBTUcsY0FBY0YsU0FBU0csT0FBTyxDQUFDbkIsZUFBZSxDQUFDLEVBQUUsRUFBRU8sWUFBWSxFQUFFLENBQUM7UUFDeEUsSUFBSVcsZ0JBQWdCRixVQUFVO1lBQzFCSSxJQUFBQSxpQkFBYSxFQUFDTCxVQUFVRztRQUM1QjtJQUNKO0FBQ0o7QUFFQWpCIn0=