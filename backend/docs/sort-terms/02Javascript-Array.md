# How javascript stores Arrays in memory?

    1. Javascript arrays are dynamic, flexible and sparse, so internally they work differently.
    2. It stores in the form of objects (like dictornaries)
    3. Most Modern engines (Chromse v8, Node.js) optimize arrays using hidden classes and elements.
    4. V8 uses two nodes:
        a. Packed Elements: Gives high speed and stores in the form of compact and continous.
        b. Sparse/ Holes more: Slow and uses more memory

## What happens when the array gets too large?

    1. If i store too much values, RAM will be fill up. 
    2. Garbage Collector works Hard. It uses automatic garbage collection. 
    3. HashNode (Dictornary Mode) becomes very slow.
    4. If the array becomes sparse, (lots  of empty indexex, v8 switches to dictionary node, whihc is slow because )
