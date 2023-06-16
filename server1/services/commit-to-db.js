const commitToDb = async function (promise, req, res) {
  await promise
    .then((data) => {
      // console.log("data", data);
      return res.json(data);
    })
    .catch((error) => {
      console.log("error", error);
      return res.json(error.message);
    });
  // res.json(data);
  // if (error) return res.json(error.message);
}

module.exports = {commitToDb};
