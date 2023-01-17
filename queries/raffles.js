const db = require("../db/index.js");

const getRafflesList = async () => {
	try {
		const rafflesList = await db.any("SELECT * FROM raffles");
		return rafflesList;
	} catch (err) {
		return err;
	}
};
const getRaffleById = async (raffleId) => {
	try {
		const raffle = await db.one(
			"SELECT * FROM raffles WHERE id=$1",
			raffleId
		);
		return raffle;
	} catch (err) {
		return err;
	}
};
const createRaffle = async (raffle_name, secret_token) => {
	console.log(raffle_name, secret_token);
	try {
		const newRaffle = await db.one(
			"INSERT INTO raffles (raffle_name, secret_token) VALUES ($1, $2) RETURNING *",
			[raffle_name, secret_token]
		);
		return newRaffle;
	} catch (err) {
		return err;
	}
};

const getParticipantsByRaffleId = async (raffleId) => {
	try {
		const participant = await db.any(
			"SELECT * FROM participants WHERE raffle_id=$1",
			raffleId
		);
		return participant;
	} catch (err) {
		return err;
	}
};

const createParticipant = async (raffle_id, participantInfo) => {
	const { firstname, lastname, email, phone } = participantInfo;
	try {
		const participant = await db.one(
			"INSERT INTO participants (raffle_id, firstname, lastname, email, phone) VALUES($<raffle_id>, $<firstname>, $<lastname>, $<email>, $<phone>)",
			{ raffle_id, firstname, lastname, email, phone }
		);
		return participant;
	} catch (err) {
		return err;
	}
};

const getWinnerByRaffleId = async (raffleId) => {
	try {
		const winner = await db.any(
			"SELECT winner_id, firstname, lastname, email, phone FROM raffles JOIN participants ON raffles.winner_id=participants.id WHERE raffles.id=$1",
			raffleId
		);
		console.log(winner);
		return winner;
	} catch (err) {
		console.log(err);
		return err;
	}
};

const updateWinnerByRaffleId = async (winner_id, raffle_id, secret_token) => {
	try {
		const winner = await db.any(
			"UPDATE raffles SET winner_id=$1 WHERE id=$2 AND raffles.secret_token=$3",
			[winner_id, raffle_id, secret_token]
		);
		return winner;
	} catch (err) {
		return err;
	}
};

module.exports = {
	getRafflesList,
	getRaffleById,
	createRaffle,
	getParticipantsByRaffleId,
	createParticipant,
	getWinnerByRaffleId,
	updateWinnerByRaffleId,
};
