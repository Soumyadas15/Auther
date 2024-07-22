
# Auther - Pre-built authentication templates

  

This a backend with pre-built authentication made using Nodejs and Typescript. Follow the instructions below to clone the repository and run the application.

## Current frameworks

![image](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)

![image](https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=FASTAPI&logoColor=white)

![image](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)

![image](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)


## Frontend

![image](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

![image](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)


## Prerequisites


Ensure you have the following installed on your system:

- [Git](https://git-scm.com/)
  

## Getting Started

  

### Clone the Repository

  

First, clone the repository using Git:

 
```sh
git  clone  https://github.com/Soumyadas15/auther
```

Move to project directory
```sh
cd auther
```

### Choosing a backend

Move to 'backend' directory
```sh
cd backends
```

After visiting the backends directory, select your preferred framework and follow its documentation.

### Running the frontend locally

After running the backend, navigate to the project directory using
```sh
cd ..
cd ..
```
Then navigate to the frontend directory
```sh
cd frontend
```

In the root directory, create a file called .env and paste these and save
```sh
API_URL="http://localhost:8080/api"
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
```
After that, run the command to install dependencies
```sh
npm install
```
And finally run the app using
```sh
npm run dev
```

Visit http://localhost:3000 on your browser to see it running.


### APIs:

To get extensive details of the apis, visit http://localhost:8080/api-docs after running the backend server

### Authentication

When a user logs in via the `/api/auth/login` endpoint, a JWT token is returned. This token is then stored in cookies on the frontend. For every subsequent request, the JWT token is retrieved from the cookies and sent along with the request.