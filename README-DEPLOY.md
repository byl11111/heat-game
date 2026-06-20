# 部署说明

这个项目是纯静态网页。部署后别人可以直接打开链接或扫描二维码体验，不需要和电脑处在同一个 Wi-Fi。

## 先把本机调参写死

1. 启动本地服务。
2. 用你之前调试游戏时相同的来源打开 `settings-export.html`。
   - 例如：`http://localhost:8099/settings-export.html`
   - 如果你之前是在 `http://10.62.167.132:8099/index.html` 调试，则用 `http://10.62.167.132:8099/settings-export.html`
3. 点击“复制 JS 内容”或“下载 baked-settings.js”。
4. 用导出的内容替换项目根目录的 `baked-settings.js`。

替换后，Pad、公网页面、别人扫码打开都会默认使用这套配置。

## GitHub Pages

1. 新建一个 GitHub 仓库。
2. 把本目录全部上传/推送到仓库。
3. 在仓库 Settings -> Pages 中选择 GitHub Actions。
4. 推送到 `main` 或 `master` 后，`.github/workflows/pages.yml` 会自动发布。
5. 发布完成后，GitHub Actions 页面会显示公网 URL。

## 入口

- 游戏入口：`index.html`
- 手册/真实案例页：`case-archive-portrait.html`
- 配置导出页：`settings-export.html`

## 注意

- `assets/` 目录必须一起部署，图片和美术资源都在里面。
- 不建议继续用局域网预览给别人体验，公共/校园/手机热点经常隔离设备，且速度和缓存表现不稳定。
