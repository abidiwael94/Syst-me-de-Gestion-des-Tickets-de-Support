const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    // Récupérer le token depuis le cookie
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    try {
      // Vérification du token avec la clé secrète
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Recherche de l'utilisateur dans la base de données
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      // Vérification des rôles, si spécifié
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Accès refusé, rôle insuffisant' });
      }

      // Ajouter l'utilisateur à la requête
      req.user = user;

      // Passer au middleware suivant
      next();
    } catch (err) {
      console.error("Erreur de vérification du token :", err);
      res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  };
};

module.exports = auth;
