import { prisma } from "../../utils/prisma";
import { Role } from "../../../generated/prisma/enums";
import { randomUUID } from "crypto";

export async function getAllUsers() {
	return prisma.user.findMany();
}

export async function getUserById(id: number) {
	return prisma.user.findUnique({ where: { id } });
}

export async function findOrCreateUser(phoneNumber: string) {
	let user = await prisma.user.findUnique({ where: { phoneNumber } });
	if (!user) {
		user = await prisma.user.create({ data: { phoneNumber } });
	}
	return user;
}

export async function createUser(data: { phoneNumber: string; role?: Role }) {
	return prisma.user.create({ data });
}

export async function updateUserRole(userId: number, role: Role) {
	return prisma.user.update({ where: { id: userId }, data: { role } });
}

export async function deleteUser(userId: number) {
	return prisma.user.delete({ where: { id: userId } });
}

export async function createTokenForUser(userId: number, expiresAt?: Date) {
	const token = randomUUID();
	const created = await prisma.token.create({
		data: { token, userId, expiresAt },
	});
	return created;
}
