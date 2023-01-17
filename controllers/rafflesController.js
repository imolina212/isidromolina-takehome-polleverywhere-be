const express = require("express");
const raffles = express.Router();

const {
	getRafflesList,
	getRaffleById,
	createRaffle,
	getParticipantsByRaffleId,
	createParticipant,
	getWinnerByRaffleId,
	updateWinnerByRaffleId,
} = require("./..//queries/raffles");

// GET /api/raffles
raffles.get("/", async (_, response) => {
	try {
		const rafflesList = await getRafflesList();

		if (rafflesList.length === 0) {
			response.status(500).json({ error: "No Raffles Found" });
		} else {
			response.status(200).json(rafflesList);
		}
	} catch (error) {
		console.log(error);
	}
});

// POST /api/raffles
raffles.post("/", async (request, response) => {
	const { raffle_name, secret_token } = request.body;

	try {
		const createdRaffle = await createRaffle(raffle_name, secret_token);

		if (createdRaffle) {
			response.json(createdRaffle);
		} else {
			response.send("Raffle not created");
		}
	} catch (err) {
		response.status(500).send("An error occurred");
	}
});

// GET /api/raffles/:id - Retrieve a raffle by ID
raffles.get("/:id", async (request, response) => {
	const raffleId = request.params.id;
	try {
		const raffleById = await getRaffleById(raffleId);

		if (raffleById.length === 0) {
			response.status(500).json({ error: "Raffle Not Found" });
		} else {
			response.status(200).json(raffleById);
		}
	} catch (error) {
		console.log(error);
	}
});

// GET /api/raffles/:id/participants - Retrieve all participants for a raffle
raffles.get("/:id/participants", async (request, response) => {
	const raffleId = request.params.id;
	try {
		const raffleById = await getParticipantsByRaffleId(raffleId);

		if (raffleById.length === 0) {
			response.status(500).json({ error: "Raffle Not Found" });
		} else {
			response.status(200).json(raffleById);
		}
	} catch (error) {
		console.log(error);
	}
});
// POST /api/raffles/:id/participants - Sign up a participant for a raffle
raffles.post("/:id/participants", async (request, response) => {
	const {
		params: { id: raffleId },
		body: participantInfo,
	} = request;
	try {
		const participant = await createParticipant(raffleId, participantInfo);

		if (participant) {
			response.status(200).json(participant);
		} else {
			response.status(500).json({ error: "Participant not created" });
		}
	} catch (error) {
		console.log(error);
	}
});

// GET /api/raffles/:id/winner - Retrieve the winner of a raffle
raffles.get("/:id/winner", async (request, response) => {
	const raffleId = request.params.id;

	try {
		const raffleWinner = await getWinnerByRaffleId(raffleId);

		if (!raffleWinner) {
			response.status(404).json({ error: "Winner Not Found" });
		} else {
			response.status(200).json(raffleWinner);
		}
	} catch (error) {
		console.log(error);
		response.status(500).json({ error: "Server issue" });
	}
});

// PUT /api/raffles/:id/winner
raffles.put("/:id/winner", async (request, response) => {
	const raffleId = request.params.id;
	const { secret_token } = request.body;
	try {
		const raffle = await getRaffleById(raffleId);
		const checkSecretToken = raffle?.secret_token === secret_token;
		const participants = await getParticipantsByRaffleId(raffleId);
		console.log(secret_token, checkSecretToken, raffle);

		if (checkSecretToken && participants?.length) {
			const winnerIndex = Math.floor(Math.random() * participants.length);
			await updateWinnerByRaffleId(
				participants[winnerIndex].id,
				raffleId,
				secret_token
			);
			response.status(200).json(participants[winnerIndex]);
		} else {
			response.status(404).json({ error: "Error" });
		}
	} catch (error) {
		console.log(error);
	}
});

module.exports = raffles;
