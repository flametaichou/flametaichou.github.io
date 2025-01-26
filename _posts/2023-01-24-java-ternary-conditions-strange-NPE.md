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

One day my coworker sent me a code snippet with a simple question "What will be written in test2 variable?":
```java
Boolean test = null;
Boolean test2 = (true) ? test : false;
```

I answered "null", but it was a wrong answer. The right answer was:
> Exception in thread "main" java.lang.NullPointerException

🤯

It blew my mind, and I wrote a small example to check it: 

```java
public static void main(String[] args) {
    Boolean test = null;
    System.out.println((true) ? null : false); // null
    System.out.println((true) ? test : false); // Exception in thread "main" java.lang.NullPointerException 
}
```

The example had proved it.

The problem is definitely in unboxing. In this case, java unboxes the argument `test` (that is `Boolean`) into `boolean`, and then boxes it
again into `Boolean` to apply the result to `test2`. The error occurs because of unboxing `null` into `boolean`. The unboxing of `null` causes 
`NullPointerException`.

But why this unboxing occurs? And why using `null` constant is working?

I decided to find answers to these questions.

#### Explanation

According to [Java Language Specification](https://docs.oracle.com/javase/specs/jls/se7/html/jls-15.html#jls-15.25):

> The type of a conditional expression is determined as follows:
> - If the second and third operands have the same type (which may be the null type), then that is the type of the conditional expression.
> - If one of the second and third operands is of primitive type T, and the type of the other is the result of applying boxing conversion (§5.1.7) to T, then the type of the conditional expression is T.
> - If one of the second and third operands is of the null type and the type of the other is a reference type, then the type of the conditional expression is that reference type.  
> - ...

**So, the unboxing occurs following specifications, and the `null` constant is not unboxed because the type of first operand 
is `null` and not a `Boolean`.**

For better understanding, let's take a look at all possible combinations of operands:

```java
public static void main(String[] args) {

    // First operand has null type, second operand has Boolean type
    System.out.println((true) ? null : (Boolean) false); // null

    // First operand has null type, second operand has Boolean type
    System.out.println((true) ? null : Boolean.FALSE); // null

    // First operand has null type, second operand has boolean type
    System.out.println((true) ? null : false); // null
}
```

No errors occur in these cases because second operand type is always `null` and it never being unboxed.

```java
public static void main(String[] args) {

    // First operand has Boolean type, second operand has Boolean type
    System.out.println((true) ? (Boolean) null : (Boolean) false); // null

    // First operand has Boolean type, second operand has Boolean type
    System.out.println((true) ? (Boolean) null : Boolean.FALSE); // null

    // First operand has Boolean type, second operand has Boolean type
    System.out.println((true) ? (Boolean) null : false); // Exception in thread "main" java.lang.NullPointerException
}
```

Error has been occurred in third case because type of second operand is the result of applying boxing conversion to type 
of third operand. But first and second cases return `null` because both operands have `Boolean` type.

```java
public static void main(String[] args) {
    Boolean test = null;

    // First operand is the variable of Boolean type, second operand has Boolean type
    System.out.println((true) ? test : (Boolean) false); // null

    // First operand is the variable of Boolean type, second operand has Boolean type
    System.out.println((true) ? test : Boolean.FALSE); // null

    // First operand is the variable of Boolean type, second operand has Boolean type
    System.out.println((true) ? test : false); // Exception in thread "main" java.lang.NullPointerException
}
```

All the same to previous example. That's our case! Now I know that `NullPointerException` in the question can be fixed 
by changing the type of the third operand to `Boolean`.

*All of these examples are fair to another primitive types as well, not only `boolean`.*

#### Conclusion

Usually questions of type "What will return this expression?" are related to JavaScript, and this was the first time I 
was surprised by such a question in Java.

As for me, this behavior of ternary expressions is not obvious. To be honest, even after
I understood the reason of this error, I am not sure that I completely understand why auto-unboxing is needed here.

I guess it works in that way because it is easier for programmers to write code. But I'd prefer to make this unboxing
by myself (when it is necessary) to avoid such errors. That's why I want to note this tip here:

> **Tip:** Avoid usage of both primitive and wrapper types in one ternary condition. Unbox them or cast to wrapper to make
> operand types equivalent
>
 
#### Links

I used information from two StackOverflow topics 
([[1]](https://stackoverflow.com/questions/38095615/java-ternary-conditions-strange-null-pointer-exception), 
[[2]](https://stackoverflow.com/questions/12763983/nullpointerexception-through-auto-boxing-behavior-of-java-ternary-operator)) 
to write this note