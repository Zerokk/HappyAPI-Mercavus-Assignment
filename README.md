# ⚡️ Mercavus_Assignment ⚡️
### Aka API_HAPI, a happy api made in Hapi!

This is the repository for the Mercavus assignment. As requested, it's done with Node, Hapi and Mongoose.
For the database, you can use a simple Docker MongoDB repository, or any Mongo database you can refer from the code, which is
easily customizable.

### How the frontend looks like:

![Image of the frontend app](https://i.imgur.com/kA1yqVD.jpeg)

### Folder structure:

![Folder structure](https://i.imgur.com/GC64UE5.png)


Here are some specifications of the project:

- This backend project is made to ease the creation of REST APIs for the given Mongoose schemas. It makes super easy to create all the API with just writing a Typescript definition of what the objects of a collection should look like.
- This project tries to follow the SOLID principles.
- There are some tests for checking whether the app startup and RESTify process is going well.
- All the parts of the process are dynamic, extensible and interchangeable. This means that you can extend a class in order to achieve some custom functionality. The customizable parts of the whole app are the following:
     1. The MongoDB connection.
     2. Mongo connection events.
     3. The class that handles all operations around routing, static files serving, and sets up controllers at endpoints.
     4. All object definitions that serve as parameters to functions and constructors, are properly declared as Typescript interfaces, which allows not only a good IDE linting, but also the ability to compose these objects in case it's needed. Same for enumerators.
     5. The information needed to setup the server correctly, should be provided by the "environments" file.
     4. The class that RESTifies a given model, and all its parts (route handlers, default options, and request validators). The default one is generic and can handle everything, including pagination, although it may (and usually is) necessary to write some more business logic at some API endpoints. That can be easily done extending some of its methods while still using the ones that stay in the superclass.
     5. The DAO that actually does the CRUD operations. It has a default DAO that is useful for most cases, although it's programmed against an abstract class, which allows the final programmer to write its own access-level logic.
     
     
You have more info in the email I sent you!

Thank you a lot for this interesting assignment, I actually enjoyed a lot while learning and building it 😄! 
