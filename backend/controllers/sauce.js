const Sauce = require('../models/sauce');
const fs = require('fs');

// Création d'une sauce //
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée'}))
    .catch(error => res.status(400).json({ error }));
}

// Modification d'une sauce déjà existante //
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
         } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({message: 'Sauce modifiée'}))
        .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce // 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(sauce => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json( { error }));
    
};

// Obtenir une sauce en particulier //
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};


// Obtenir toutes les sauces //
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}));
};

// Like & Dislike //
exports.likeAndDislike = (req, res, next) => {
    const like = req.body.like
    const user = req.body.userId
    const sauceId = req.params.id

        if (like === 1) { // Ajoute un like //
            Sauce.updateOne(
                { _id: sauceId },
                { $push: { usersLiked: user },
                  $inc: { likes: like }, 
            }
            )
            .then(() => res.status(200).json({ message: 'Like ajouté' }))
            .catch((error) => res.status(400).json({ error }));
        }

        if (like === -1) { // Ajoute un dislike //
            Sauce.updateOne(
                { _id: sauceId },
                { $push: { usersDisliked: user },
                  $inc: { dislikes: -like },
            }
            )
            .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
            .catch((error) => res.status(400).json({ error }));
        }
        if (like === 0) { // Si il s'agit d'annuler un like ou un dislike //
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(user)) { // Si il s'agit d'annuler un like //
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersLiked: user },
              $inc: { likes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Like supprimé' }))
            .catch((error) => res.status(400).json({ error }))
        }
        if (sauce.usersDisliked.includes(user)) { // Si il s'agit d'annuler un dislike //
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: user },
              $inc: { dislikes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Dislike supprimé' }))
            .catch((error) => res.status(400).json({ error }))
        }
      })
      .catch((error) => res.status(404).json({ error }))
      }
    }