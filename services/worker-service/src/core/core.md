# Problem 1

    A problem comes in designing inMemory Queue, A class is created with different methods and this method is used to store the different task. Now suppose an another instance of class is created in another file and with this a new array to store tasks is created. Suppose if the two workers from two arrays try to access the same task, this could create race condition and many problems. So to prevent this, a concept is called :arrow_forward:**Singleton** used in industry so that a single instance of a class is created only in the entire application and everyone uses that same object. 

    Redis Queue vs Memory Queue

    Memory Queue is designed to handle task using RAM and temporary and the Redis Queue is designed using redis to handle the task more efficiently.