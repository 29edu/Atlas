
# New Concepts

    1. createdAt = new Date(); // creates object. I can perform methods like getFullYear(), getMonth(), toISOString().
    2. createdAt = new Date().toISOString(); // It creates date in string format. 
    3. Object is mainly used in mongoDB. String date is mainly used in json/API because json cannot store the Date Object properly.
    4. const dateObj = new Date(createdAt); // to convert date from string to object
    5. to check the type we can use the typeof dateObj
    6. If the date is invalid then, it will retun Nan
    7. Object Inside are Properties so object ke andar properties rahta hai.