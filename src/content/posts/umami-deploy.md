---
title: Umami博客访问统计Vercel+Cloudflare Wokers部署
description: Umami博客访问统计Vercel+Cloudflare Wokers部署教程，附带效果图展示。
published: 2025-04-06
pinned: false
tags: ['umami', 'vercel', 'cloudflare']
category: 技术分享
# licenseName: "Unlicensed"
author: 克喵爱吃卤面
image: https://i1.wp.com/dev.ruom.top/i/2025/04/07/951842.webp
# sourceLink: "https://github.com/emn178/markdown"
draft: false
---

## 第一部分：Vercel+Umami

1. 第一步
    1.1 <kbd>Fork</kbd>​[umami](https://github.com/umami-software/umami)到自己的Github仓库

    ![](https://s2.loli.net/2025/04/06/c4xDVNrsBpTM8YZ.webp)

    1.2 创建项目
![](https://s2.loli.net/2025/04/06/GX9OdivuxF5pJzH.webp)
index.mdx
2. 第二步

　2.1 创建[Verce](https://vercel.com/login)l账号，这里我就省略了，因为GitHub可以直接进行授权即可。

   2.2 在你授权以后，首先创建<kbd>Postgres</kbd>数据库，直接一路下一步，创建好就行，可以给下面的连接复制出来

![](https://s2.loli.net/2025/04/06/K69FpfmjZxcu3Ad.webp)

![](https://s2.loli.net/2025/04/06/7OieEKGht4kgSux.webp)

　　点击<kbd>Copy Snippet</kbd>​,就可以，记住在粘贴的时候是我画线里面的部分，双引号都不需要 ，因为要设置环境变量。

　　 2.3 在创建好数据库以后，回到主页面的<kbd>Overview</kbd>​，然后右上角有一个<kbd>Add New</kbd>​选择添加<kbd>Project</kbd>​，选择你<kbd>Fork</kbd>​的<kbd>umami</kbd>​，添加即可。
    2.4 设置环境变量，`DATABASE_URL`​和`HASH_SALT`​和`TRACKER_SCRIPT_NAME`​，其中`DATABASE_URL`​的值就是上面划线的部分，其他的两个环境变量都是对应的值是String自己可以随意定义。
　　 2.5 设置好以后点击<kbd>Deploy</kbd>​，等待大约两分钟左右，自动部署完成，部署完成以后可以通过下图种面板上面给的链接可以直接访问。

![](https://s2.loli.net/2025/04/06/ahX2wHLrfYAD7ZW.webp)

　　 2.6 打开以后会跳出登录地址，默认的登录密码是<kbd>adminumami</kbd>​，登录进去以后，设置给自己密码修改了，然后就是设置里面添加网站，给你要统计的网站添加进去，到此，别人访问你的网站你可以通过面板看到统计数据了。

## 第二部分：Umami+Cloudflare worker
这一部分主要是让你的博客上面能展示的访问数据，效果如下：

![image](https://s2.loli.net/2025/04/06/fR71aFG4oMD29Pz.webp)

1.  注册<kbd>CloudFlare</kbd>​账号，然后进去以后，选择<kbd>Workers</kbd>​和<kbd>Pages</kbd>​，点击<kbd>创建</kbd>​，再点击<kbd>部署</kbd>

![](https://s2.loli.net/2025/04/06/CYojqdGHkiuFepQ.webp)

![](https://s2.loli.net/2025/04/06/6B2rXxk4Uu71GQC.webp)

　　部署以后，进去点击编辑代码，将里面的代码进行替换：

```
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});

const API_BASE_URL = 'https://umami.yourdomain.com';  // 替换你的刚才部署的umami的域名
const TOKEN = 'your_token'; // 获取的token
const WEBSITE_ID = 'your_website_id'; // 在umami添加网站的 webstie id
const CACHE_KEY = 'umami_cache';
const CACHE_TIME = 600; // Cache time in seconds

async function fetchUmamiData(startAt, endAt) {
  const url = `${API_BASE_URL}/api/websites/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`Error fetching data: ${response.statusText}`);
    return null;
  }

  return response.json();
}

async function handleRequest(event) {
  const cache = await caches.open(CACHE_KEY);
  const cachedResponse = await cache.match(event.request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const now = Date.now();
  const todayStart = new Date(now).setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(now - 86400000).setHours(0, 0, 0, 0);
  const lastMonthStart = new Date(now).setMonth(new Date(now).getMonth() - 1);
  const lastYearStart = new Date(now).setFullYear(new Date(now).getFullYear() - 1);

  const [todayData, yesterdayData, lastMonthData, lastYearData] = await Promise.all([
    fetchUmamiData(todayStart, now),
    fetchUmamiData(yesterdayStart, todayStart),
    fetchUmamiData(lastMonthStart, now),
    fetchUmamiData(lastYearStart, now)
  ]);

  const responseData = {
    today_uv: todayData?.visitors?.value ?? null,
    today_pv: todayData?.pageviews?.value ?? null,
    yesterday_uv: yesterdayData?.visitors?.value ?? null,
    yesterday_pv: yesterdayData?.pageviews?.value ?? null,
    last_month_pv: lastMonthData?.pageviews?.value ?? null,
    last_year_pv: lastYearData?.pageviews?.value ?? null
  };

  const jsonResponse = new Response(JSON.stringify(responseData), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });

  event.waitUntil(cache.put(event.request, jsonResponse.clone()));

  return jsonResponse;
}
```

　　但是里面有几个比较重要的参数需要修改`API_BASE_URL`​、`TOKEN`​、`WEBSITE_ID`​其中`API_BASE_URL`​和`WEBSITE_ID`​已经是有的，`WEBSITE_ID`​在<kbd>umami</kbd>​中的设置，选择你已经添加好的网站，点击<kbd>编辑</kbd>​，会出现网站的`WEBSITE_ID`​：

![](https://s2.loli.net/2025/04/06/eFHEYB45nQOUAML.webp)

　　 2.2 获取<kbd>token</kbd>​，在想<kbd>api</kbd>​测试网站，[hoppscotch](https://hoppscotch.io/)，跳转到这个页面以后，如下图所示

![](https://s2.loli.net/2025/04/06/vXrQmtpu4HdIasN.webp)

　　  2.2.1 请求方式选择<kbd>post</kbd>​，链接填写方式是：

```
https://你的umami域名或者是链接/api/auth/login
```

　　  2.2.2 请求体选择<kbd>Body</kbd>​参数格式选择<kbd>application/json</kbd>

```
{
 "username":"用户名",
 "password":"密码"
}
```

　　  2.2.3 返回结果中<kbd>token</kbd>​里面的内容就是需要的<kbd>token</kbd>

```
{
  "token": "你的token", # 你需要记录下来的内容
  "user": {
    "id": "41e2b680-648e-4b09-bcd7-3e2b10c06264",
    "username": "admin",
    "role": "admin",
    "createdAt": "2024-11-12T09:18:12.766Z",
    "isAdmin": true
  }
}
```

　　到这里，你部署`api`​所需要的所有参数内容都已经有了，给替换进去即可。

　　 2.3 测试在你部署好以后，会有一个链接，当然你如果是用<kbd>cloudflare</kbd>​代理你的域名，可以直接进行关联。

![](https://s2.loli.net/2025/04/07/IPCS2rhLbiaX3G8.webp)

　　然后点击或则是复制粘贴到浏览器，请求以后会出来下面的结果：

![](https://s2.loli.net/2025/04/07/M9wsiYKBoGyLI8T.webp)

　　如果没有结果，建议你先去你部署的umami面板里面看看有没有数据，有数据的情况下，这里请求都会有数据的，清理浏览器缓存开代理在测试。

## 第三部分：添加博客统计

　　将数据添加到<kbd>about</kbd>​页面

```
tj: # 统计
  provider: custom # custom
  url: 你的数据接口地址
  img: https://7.isyangs.cn/1/65eb2e9109826-1.png # 背景
  desc: # 卡片左下角描述
```

　　配置完成~

　　感谢[starsharbor](https://blog.starsharbor.com/)大佬博客的指导，[原文](https://blog.starsharbor.com/posts/solitude-about_umami/)

---

## 作者原文

作者: Couture
链接: https://www.coutures.top/posts/27233.html
来源: Couture
著作权归作者所有。 商业转载请联系作者获得授权，非商业转载请注明出处。
