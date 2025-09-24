---
title: Waline评论在Vercel部署
description: 使用Waline评论我喜欢使用的部署方法(个人认为最简便)
published: 2025-04-14
pinned: false
tags: ['教程', 'waline', 'vercel']
category: 技术分享
# licenseName: "Unlicensed"
author: 克喵爱吃卤面
image: https://i1.wp.com/dev.ruom.top/i/2025/04/14/073842.webp
# sourceLink: "https://github.com/emn178/markdown"
draft: false
---

> 使用Waline评论我喜欢使用的部署方法(个人认为最简便)

## 所需账号
1. 一个Github账号
2. 一个Vercel账号
3. 一个leancloud账号(最好是国际服的，你有了Github难道还用大陆的吗？大陆的要备案，故在这里不阐述，末尾放原文链接)

---
## 在 leancloud 里创建数据库

1. [登录](https://console.leancloud.app/login) 或 [注册](https://console.leancloud.app/register) `LeanCloud 国际版` 并进入 [控制台](https://console.leancloud.app/apps)

1. 点击左上角 [创建应用](https://console.leancloud.app/apps) 并起一个你喜欢的名字 (请选择免费的开发版):

   ![创建应用](https://s2.loli.net/2025/04/14/7FOYbvS8MlQXe52.png)

1. 进入应用，选择左下角的 `设置` > `应用 Key`。你可以看到你的 `APP ID`,`APP Key` 和 `Master Key`。请记录它们，以便后续使用。

   ![ID 和 Key](https://s2.loli.net/2025/04/14/c1Vltvsm8GYXSbf.png)

---
## 在 Vercel 部署
[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwalinejs%2Fwaline%2Ftree%2Fmain%2Fexample)

1. 点击上方按钮，跳转至 Vercel 进行 Server 端部署。

   ::: note

   如果你未登录的话，Vercel 会让你注册或登录，请使用 GitHub 账户进行快捷登录。

   :::

1. 输入一个你喜欢的 Vercel 项目名称并点击 `Create` 继续:

   ![创建项目](https://s2.loli.net/2025/04/14/XauJLO7hfcWVx2Y.png)

1. 此时 Vercel 会基于 Waline 模板帮助你新建并初始化仓库，仓库名为你之前输入的项目名。

   ![deploy](https://s2.loli.net/2025/04/14/Q7tExaML3XKlf12.png)

   一两分钟后，满屏的烟花会庆祝你部署成功。此时点击 `Go to Dashboard` 可以跳转到应用的控制台。

   ![deploy](https://s2.loli.net/2025/04/14/HqfvwV6GdrFROSZ.png)

1. 点击顶部的 `Settings` - `Environment Variables` 进入环境变量配置页，并配置三个环境变量 `LEAN_ID`, `LEAN_KEY` 和 `LEAN_MASTER_KEY` 。它们的值分别对应上一步在 LeanCloud 中获得的 `APP ID`, `APP KEY`, `Master Key`。

   ![设置环境变量](https://s2.loli.net/2025/04/14/9laMFio1umnjB6g.png)

1. 环境变量配置完成之后点击顶部的 `Deployments` 点击顶部最新的一次部署右侧的 `Redeploy` 按钮进行重新部署。该步骤是为了让刚才设置的环境变量生效。

   ![redeploy](https://s2.loli.net/2025/04/14/WkVxeRub73aIHBX.png)

1. 此时会跳转到 `Overview` 界面开始部署，等待片刻后 `STATUS` 会变成 `Ready`。此时请点击 `Visit` ，即可跳转到部署好的网站地址，此地址即为你的服务端地址。

   ![redeploy success](https://s2.loli.net/2025/04/14/xM8rEezGTqFQNCY.png)

## 绑定域名 (可选)

1. 点击顶部的 `Settings` - `Domains` 进入域名配置页

1. 输入需要绑定的域名并点击 `Add`

   ![Add domain](https://s2.loli.net/2025/04/14/9wHyLEWQOtvz1fA.png)

1. 在域名服务器商处添加新的 `CNAME` 解析记录

   | Type  | Name    | Value                                                       |
   | ----- | ------- | ----------------------------------------------------------- |
   | CNAME | example | cname.vercel-dns.com(国区的可用 cname-china.vercel-dns.com) |

1. 等待生效，你可以通过自己的域名来访问了:tada:

   - 评论系统：example.yourdomain.com
   - 评论管理：example.yourdomain.com/ui

![success](https://s2.loli.net/2025/04/14/4BOxqfs16erKTMV.png)

## HTML 引入 (客户端)

在你的网页中进行如下设置:

1. 导入 Waline 样式 `https://unpkg.com/@waline/client@v3/dist/waline.css`。

1. 创建 `<script>` 标签使用来自 `https://unpkg.com/@waline/client@v3/dist/waline.js` 的 `init()` 函数初始化，并传入必要的 `el` 与 `serverURL` 选项。

   - `el` 选项是 Waline 渲染使用的元素，你可以设置一个字符串形式的 CSS 选择器或者一个 HTMLElement 对象。
   - `serverURL` 是服务端的地址，即上一步获取到的值。

   ```html {3-7,12-18}:line-numbers
   <head>
     <!-- ... -->
     <link
       rel="stylesheet"
       href="https://unpkg.com/@waline/client@v3/dist/waline.css"
     />
     <!-- ... -->
   </head>
   <body>
     <!-- ... -->
     <div id="waline"></div>
     <script type="module">
       import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';

       init({
         el: '#waline',
         serverURL: 'https://your-domain.vercel.app',
       });
     </script>
   </body>
   ```

1. 评论服务此时就会在你的网站上成功运行 :tada:

## 评论管理 (管理端)

1. 部署完成后，请访问 `<serverURL>/ui/register` 进行注册。首个注册的人会被设定成管理员。
1. 管理员登陆后，即可看到评论管理界面。在这里可以修改、标记或删除评论。
1. 用户也可通过评论框注册账号，登陆后会跳转到自己的档案页。

## 视频教程

以下是热心用户制作的视频教程，以上操作不清楚的也可以参考一二。

### Waline 部署教程（快速上手）

> UP 主：[rickroll 摇](https://space.bilibili.com/381992209)

### 使用 Vercel 简单地部署 Waline 评论系统

> UP 主：[岚天呀](https://space.bilibili.com/355877984)

---

## 以上为部分修改原文
原文链接: https://waline.js.org/guide/get-started/
