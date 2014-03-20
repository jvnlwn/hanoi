###hanoi
An example of recursion used by Douglas Crockford in his book *JavaScript: The Good Parts*.

    var hanoi = function (disc, src, aux, dst) {

        if (disc > 0) {
            hanoi(disc - 1, src, dst, aux);
            console.log('Move disc ' + disc + ' from ' + src + ' to ' + dst);
            hanoi(disc - 1, aux, src, dst);
        }
    }

    hanoi(3, 'Src', 'Dst', 'Aux');


Outputs
      
    Move disc 1 from Src to Aux
    Move disc 2 from Src to Dst
    Move disc 1 from Aux to Dst
    Move disc 3 from Src to Aux
    Move disc 1 from Dst to Src
    Move disc 2 from Dst to Aux
    Move disc 1 from Src to Aux

### My Version
I have used recursion and believe I understand the concept, but this example had me quite perplexed. In an attempt of understanding this function, I modified the original function by adding my own console.logs:

    var hanoi = function (disc, src, aux, dst) {
    
        if (disc > 0) {
            hanoi(disc - 1, src, dst, aux);
            console.log('first call: ', disc);
            hanoi(disc - 1, aux, src, dst);
            console.log('second call: ', disc);
        } else {
            console.log('end: ', disc);
        }
    }
    
    hanoi(3, 'Src', 'Dst', 'Aux');
    
Outputs

    end:  0
    first call:   1
    end:  0
    second call:  1
    first call:   2
    end:  0
    first call:   1
    end:  0
    second call:  1
    second call:  2
    first call:   3
    end:  0
    first call:   1
    end:  0
    second call:  1
    first call:   2
    end:  0
    first call:   1
    end:  0
    second call:  1
    second call:  2
    second call:  3
    
### Let's Dig a Little Deeper
It honestly surpised me to see the first log was 'end: 0'. I didn't anticipate the disc value reaching zero that soon. The order that the numbers were logged confused me even more, though they appeared to match the original output. If you compare the original values logged for disc and the ones for 'first call' above, you'll see they match perfectly, as they should.

So, what is going on here? Well, `hanoi` is called until `disc > 0` is no longer `true`. This is when we get our first log 'end: 0'. Have you seen the film Inception? We're a number of dreams deep in this function and 'end: 0' is like the first 'kick' to bring us back to reality. `disc` hitting 0 broke us out of the recursive loop and we begin to bubble back up through the previous recursive calls.

So, we've bubbled up into the previous scope where `disc` was 1. We immediately hit the second log 'first call: 1' followed by the second recursive call, going back into a deeper dream, right? We immediately get another 'kick' ('end: 0') because `disc` is 0 again. (Everytime a recursive call is made, the value of disc is decreased by 1. `disc` was 1 in the previous scope, therefore, one level deeper, it's value is 0).

Now, we've bubble back up into the previuos scope we were just in, where `disc` was 1. We just came out of the second recursive call in that scope, so 'second call: 1' is logged. There is nothing left to process in the current scope, so we break out and bubble back up to the scope above where `disc` is 2. Can you follow what happens next?

### Diagram!
Let me now introduce this simple diagram:
        
```
              3                 -               3
```
```
      2       -        2                2       -        2
```
```
  1   -    1       1   -    1       1   -    1       1   -    1  
```
```
  0        0       0        0       0        0       0        0
```

Unfortunately, this is the best visual representation I can do here. Each number represents one `hanoi` call. Each separate line represents a scope, though only the numbers that have forked down from the same parent actually share the same scope. This diagram matches my modified function's output. The first log is represented by the bottom-left 0. The last log is represtented by the top-right 3. So, this diagram is read top to bottom, left to right.

The top line (3 3), is our first call to the function. `disc` is 3. Each following call decrements `disc` (3 -> 2 -> 1 -> 0) till zero is reached. We log 'end: 0', bubble up, log 'first call: 1', move horizontal in scope, recurse till we hit zero (1 -> 0), log 'end: 0', bubble up, log 'second call: 1', bubble up, log 'first call: 2', move horizontal in scope, recurse till we hit zero (2 -> 1 -> 0). . . and so on.

###Diagram Revised!

In the following revised diagram, we emphasize the values logged from the original function. If we read this in the order we described, the order would be 1 2 1 3 1 2 1, exactly how the order appears in the original output. Notice how all the left-side numbers in a given scope are emphasised and none of the right-side numbers are emphasized. This is because a left-side number represent the first recursive call in a given scope and the right-side number represent the second recursice call in that scope.
        
```
               [3]               -                  3
```
```
      [2]       -        2                [2]       -        2
```
```
 [1]   -    1      [1]   -    1      [1]   -    1      [1]   -    1  
```
```
  0         0       0         0       0         0       0         0
```
### Additional Thoughts
I think you get the picture. How on earth, though, do we get the correct output for what disc is to be moved? That is definitely another conundrum. .
