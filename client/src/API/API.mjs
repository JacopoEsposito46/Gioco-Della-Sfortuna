const SERVER_URL = "http://localhost:3001";

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    credentials: "include",
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user; // an object with the error coming from the server
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) return null;
};

const startGame = async (demo) => {
  const response = await fetch(SERVER_URL + "/api/game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ demo }),
  });
  if (response.ok) {
    const gameData = await response.json();
    return gameData;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};


const getGameHistory = async (id_user) => {
  const response = await fetch(SERVER_URL + `/api/user/${id_user}/games`, {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    const history = await response.json();
    return history;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

const getScore = async (id_card) => {
  const response = await fetch(SERVER_URL + `/api/card/${id_card}`, {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    const score = await response.json();
    return score;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

const addRound = async (id_game, nround, id_card,  status) => {
  const response = await fetch(SERVER_URL + `/api/game/${id_game}/round`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id_card, nround, status }),
  });
  if (response.ok) {
    const id_round = await response.json();
    return id_round;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

const getRandomCard = async (id_game) => {
  const response = await fetch(SERVER_URL + `/api/card/random?id_game=${id_game}`, {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    const card = await response.json();
    return card;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

const updateGameStatus = async (id_game) => {
  const response = await fetch(SERVER_URL + `/api/game/${id_game}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.ok) {
    const gameStatus = await response.json();
    return gameStatus;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

const API = {
  logIn,
  getUserInfo,
  logOut,
  startGame,
  getGameHistory ,
  getScore, 
  addRound,
  getRandomCard,
  updateGameStatus,
};

export default API;
