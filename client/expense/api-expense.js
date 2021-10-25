const create = async (credentials, expense) => {
  try {
    let response = await fetch("/api/expenses/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify(expense),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create };
