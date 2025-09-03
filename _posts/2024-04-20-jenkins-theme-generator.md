---
layout: post
title: Jenkins Theme Generator
date: 2024-04-20
description: 
categories: notes
cover_image: 
lang: en
tags:
- Blog
---

Do you like to customize things? I do. And [Jenkins](https://www.jenkins.io/) is not the exclusion. If you
would like to customize it like me, maybe you'll be interested in the
[Jenkins Theme Generator](https://flametaichou.github.io/jenkins-theme-generator/).

### The story

Previous versions of Jenkins looked outdated a bit, but there were a lot of themes that changed its appearance. I used Jenkins with [jenkins-neo2-theme](https://tobix.github.io/jenkins-neo2-theme/) (that is the fork of [jenkins-neo-theme](https://jenkins-contrib-themes.github.io/jenkins-neo-theme/)) for a long time.

In version `2.346.1` Jenkins got a fancy new appearance, including a complete restyling and a new set of icons.
But the compatibility with existing themes was broken. The author of neo2-theme has stopped its maintenance. But the new appearance was already great, so the need for a custom theme has become less urgent.

I wanted to change only two things:
- Some of the plugins icons were still not in the same style with the whole system
- I wanted to save the colors that I used to from neo2-theme 
(for example, header background color and dark background in console)

These things led me to create my custom theme.

### How Jenkins themes work

All Jenkins themes work on the same principle: overriding (or redefining) the default CSS styles. The possibility
of overriding styles is provided by multiple plugins. Some of them, such as the 
[dark-theme](https://plugins.jenkins.io/dark-theme/) or
[material-theme](https://plugins.jenkins.io/material-theme/)
provide they own CSS themes, 
while others, such as the
[simple-theme-plugin](https://plugins.jenkins.io/simple-theme-plugin/) or 
[theme-manager](https://plugins.jenkins.io/theme-manager/),
allow you to upload your own custom CSS.

Additionally, there are many tools, such as Chrome extensions, that can be used to change the CSS styles of a website and don't require you to be a Jenkins administrator.

### Making of

In the beginning, this project was about only one CSS theme than changed the background of the header, console, logo
and some plugins icons. There was no goal to drastically change the default theme; I only wanted
to make it similar to neo2.

But in the process, I noticed that I can make all color variables (not only the header color) configurable, 
and I liked that idea.

To accomplish this goal, I needed to connect CSS variables in Jenkins styles between them. **This was the most difficult part of the whole project**:

- Not all elements used color variables; many of them were colored directly with **HEX color values**. I needed to change it to make them configurable.
- There were about **100 variables in the code**, and I didn't want to make each one configurable. Most of them were shades of about 10 main colors, so I wanted to link them together. As a result, I wanted to be able to customize only the base color, which should affect all its shades. To do this, I used SASS functions like `lighten()` and `darken()`.

After that, I decided that icons can also be configurable, but much simpler than colors. I didn't want to configure every existing icon, just a few that needed replacement. So, I simply made a short list of icons that can be replaced.

> There is a [Jenkins Symbols](https://www.jenkins.io/doc/developer/views/symbols/) icons set
> that corresponds to Jenkins style guides. I discovered it when I looked for icons
> replacements.

*BTW, lately I noticed that the `Lockable resources plugin` and the `Schedule build plugin` have already changed their icons in the newest versions. So, changing their icons is only relevant for outdated versions.*

After adding the interface for picking colors and icons, the project was done.

### Lit.js

I used [lit.js](https://lit.dev/) to make this project. It was my first attempt to use it, and I want to make a note about it.

I wanted to try lit.js because of [`lit-html`](https://lit.dev/docs/v1/lit-html/introduction/). I already decided to host the project on GitHub Pages,
and the question was "Can I have the usual possibilities of modern JS frameworks without necessity of
compilation?" `lit-html` can be loaded directly from CDNs, and it's full of features. That's why
I chose it.

The most feature that I wondered was components. I understood that the project requires several components, 
like color pickers, and it will be more difficult to do it without them.

`lit-html` provided these possibilities for me, and I liked it. It is not the thing that I will use
in production projects, but it's very good for small and quick deals, like this pet-project.

The only thing that I want to notice is that to make a component, I needed to
implement two-way binding by myself. I used to have it "out of the box" in other JS frameworks, but
it was not so hard to implement it.

Otherwise, I'm excited about lit.js.

### Theme generator

I didn't know which term was more suitable for this tool:
generator, configurator, or customizer.

Configurator looks good, but I chose generator because I saw similar tools
that used the word "generator".

And, basically, this tool generates CSS, so... generator.

![Generator](/data/images/posts/generator.png)
*Not this one*

### Conclusion

I like the result: now I have not only one custom theme, but a tool that creates custom themes. I saw 
a lot of Jenkins instances with custom styling, mostly it was recolored header or replaced logo.
Personalization? Corporate branding? Anyway, I think it can be useful for someone else.

There are only two features, that I wanted to implement, but didn't:
- Make background configurable
- Make fonts configurable

Maybe next time.

### Links
- <https://www.jenkins.io/changelog-stable/#v2.346.1>
- <https://github.com/medialize/sass.js/blob/master/docs/getting-started.md#using-the-synchronous-api-in-the-browser>
- <https://github.com/lit/lit/issues/626>
- <https://jevisan.medium.com/two-way-data-binding-in-litelement-f9c2a2aec94e>
- <https://medium.com/collaborne-engineering/litelement-two-way-data-binding-48aec4692f7e>
- <https://stackblitz.com/edit/lit-element-two-way-data-binding?file=index.ts>

