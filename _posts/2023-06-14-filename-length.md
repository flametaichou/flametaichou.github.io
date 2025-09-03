---
layout: post
title: Reaching maximum filename lengths
date: 2023-06-14
description: 
categories: notes
cover_image: 
lang: en
tags:
---

I ran into a `java.io.FileNotFoundException: … (File name too long)` error one day, and it turned out to be much deeper than it seems. That’s why I started exploring it, and wrote this note.

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

So, it is simple for NTFS: it stores filenames in UTF-16 encoding, and the limit is 255 UTF-16 characters. So, the maximum filename length is 255 characters (but it is not so simple for Windows, because its maximum filename depends not only on a filesystem limitation. You can find the explanation [here](https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file))

> Remember that the filename is the name + extension (like `.txt`). Windows hides files extensions by default.

For filesystems with limitation in bytes it is a little bit more sophisticated: characters can have different weight in bytes 
(it depends on encoding used), so the maximum filename length in characters can vary for different names.

For example: most of popular Linux distros use UTF-8 as system encoding by default. In this case, filenames are
encoded in UTF-8 bytes, and every character can weight 1-4 bytes (which is different from UTF-16 where every character can weight 2 or 4 bytes). So, the limit can be 23-255 characters depending on which characters are used in filename.

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
// Use UTF_16LE or UTF_16BE for UTF-16 if you don't BOM to be included in the count
System.out.println(filename.getBytes(StandardCharsets.UTF_8).length); 
```

### Examples 
Here are examples of how the characters used in a filename can affect the filename limit when the limitation is specified in bytes:

#### Example 1

> `filename.txt`

| Characters | UTF-8 bytes | UTF-16 bytes |
| 12  | 12 | 24 |

One latin character weight in UTF-8 is 1 byte, so filename size in characters is equal to the size in bytes in this case.

#### Example 2

> `имяфайла.txt`

| Characters | UTF-8 bytes | UTF-16 bytes |
| 12  | 20 | 24 |

One cyrillic character weight in UTF-8 is 2 bytes, so filename size in characters is not equal to the size in bytes. 

#### Example 3

> `wpDhyBnwSBLwLMGVaMTZiROKnxjgUXtEPvDtJDSKfsurnSkmLLOShVQAzbAASHuyKuzBzwWfslkaLKtNvhTFtkuHJJawqDQsmNVkkXiQRZiYIiTJRUXpBxGYZDrbasZNoChyJEVQVGFScoelxfLZUdyomoncLvoGjgFNiCcbmlFDmvGHHYSkNRYobrkqzBqyGqClpzuMCkFgwiZqvMzwbgUsggIUEwfoZeOpWGzSZnVDKoQRUGAxsGkBzzI.txt`

| Characters | UTF-8 bytes | UTF-16 bytes |
| 255  | 255 | 510 |

This is an example of the maximum filename length consisting of latin characters. 

This file will be saved with a limit of 255 bytes.

#### Example 4

> `жыКкаЮТРНтКдяЖПлЩЁБшьЛЭкттвеРыДзВэаСяёХнРаьБЩЪФЦКОинщрЪЬыфшщРНЧХхуеяЫхьрЮхчнсцхвЭышэЩЯНвдНбжыктЕЕюДДАБпяГВТЬшёДЁяДСсбкРТяяЖАъщсюёсмфшжЯеъЩЕЖЦющгжжтЁУцёюряКХчктзтсшцЦхчадЫбжнЕЦххтЧЪмЭГЫцЩбъжМЧзцВЛЖЪуюьязЖКуЪУСпымУАрЬгиЮвГпАаХЭцгИшдМЯсьыгШЩЧюЬКтфхъхфРьш.txt`

| Characters | UTF-8 bytes | UTF-16 bytes |
| 255  | 506 | 510 |

This is an example of a filename of the same length as the previous one, but consisting of cyrillic characters.

Even thou, this file will not be saved in filesystems with 255 bytes filename limitation, because it contains cyrillic characters weighing 2 bytes in UTF-8 encoding. The filename has to be shorter by `(506 - 255) / 2 ≐ 126` characters to be saved.

#### Example 5

> `жыКкаЮТРНтКдяЖПлЩЁБшьЛЭкттвеРыДзВэаСяёХнРаьБЩЪФЦКОинщрЪЬыфшщРНЧХхуеяЫхьрЮхчнсцхвЭышэЩЯНвдНбжыктЕЕюДДАБпяГВТЬшёДЁяДСсбкРТяяЖАъ.txt`

| Characters | UTF-8 bytes | UTF-16 bytes |
| 129  | 254 | 258 |

This is an example of the maximum filename length consisting of cyrillic characters.

This file will be saved with a limit of 255 bytes.

### Conclusion 

To sum up: when the filesystem limit is set in bytes, the maximum filename length in characters will depend on the characters and encoding used. Different characters can have different weights.

This difference can be eliminated by using another encoding, for example character weight will be the same for latin and cyrillic characters in UTF-16, because the weight of any of these characters will be 2 bytes in this case. But be careful, it means that your latin characters shall not be stored as efficient as in UTF-8 (UTF-16 stores latin characters in 2 bytes instead of 1 in UTF-8).

It is also worth remembering that there are characters that are encoded in 3 or 4 bytes of UTF-8. In the case of 3 bytes, UTF-16 will be more efficient for storing them, because they will be stored in 2 bytes instead of 3.

### Related errors

Filename limitations can be the reason why, for example, file created on Windows with NTFS filesystem can not be saved on Linux with ext4 filesystem, or why the same filename can be allowed for Windows and not allowed for Linux.

### How file managers limit filename length

- Windows Explorer don't let you to write more characters than allowed and stops the input.
- [GNOME Files](https://apps.gnome.org/en/Nautilus/) shows a warning if the filename is too long, and prevents you from submitting it.

### Links
- <https://www.baeldung.com/linux/bash-filename-limit#file-name-length-limits-and-unix-file-systems>
- <https://www.baeldung.com/cs/unicode-character-bytes#utf-8-encoding>
- <https://learn.microsoft.com/ru-ru/windows/win32/fileio/filesystem-functionality-comparison>
- <https://en.wikipedia.org/wiki/Comparison_of_file_systems#Limits>