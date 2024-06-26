const con = require("./db_connect")

async function createTable() {
  let sql = `CREATE TABLE IF NOT EXISTS UserData (
    UserID INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    CONSTRAINT userPK PRIMARY KEY(userID)
  );`

  await con.query(sql);
}

createTable()

// CRUD functions will go here 
//R for READ -- get all users
async function getAllUsers() {
  let sql = `SELECT * FROM UserData;`
  return await con.query(sql)
}
async function getUserData(user) {
  let sql = `SELECT * FROM UserData 
    WHERE Username = "${user.username}" OR Email = "${user.useremail}" OR UserID ="${user.userid}";`
  let p1 = await con.query(sql)
  if (p1.length == 0) throw Error("Username/Email doesn't exist!!")
  return p1
}

async function userExists(username) {
  let sql = `SELECT * FROM UserData 
    WHERE Username = "${username}"
  `
  return await con.query(sql)
}

async function emailExists(email) {
  let sql = `SELECT * FROM UserData 
    WHERE Email = "${email}"
  `
  return await con.query(sql)
}

// let user = {
//     FirstName: "Nanda",
//     LastName: "Kumar",
//     Username: "Nanda003",
//     Email: "nanda@gmail.com",
//     Password: "icecream"
// }

// CREATE in CRUD
async function register(user) {
  let cUser = await userExists(user.Username)
  if (cUser.length > 0) throw Error("Username is taken! &#128577")

  let email = await emailExists(user.Email)
  if (email.length > 0) throw Error("Account with this Email is already registered! &#128577")

  let sql = `
    INSERT INTO UserData(FirstName,LastName,Username,Email,Password)
    VALUES("${user.FirstName}","${user.LastName}","${user.Username}", "${user.Email}", "${user.Password}")
  `
  await con.query(sql)
  const u = await userExists(user.Username)
  return u[0]
}

// READ in CRUD
async function login(user) {
  let currentUser = await userExists(user.Username)
  if (!currentUser[0]) throw Error("Username does not exist! &#128577")
  if (user.Password !== currentUser[0].Password) throw Error("Password does not match! &#128577")

  return currentUser[0]
}

// UPDATE in CRUD
async function editUsername(user) {
  let sql = `
    UPDATE UserData SET
    Username = "${user.Username}"
    WHERE UserID = ${user.UserID}
  `
  await con.query(sql)

  let updatedUser = await userExists(user.Username)
  return updatedUser[0]
}

async function editPassword(user) {
  let updatedUser = await userExists(user.Username)
  if (updatedUser.length > 0) {
    let sql = `
    UPDATE UserData SET
    Password  = "${user.Password}"
    WHERE Username = "${user.Username}";
  `
    await con.query(sql)
    return updatedUser[0]
  }
  else {
    throw Error(`User doesn't Exist.!!`)
  }
}

// DELETE in CRUD
async function deleteAccount(user) {
  let sql = `
    SELECT * FROM UserData
    WHERE UserID = ${user.UserID}
  `
  let p = await con.query(sql)
  if (p.length > 0) {
    sql = `
    DELETE FROM UserData
    WHERE UserID = ${user.UserID}
  `
    await con.query(sql)
  }
  else {
    throw Error(`User '${user.UserID}', doesn't Exist!!`)
  }
}
module.exports = { getAllUsers, getUserData, userExists, emailExists, login, register, editUsername, deleteAccount, editPassword }