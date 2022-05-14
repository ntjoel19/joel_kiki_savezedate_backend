const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const fs = require("fs");

/*  User's controllers, here are all the user's controllers we use SQL DB   **
 **  Signup Funtion, to create an user, with all informations required       **
 **  Secure Login Function, to make all the needed to be connect             **
 **  getOne & getAs to get back all the user's informations correctly        **
 **  modifAccount, to make user able to modify his account informations      **
 **  modifyPassword to make user able to modify his password on a secure way **
 **  delete function to make user able to delete his account                 */

////////////////////////////  Post Creation Function  ////////////////////////////

exports.signup = (req, res, next) => {
  // Here are defined all filled fields
  const user = {
    nom_prenom: req.body.name,
    categorie: req.body.categorie,
    famille: req.body.famille,
    id_epoux_e: req.body.id_epoux_e,
  };
  // Here the request use "multer" management to be sent, and default values
  let sql = `INSERT INTO user (nom_prenom, categorie, famille, id_epoux_e) VALUES (?,?,?,?);`;
  pool.execute(
    sql,
    [user.nom_prenom, user.categorie, user.famille, user.id_epoux_e],
    (err, result) => {
      if (err) throw err;

      res.status(201).json({ message: `utilisateur ajouté` });
    }
  );
};

//////////////////////////// Delete Fuction ////////////////////////////

/*  Delete user Function                                            **
 **  Here we add bcrypt method, so there is a security verification  **
 **  If account password match to user id account, so user will be   **
 **  granted to succefuly delete his account                         */

exports.delete = (req, res, next) => {
  if (req.body.password) {
    let sql = `SELECT * FROM user WHERE id=?`;
    pool.execute(sql, [req.params.id], function (err, result) {
      let user = result[0];
      console.log(user);
      bcrypt
        .compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: " Mot de passe incorrect !" });
          } else {
            bcrypt
              .hash(req.body.password, 10)
              .then(hash => {
                let sql = `DELETE FROM user WHERE id=?`;
                pool.execute(sql, [user.id], function (err, result) {
                  if (err) throw err;
                  console.log(result);
                  res.status(200).json({
                    message: `Compte numéro ${req.params.id} supprimé`,
                  });
                });
              })
              .catch(error =>
                res.status(500).json({ error: "Suppression impossible" })
              );
          }
        })
        .catch(error =>
          res.status(400).json({ message: "Erreur d'Authentification" })
        );
    });
  }
};
