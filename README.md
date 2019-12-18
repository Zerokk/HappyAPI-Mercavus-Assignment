# ⚡️ Backend Mercavus Assignment ⚡️
### Aka API_HAPI, a happy api made in Hapi!

This is the repository for the Mercavus assignment. As requested, it's done with Node, Hapi and Mongoose.
For the database, you can use a simple Docker MongoDB repository, or any Mongo database you can refer from the code, which is
easily customizable.

### ⚙️ Installation
1. Clone the project
`git clone https://github.com/Zerokk/Mercavus_Assignment_APIHAPI.git`

2. Install packages with
`yarn install`
or
`npm install`

3. Modify the environment.ts so it points to a working MongoDB instance.

4. Compile Typescript to JavaScript files:
`tsc`

5. Execute with Node:
`node dist/index.js`


### 🌅 How the frontend looks like:

![Image of the frontend app](https://i.imgur.com/kA1yqVD.jpeg)

### 📁 Folder structure:

![Folder structure](https://i.imgur.com/GC64UE5.png)


### 🚀 Project special features:

- This backend project is made to ease the creation of REST APIs for the given Mongoose schemas. API creation is super simplified: **just write a Typescript definition of what your entity should look like, and all the CRUD operations and REST API will be created**.
- This project tries to follow the **SOLID** principles (although it would need a little bit more of attention to fully achieve this particular goal).
- Most of the project is well documented.
- There are some Mocha tests for checking whether the app startup and RESTify process are working correctly.
- All the parts of the process are **dynamic, extensible and interchangeable**. This means that you can extend most of the Typescript classes in order to achieve some custom functionality. Some of the most notorious customizable parts are the following:
     1. The MongoDB connection.
     2. Mongo connection events.
     3. The class that handles all operations around routing, static files serving, and sets up controllers at endpoints.
     4. All object definitions that serve as parameters to functions and constructors, are properly declared as Typescript interfaces, which allows not only a good IDE linting, but also the ability to compose these objects in case it's needed. Same for enumerators.
     5. The information needed to setup the server correctly, should be provided by the "environments" file.
     4. The class that RESTifies a given model, and all its parts (route handlers, default options, and request validators). The default one is generic and can handle a basic REST API behavior, although it may (and usually is) necessary to write some more business logic at some API endpoints. That can be easily done extending some of its methods while still reusing all the code from the superclass that you want to keep.
     5. The DAO that actually does the CRUD operations. It has a default DAO that is useful for most cases, although it's programmed against an abstract class, **which allows the final programmer to write its own custom access-level logic**.
     
     
     
### 🛠️ Lacking features:
Due to lack of time, these are features that the project currently lacks:
- Applying Swagger UI to the APIs. 
- Joi validators are not working. As I'm not used to this tool, I may be doing something wrong. I commented the part where these validators are applied, but you can see the abstractions I made around them to check how I was trying to achieve this.
- Proper logging with Winston.
- Better and deeper error handling.
- A much better frontend (but as specified in the email, this is not a priority in this project).
- Better encapsulation and an extra abstraction layer in the Handlers of the RESTifier.
- Documenting some parts.
     
You have more info in the email I sent you!

Thank you a lot for this interesting assignment, I actually enjoyed a lot while learning and building it 😄! 
