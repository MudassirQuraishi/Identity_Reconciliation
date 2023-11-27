const User = require("../Models/contact");
const Logger = require("../Utilities/Logger");

function inputValidation(email, phoneNumber) {
    const emailPattern = /^\S+@\S+\.\S+$/;
    const phonePattern = /^(\+\d{1,2})?\d{10}$/;
    if (!emailPattern.test(email) || !phonePattern.test(phoneNumber)) {
        return false;
    }

    return true;
}

function Payload(
    primaryContactId,
    emails = [],
    phoneNumbers = [],
    secondaryContactIds = []
) {
    return {
        primaryContactId: primaryContactId,
        emails: emails,
        phoneNumbers: phoneNumbers,
        secondaryContactIds: secondaryContactIds,
    };
}

const generatePayload = async (user) => {
    try {
        Logger.log(
            `Generating Payload for user with id ${user._id.toHexString()}.`
        );
        let payload = {};
        if (user.linkedId === null && user.linkPrecedence === "Primary") {
            payload = Payload(
                user._id.toHexString(),
                [user.email],
                [user.phoneNumber]
            );
            Logger.info(
                `Payload has been generated for primary user with user id ${user._id.toHexString()}.`
            );
            return payload;
        } else if (user.linkPrecedence === "Secondary") {
            const duplicateContacts = await User.find({
                $or: [
                    {
                        linkedId: user.linkedId,
                    },
                    { _id: user.linkedId },
                ],
            });
            payload = Payload(user.linkedId.toHexString());
            duplicateContacts.forEach((contact) => {
                payload.emails.push(contact.email);
                payload.phoneNumbers.push(contact.phoneNumber);
                payload.secondaryContactIds.push(contact._id.toHexString());
            });
            Logger.info(
                `Payload has been generated for secondary user linked with user id ${user._id.toHexString()}.`
            );
            return payload;
        }
        Logger.warn(
            `Something went wrong while generating payload for user with user id ${user._id.toHexString()}.`
        );
        return false;
    } catch (err) {
        console.log(err);
        Logger.error(
            `Error while generating payload for user id ${user._id.toHexString()}. Error : ${
                err.message
            }.`
        );
        throw new Error(`Error Generating Payload. Error :${err.message}.`);
    } finally {
        Logger.log(
            `Exiting payload generation for user id ${user._id.toHexString()}.`
        );
    }
};

const alreadyExists = async (email, phoneNumber) => {
    try {
        Logger.log(
            `Checking for existing primary user with user id ${user._id.toHexString}.`
        );
        const user = await User.findOne({
            $or: [{ email: email }, { phoneNumber: phoneNumber }],
        });

        if (!user || user.length === 0) {
            Logger.info("No user found. Sending empty data.");
            return [];
        }
        if (user.linkPrecedence === "Primary") {
            Logger.info(
                "Existing primary user found. Sending primary user data."
            );
            return user;
        }
        if (user.linkPrecedence === "Secondary" && user.linkedId) {
            Logger.info(
                "Existing secondary user found. Checking for linked primary user."
            );
            const primaryUser = User.findById(user.linkedId);
            Logger.info("Primary user found. Sending primary user data.");
            return primaryUser;
        } else {
            Logger.warn(
                `Something went wrong while checking for primary user with id ${user._id.toHexString()}.`
            );
            return [];
        }
    } catch (err) {
        console.error(err);
        Logger.error(
            `Error while checking for existing user data. Error : ${err.message}.`
        );
        throw new Error(`Error Checking User. Error : ${err.message}`);
    } finally {
        Logger.log(
            `Checking for existing user data finsished with id ${user._id.toHexString()}.`
        );
    }
};

const createOrUpdate = async (email, phoneNumber) => {
    try {
        const existingUser = await alreadyExists(email, phoneNumber);
        if (!existingUser || existingUser.length === 0) {
            Logger.info("Creating a new primary user.");
            const newUser = await User.create({
                email: email,
                phoneNumber: phoneNumber,
                linkedId: null,
                linkPrecedence: "Primary",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            Logger.info("Sending newly created primary user data.");
            return { user: newUser, message: "New Primary User Created." };
        } else {
            if (
                existingUser.email === email &&
                existingUser.phoneNumber === phoneNumber
            ) {
                Logger.info("User with exact details already exists.");
                return {
                    message: "Existing User - No Changes made.",
                    user: existingUser,
                };
            } else {
                Logger.info("Creating a new secondary user.");
                const newUser = await User.create({
                    email: email,
                    phoneNumber: phoneNumber,
                    linkedId: existingUser._id,
                    linkPrecedence: "Secondary",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                Logger.info("Sending Data Back.");
                return {
                    user: newUser,
                    message: "New Secondary User Created.",
                };
            }
        }
    } catch (err) {
        console.error(err);
        Logger.error(`Error while creatig a new user. Error : ${err.message}`);
        throw new Error(`Error Creating a new Entry. Error : ${err.message}`);
    } finally {
        Logger.log("Exiting creating function.");
    }
};

exports.handleRequest = async (req, res) => {
    try {
        Logger.log("HTTP request intercepted by middleware.");
        const { email, phoneNumber } = req.body;
        if (!email || !phoneNumber) {
            Logger.error("No information provide on email or phone number.");
            return res
                .status(400)
                .json({ message: "Missing email or phoneNumber." });
        }
        Logger.log("Validating user details");
        if (!inputValidation(email, phoneNumber)) {
            Logger.error(
                "Input data validation failed. The data provied is not valid."
            );
            return res
                .status(400)
                .json({ message: "Invalid email or phoneNumber." });
        }

        const { user } = await createOrUpdate(email, phoneNumber);
        const payload = await generatePayload(user);
        Logger.info(
            "Sending response back to the cliet with new user details."
        );
        return res.status(200).json(payload);
    } catch (err) {
        console.error(err);
        Logger.error(`Error while processing input request`);
        return res.status(500).json({ message: "Error processing request" });
    } finally {
        Logger.log("Exiting the HTTP connection.");
    }
};
