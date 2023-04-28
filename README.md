# Makrukthai Plus
![Makrukthai Plus](https://raw.githubusercontent.com/natstpt/Makrukthai-Plus/main/documentation/makrukthai_screen.png)

Makrukthai Plus is a real-time Node.js makrukthai platform with MongoDB, allowing users to enjoy friendly matches, practice against AI, chat, search for users, and track their ratings. It is powered by Express, Mongoose, Socket.io, Chessboard, and Passport.

## Features
- Real-time chess matches with friends or random opponents
- Chat with friends
- Quick play against random opponents
- Practice against Artificial Intelligence
- Search for users
- Send friend requests
- Rating system based on match history
- User-friendly interface

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/live-chess-online.git
```
2. Install dependencies from this node_modules (It is not recommended to use "npm install" as some things cannot be updated and it causes application defect.):
```bash
cd makrukthai-plus
```
3. Install and Configure your MongoDB 3.4.24 (connection string in makrukthai-plus/config/database.js):
```bash
module.exports = {
    mongoURI: "mongodb+srv://username:password@yourcluster.mongodb.net/database"
};
```
4. Run MongoDB:
```bash
mongod
```
5. Run the application:
```bash
npm start
```
6. Access the platform in your browser at http://127.0.0.1:8080.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgements

I would like to thank the authors and contributors of the following libraries, which have made this project possible:

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Socket.io](https://socket.io/)
- [Chessboard.js](https://chessboardjs.com/)
- [Passport](http://www.passportjs.org/)
- [Chess-Plus](https://github.com/kshitij98/Chess-Plus)
