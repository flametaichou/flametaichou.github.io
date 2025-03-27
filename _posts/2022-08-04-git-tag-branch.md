---
layout: post
title: "Git: Which branch is the tag on?"
date: 2022-08-04
description: How to obtain `CI_COMMIT_BRANCH` in tag pipelines and why it can be a bad idea
categories: notes
lang: en
tags:
  - Git
  - GitLab
---

To build your pipelines, you may need the name of the branch on which the pipeline is running. In most cases,  the predefined variables `CI_COMMIT_BRANCH` or `CI_COMMIT_REF_NAME` can be used for this. According to [GitLab Docs](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html):

> **CI_COMMIT_BRANCH** - The commit branch name. Available in branch pipelines, including pipelines for the default branch. Not available in merge request pipelines or *tag pipelines*
> 
> **CI_COMMIT_REF_NAME** - The branch or *tag* name for which project is built

But what if I want to know on which branch my *tag pipeline* was started?

### Why is this a question?

This questions can seem nonsensical for an experienced git user, but it is not obvious why. There seems to be some kind of misunderstanding about this question. Here are some links on GitLab issues with similar questions that I've found during my research: [(1)](https://gitlab.com/gitlab-org/gitlab/-/issues/34578#note_375830333), [(2)](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/26548),[(3)](https://gitlab.com/gitlab-org/gitlab-foss/-/issues/27818)

I think I'm not the only one who looked for the answer; that's why I want to share a detailed answer here.

### Explanation

Firstly, let's clarify the misconception of "the branch of the tag". 

1. Tags in git are very similar to branches; they both are just the references to commits. So, tags are not connected with branches; they are connected with commits. 
2. One commit can be contained by multiple branches. 
3. The original branch from which the tag was created may be deleted at all, and the tag may still be present in other branches.

So, technically, *there is no direct connection between tag and branch*. Moreover, *multiple branches can contain the same tag*. We cannot be sure that there are no other branches containing the tagged commit. And we cannot be sure that the existing branch containing the tag is the original one.

Here are some examples: 
1. Create new tag `tag1` on a branch `develop`, then create branch `feature` from `develop`. Tag `tag1` will be in both `develop` and `feature` branches. 
2. Create a new tag `tag2` on the `develop` branch, then merge it into the `main`. Tag `tag2` will be in both `develop` and `main` branches.

![Git Tags Example](/data/images/posts/git_tags.png)

But practically, in most cases, only one branch will contain the tag when it's created and the pipeline starts. So there might be a workaround here.

Now, when it's clear that it is not possible to get a branch of the tag and why `CI_COMMIT_BRANCH` is empty in tags pipelines, we can move on to solutions.

### Possible solutions

There is no universal solution, but there are some workarounds. Most of them implement the same concept: you cannot obtain the branch, but you can list all branches, filter them, order, and take the first one.

Several ways to do this are discussed on this [StackOverflow topic](https://stackoverflow.com/questions/15806448/git-how-to-find-out-on-which-branch-a-tag-is), each with its own pros and cons.

In my case, [this one by Swags](https://stackoverflow.com/a/62302147) became the most useful. I used it to redefine a `CI_COMMIT_BRANCH` variable in the `before_script` section.

```yaml
before_script:
  - CI_COMMIT_BRANCH=$(git ls-remote --heads origin | grep $CI_COMMIT_SHORT_SHA  | sed "s/.*\///")
```

It lists only the heads of remote branches and takes the first one that matches with the `CI_COMMIT_SHORT_SHA`. Now `CI_COMMIT_BRANCH` is not empty even in tag pipelines.

> **Note**: This will require `git` installed on your base image.

The main disadvantage of this method is that it will only work when you're tagging the heads of the branches. But when you are, it works well.
### Conclusion

Later, I decided that it would be better to build pipelines logic based on tags names and regular expressions rather than branch names. So, as for me, I want to leave here this tip:

> **Tip**: Don't try to find out on which branch the tag was created. It would be better to establish cleaner tag naming conventions.

But who knows, maybe this note will be helpful for someone else.

### Links

- <https://stackoverflow.com/questions/15806448/git-how-to-find-out-on-which-branch-a-tag-is>
- <https://stackoverflow.com/questions/14613540/do-git-tags-only-apply-to-the-current-branch>
