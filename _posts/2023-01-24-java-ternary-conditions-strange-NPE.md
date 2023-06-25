---
layout: post
title: Strange NPE in Java ternary condition
date: 2023-01-24
description: 
categories: notes
cover_image: 
lang: en
tags:
- Java
---

One day my colleague sent me a code snippet with simple question "what will be written in test2 variable?":
```java
Boolean test = null;
Boolean test2 = (true) ? test : false;
```

I answered "null", but it was a wrong answer. The right answer was:
> Exception in thread "main" java.lang.NullPointerException

It blew my mind, and I wrote a small example to check it: 

```java
public static void main(String[] args) {
    Boolean test = null;
    System.out.println((true) ? null : false); // null
    System.out.println((true) ? test : false); // Exception
}
```

The output was:
> null  
> Exception in thread "main" java.lang.NullPointerException  

🤯

Usually questions of type "what will return this expression?" are related to JavaScript, and this was the first time I was surprised by such question in Java.

---

The explanation was found in the first answer:
<https://stackoverflow.com/questions/38095615/java-ternary-conditions-strange-null-pointer-exception>

The cause of *NPE* is auto-unboxing of variable `test`. When one or two of the arguments in the expression are wrapper classes, they are both unboxed. The unboxing of *null* causes *Null pointer exception*.

So, in addition to the examples above, now I can say that the output of
```java
    Boolean test = null;
    System.out.println((true) ? null : false); // null
    System.out.println((true) ? test : (Boolean) false); // null
    System.out.println((true) ? test : Boolean.FALSE); // null
```

will be:
> null  
> null  
> null  