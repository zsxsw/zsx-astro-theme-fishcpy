---
title: Git 同步上游仓库的更新
description: 使用一个 Github Template 创建了我自己的仓库，需要同步一下补丁更新，总不能自己手抄一遍吧，搜了一下解决方案。记录一下。
published: 2025-04-04
pinned: false
image: https://i1.wp.com/dev.ruom.top/i/2025/04/07/995956.webp
tags: 
  - Git
  - GitHub
category: 技术分享
# licenseName: "Unlicensed"
author: 克喵爱吃卤面
# sourceLink: "https://github.com/emn178/markdown"
draft: false
---
## Git 同步上游仓库的更新

　　使用一个 Github Template 创建了我自己的仓库，需要同步一下补丁更新，总不能自己手抄一遍吧，搜了一下解决方案。

　　记录一下。

### 添加上游仓库

　　给上游仓库取个名字，如果将命名为 `upstream` ，可以在本地仓库中运行以下命令：

```sh
git remote add upstream https://github.com/$<upstream-repo>.git
```

### 获取上游仓库的更改

　　运行以下命令以获取上游仓库中的所有分支和提交：

```sh
git fetch upstream
```

### 合并上游更改

　　现在，将上游 main 分支的更改合并到您的本地 main 分支：

```sh
git merge upstream/main --allow-unrelated-histories
```

　　如果只需要合并特定的 commit ：

```sh
git cherry-pick <commit-hash>
```

　　也可以使用

```sh
gcp <commit-hash>
```

　　commit-hash 可以直接从 github 网页上复制。

　　这时 commit 的作者是源仓库的作者， Vercel 提示我 Build 失败，需要升级到 Pro，可以再修改一个文件，自己添加一条 commit 。

　　当然这很不优雅，可以使用下面的命令获取更改到文件，但是不会提交 commit ，

```sh
git cherry-pick <commit-hash> --no-commit
```

　　然后手动提交一下

```sh
git commit -m "commit information"
```

### 解决冲突

　　如何自己已经修改过源代码，在合并过程中可能发生冲突，需要手动解决。
Git 也会进行提示，手动编辑冲突文件并保存，然后再提交更改。

### 批量提交

```sh
git cherry-pick <起始提交>^..<结束提交>
```

　　如果有冲突会按照顺序处理，然后执行， continue 直到结束

```sh
git cherry-pick --continue
```

* `<起始提交>`：范围的开始点（不包含此提交，除非用 \<起始提交\>\~ 或 \<起始提交\>\^）。
* `<结束提交>`：范围的结束点（包含此提交）。
* `^` 是 Git 的语法，用于指定“之前的提交”。
* `..` 表示范围。

### 推送

```sh
git push origin main
```

　　当然默认来说，并不会推送到新加入的 `upstream` ，直接 `git push` 即可

　　如果不再需要同步，可以删除上游的仓库

```sh
git remote remove upstream
```
