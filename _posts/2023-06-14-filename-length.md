---
layout: post
title: Filename length
date: 2023-06-14
description: 
categories: notes
cover_image: 
lang: en
tags:
---

The most widely used Linux filesystems have **255 bytes** maximum filename length, meanwhile Microsoft-related filesystems have 
the limit of **255 characters**. 

Here is the comparison table:

| Filesystem | Max. filename length |
| --- | --- |
| ext2 | 255 bytes |
| ext3 | 255 bytes |
| ext4 | 255 bytes |
| BTRFS | 255 bytes |
| XFS | 255 bytes |
| ZFS | 255 bytes |
| FAT32 | 255 UCS-2 characters with LFN |
| exFAT | 255 UTF-16 characters |
| NTFS | 255 UTF-16 characters |

So, it is simple for NTFS: it stores filenames in UTF-16 encoding, and the limit is 255 UTF-16 characters. So, the maximum filename length is 255 characters
(but it is not so simple for Windows, because its maximum filename depends not only on a filesystem limitation. You can find explanation 
[here](https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file))

> Remember that the filename is the name + extension (like `.txt`). Windows hides files extensions by default.

For filesystems with limitation in bytes it is a little bit more sophisticated: characters can have different weight in bytes 
(it depends on encoding used), so the maximum filename length in characters can vary for different names.

For example: most of popular Linux distros use UTF-8 as system encoding by default. In this case, filenames are
encoded in UTF-8 bytes, and every character can weight 1-8 bytes ('TODO' different to UTF-16 where every character can weight 2-8 bytes).
So, the limit can be 23-255 characters depening on which characters are used in filename.

### Counting bytes
Here are the examples of how filename bytes can be counted:

Bash:
```bash
FILENAME="filename.txt"; 

# It uses system encoding, for me it is UTF-8
echo -n $FILENAME | wc -c; 
```

JavaScript:
```javascript
const filename = 'filename.txt';

// Encodes always in UTF-8
console.log(new TextEncoder().encode(filename).length); 
```

Java:
```java
String filename = "filename.txt";

// You can pass the encoding as a parameter
System.out.println(filename.getBytes(StandardCharsets.UTF_8).length); 
```

### Examples 
Here are the examples of how characters used in filename can affect on filename limitation (only relevant when in bytes):

#### Example 1

> `filename.txt`

| Symbols | UTF-8 bytes | UTF-16 bytes |
| 12  | 12 | 26 |

Latin symbols' weight in UTF-8 is 1 byte, so filename size in symbols is equal to the size in bytes in this case.

#### Example 2

> `имяфайла.txt`

| Symbols | UTF-8 bytes | UTF-16 bytes |
| 12  | 20 | 26 |

Cyrillic symbols' weight in UTF-8 is 2 bytes, so filename size in symbols is not equal to the size in bytes. 

#### Example 3

> `wpDhyBnwSBLwLMGVaMTZiROKnxjgUXtEPvDtJDSKfsurnSkmLLOShVQAzbAASHuyKuzBzwWfslkaLKtNvhTFtkuHJJawqDQsmNVkkXiQRZiYIiTJRUXpBxGYZDrbasZNoChyJEVQVGFScoelxfLZUdyomoncLvoGjgFNiCcbmlFDmvGHHYSkNRYobrkqzBqyGqClpzuMCkFgwiZqvMzwbgUsggIUEwfoZeOpWGzSZnVDKoQRUGAxsGkBzzI.txt`

| Symbols | UTF-8 bytes | UTF-16 bytes |
| 255  | 255 | 512 |

This is an example of maximum filename length.

#### Example 4

> `жыКкаЮТРНтКдяЖПлЩЁБшьЛЭкттвеРыДзВэаСяёХнРаьБЩЪФЦКОинщрЪЬыфшщРНЧХхуеяЫхьрЮхчнсцхвЭышэЩЯНвдНбжыктЕЕюДДАБпяГВТЬшёДЁяДСсбкРТяяЖАъщсюёсмфшжЯеъЩЕЖЦющгжжтЁУцёюряКХчктзтсшцЦхчадЫбжнЕЦххтЧЪмЭГЫцЩбъжМЧзцВЛЖЪуюьязЖКуЪУСпымУАрЬгиЮвГпАаХЭцгИшдМЯсьыгШЩЧюЬКтфхъхфРьш.txt`

| Symbols | UTF-8 bytes | UTF-16 bytes |
| 255  | 506 | 512 |

This file will not be saved in filesystems with 255 bytes filename limitations even though it is 255 symbols as the previous one,
because it contains cyrillic letters that weight 2 bytes in UTF-8 encoding. Filename has to be shorter by `(506 - 255) / 2 ≐ 126` symbols to be saved

#### Example 5

> `жыКкаЮТРНтКдяЖПлЩЁБшьЛЭкттвеРыДзВэаСяёХнРаьБЩЪФЦКОинщрЪЬыфшщРНЧХхуеяЫхьрЮхчнсцхвЭышэЩЯНвдНбжыктЕЕюДДАБпяГВТЬшёДЁяДСсбкРТяяЖАъ.txt`

| Symbols | UTF-8 bytes | UTF-16 bytes |
| 129  | 254 | 260 |

This file will be saved. 

To sum up, if the filesystem limitation is in bytes, the filename length limit in symbols will depend on the symbols used.
And, as you can see, there is no difference for UTF-16, because UTF-16 is not so efficient for storing latin symbols. 
(TODO: stores latin symbols in two bytes?)

### Related errors

Filename limitations can be the reason why, for example, file created on Windows with NTFS filesystem can not be saved on Linux with ext4 filesystem, 
or why the same filename can be allowed for Windows and not allowed for Linux.

### How file managers limit filename length

- Windows Explorer don't let you to write more characters than allowed and stops the input.
- [GNOME Files](https://apps.gnome.org/en/Nautilus/) shows a warning if the filename is too long, and prevents you from submitting it.

### Links
- <https://www.baeldung.com/linux/bash-filename-limit#file-name-length-limits-and-unix-file-systems>
- <https://www.baeldung.com/cs/unicode-character-bytes#utf-8-encoding>
- <https://learn.microsoft.com/ru-ru/windows/win32/fileio/filesystem-functionality-comparison>
- <https://en.wikipedia.org/wiki/Comparison_of_file_systems#Limits>