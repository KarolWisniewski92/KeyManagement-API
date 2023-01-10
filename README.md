----------------------------------------- Application description -------------------------------------------------------

The application was created for the needs of simple management of sets of keys taken and returned by field employees.</br>
The application provides several useful features like:
- Taking the key
- Returning the key
- Adding a new key to the set
- Transferring the key to another user
(receiving user confirmation required).
- Support multiple sets of keys
- Registration and review of historical data for each key.

Frontend part was built based on the react framework with libraries like:
- React-Redux
- Styled-Components
- React-Final-Form
- React-Transition-Group

Backend part was built based on node.js and the mongoDB database with libraries like:
- express.js
- passport.js
- mongoose

----------------------------------------- How to start --------------------------------------------------------------------

1) Install and run mongoDB.</br>
The database should be named keyMenagmentDB and should contain the collections:</br>
- histories
- keys
- users

2) Create .env file for backend. Requires the following parameters:</br>
//The following data are examples, please complete with your own data.</br>

          PORT=3000
          CLIENT_PORT=3001
          DB_HOST='mongodb://localhost:27017/keyManagmentDB'
          CLIENT_IP_ADRESS='http://192.168.0.120'

3) Create .env file for frontend. Requires the following parameters:</br>
//The following data are examples, please complete with your own data.</br>

          REACT_APP_SERVER=http://192.168.0.120:3000

4) use npm start in terminal KeyManagement-API to run the backend.

5) use npm start in terminal KeyManagement-WEB-Client to run the frontend.

