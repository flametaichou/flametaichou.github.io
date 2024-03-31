---
layout: post
title: Two different spaces
date: 2021-11-18
description: 
categories: notes
cover_image: 
lang: en
tags:
---

There are two types of space characters - **Space** and **Non-breaking space**. They look identical, but they are the different symbols,
and they are not equal. I didn't know about it because I haven't worked with typography a lot. Non-breaking space is used to prevent
automatic line breaking.

| Name | Decimal code | NCR | HEX code | Unicode |
| --- | --- | --- | --- | --- |
| Space ( ) | 32 | `&#32;` | 20 | `U+0020` |
| Non-breaking space ( ) | 160 | `&#160;` | A0 | `U+00A0` |

I discovered it when I worked on the reporting system. I had to pass a test by comparing
`.xlsx` spreadsheets built with this system with the same files built with [BIRT](https://projects.eclipse.org/projects/technology.birt). Reports
were compared by scripts, row-by-row. I fixed all the differences that I could notice, but the test was still failed.

Cells in both files visually looked the same. There were numbers with spaces as decimal separators. 

![| 58 971 713 | 58 971 713 |](/data/images/posts/difference-between-cells.png)
*Are they different?*

I decided to copy its values to IDE and compare them by `Ctrl + F`. Search had to show two matches, but the match was only one.
Cell values were not the same! I started comparing strings one symbol after another and found that the difference was in spaces.

Quick test written in JS showed the difference:
```javascript
'58 971 713'.charCodeAt(2);
// > 160

'58 971 713'.charCodeAt(2);
// > 32
```

BIRT used non-breaking space as the decimal separator (and it was correct), and I used the common space in my reporting system. 

### Conclusion

Different symbols can look the same (for example: latin `c` and cyrillic `с`). Space is one of these symbols, too. 
It can be just a space, or non-breaking space.

Even if these symbols look similar, they are different for computers and software. 
This detail, invisible for a human eye, can be the reason of an error.

*BTW, there are more types of spaces, but they don't look like the common space. Here they are:*

| Name | Decimal code | NCR | HEX code | Unicode |
| --- | --- | --- | --- | --- |
| En space ( ) | 8194 | `&#8194;` | 2002 | `U+2002` |
| Em space ( ) | 8195 | `&#8195;` | 2003 | `U+2003` |
| Narrow non-breaking space ( ) | 8239 | `&#8239;` | 202F | `U+202F` |
| Figure space ( ) | 8199 | `&#8199;` | 2007 | `U+2007` |

*[NCR]: Numeric character reference