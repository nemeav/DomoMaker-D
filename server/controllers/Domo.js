// reformatted bc eslint hates me
const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  res.render('app');
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.color) {
    return res.status(400).json({ error: 'Name, age, and favorite color are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    color: req.body.color,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, color: newDomo.color });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age color').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

// DIY Section - community-ish tab
const getStats = async (req, res) => {
  try {
    // find all docs in domo db
    const domoStats = await Domo.find().select('age').lean();
    const statCount = domoStats.length;

    if (statCount === 0) {
      return res.status(200).json({ stats: {} });
    }

    // calculating distribution of all user's domo
    const bucket1 = domoStats.filter((domo) => domo.age <= 10);
    const bucket2 = domoStats.filter((domo) => domo.age >= 11 && domo.age <= 20);
    const bucket3 = domoStats.filter((domo) => domo.age >= 21 && domo.age <= 30);
    const bucket4 = domoStats.filter((domo) => domo.age >= 31 && domo.age <= 40);
    const bucket5 = domoStats.filter((domo) => domo.age >= 41 && domo.age <= 50);
    const bucket6 = domoStats.filter((domo) => domo.age >= 51);

    const docs = {
      stat1: (bucket1.length / statCount),
      stat2: (bucket2.length / statCount),
      stat3: (bucket3.length / statCount),
      stat4: (bucket4.length / statCount),
      stat5: (bucket5.length / statCount),
      stat6: (bucket6.length / statCount),
    };

    return res.status(200).json({ stats: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving stats!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  getStats,
};
