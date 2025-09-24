---
title: tgtalk免费部署
description: 一个基于 Cloudflare Workers 的 tg 频道消息说说。
published: 2025-05-04
pinned: false
tags: ['tgtalk', '说说', '教程']
category: 技术分享
# licenseName: "Unlicensed"
author: 克喵爱吃卤面
image: https://cdn.jsdelivr.net/gh/kmfx/tuchuang@main/img/202505051857682.webp
# sourceLink: "https://github.com/emn178/markdown"
draft: false
---

## 部署 API

访问 [Gist][1] 并获取其中所有代码

> 需要注意，本 API Worker 脚本基于 ChenYFan 修改，包含了本项目需要使用的功能，请勿随意更改脚本内容
> TGTalker-Frontend V2 的 API 不兼容 V1

进入 [Cloudflare 仪表盘][2]

选择创建应用程序 -> 创建 Worker -> 修改名称（部署）-> 编辑代码

在其中粘贴你复制的所有代码，并且修改 ChannelName 为你的频道名称，部署并访问 Worker 查看是否能正确返回内容

接着你可以为你的 Worker 绑定一个域名

![](https://cdn.jsdelivr.net/gh/kmfx/tuchuang@main/img/202505042340004.png)
![](https://cdn.jsdelivr.net/gh/kmfx/tuchuang@main/img/202505042340138.png)
![](https://cdn.jsdelivr.net/gh/kmfx/tuchuang@main/img/202505042340963.png)

保存，然后将你绑定的域名填入配置中的 api 项即可

[1]: https://gist.github.com/FloatSheep/55db67d9e8148149ebbcb0f9f6b0d901
[2]: https://dash.cloudflare.com