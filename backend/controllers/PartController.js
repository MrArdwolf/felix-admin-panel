import PartModel from "../models/PartModel.js";
import jwt from "jsonwebtoken";
import FormConnectionModel from "../models/FormConnectionModel.js";



async function addPart(req, res) {
    try {
        const part = req.body;

        const { name, price, parent } = part;
        if (!name || !price) {
            res.statusCode = 400;
            throw new Error("Missing data")
        }

        if (parent) {
            const isParentExist = await PartModel.findOne({
                _id: parent,
            });
            if (!isParentExist) {
                res.statusCode = 404;
                throw new Error("Parent not found")
            }
        }

        const userToken = req.cookies.authToken;
        let user = null;
        if (!userToken) {
            res.statusCode = 401;
            throw new Error("Unauthorized");
        }

        jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("Unauthorized", err);
            }
            user = decoded.id;
        });

        // now create the part;
        const newPart = await PartModel.create({
            name,
            price,
            parent,
            children: [],
            createdBy: user,
        });

        if (parent) {
            const partId = newPart._id;
            await PartModel.updateOne({ _id: parent }, { $push: { children: partId } });
        }

        // Send the newPart as response;
        res.status(200).json({
            status: 201,
            success: true,
            message: "Part created Successfully",
            part: newPart,
        });
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}

async function getParts(req, res) {
    try {
        const userToken = req.cookies.authToken;
        let user = null;
        if (!userToken) {
            res.statusCode = 401;
            throw new Error("Unauthorized");
        }

        jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("Unauthorized", err);
            }
            user = decoded.id;
        });

        const part = await PartModel.find();
        res.json(part);
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}

async function getPartsByParent(req, res) {
    try {
        const userToken = req.cookies.authToken;
        let user = null;
        if (!userToken) {
            res.statusCode = 401;
            throw new Error("Unauthorized");
        }

        jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("Unauthorized", err);
            }
            user = decoded.id;
        });

        const part = await PartModel.find({ parent: req.params.id }).populate("parent");
        res.json(part);
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}

async function updatePart(req, res) {
    try {
        const Part = await PartModel.findById(req.params.id);
        if (!Part) {
            res.statusCode = 404;
            throw new Error("Part not found");
        }

        const userToken = req.cookies.authToken;
        let user = null;
        if (!userToken) {
            res.statusCode = 401;
            throw new Error("Unauthorized");
        }

        jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("Unauthorized", err);
            }
            user = decoded.id;
        });

        const body = req.body;
        if (!body.name && !body.price) {
            res.statusCode = 400;
            throw new Error("No data to update Part");
        }
        body.changedLastBy = user;

        function validateFormConnections(formConnections) {
            formConnections.forEach(connection => {
                FormConnectionModel.findOne({ label: connection })
                    .then(existingConnection => {
                        if (!existingConnection) {
                            return FormConnectionModel.create({
                                label: connection,
                                part: req.params.id,
                            });
                        } else {
                            // If the connection exists but is not linked to this part, update it
                            if (!existingConnection.part.includes(req.params.id)) {
                                FormConnectionModel.updateOne({ _id: existingConnection._id }, { part: [...existingConnection.part, req.params.id] })
                                    .catch(err => {
                                        throw new Error(`Error updating form connection: ${err.message}`);
                                    });
                            }
                        }
                    })
                    .catch(err => {
                        throw new Error(`Error checking form connection: ${err.message}`);
                    });
            });
        }

        if (body.formConnections) {
            validateFormConnections(body.formConnections);
            if (body.formConnections.length === 0) {
                // If no formConnections provided, clear existing connections for this part
                console.log("No form connections provided, clearing existing connections.");
                const existingConnections = await FormConnectionModel.find({ part: req.params.id });
                existingConnections.forEach(async (connection) => {
                    await FormConnectionModel.updateOne({ _id: connection._id }, { part: connection.part.filter(p => p.toString() !== req.params.id) });
                });
            }
            if (Part.formConnections && Part.formConnections.length > 0) {
                // Remove part from old connections that are no longer associated
                const connectionsToRemove = Part.formConnections.filter(conn => !body.formConnections.includes(conn));
                connectionsToRemove.forEach(async (connection) => {
                    const existingConnection = await FormConnectionModel.findOne({ label: connection });
                    if (existingConnection) {
                        await FormConnectionModel.updateOne({ _id: existingConnection._id }, { part: existingConnection.part.filter(p => p.toString() !== req.params.id) });
                    }
                });
            }
        }

        const updatedPart = await PartModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Part has been updated", data: updatedPart });
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}

async function deletePart(req, res) {
    try {
        const userToken = req.cookies.authToken;
        let user = null;
        if (!userToken) {
            res.statusCode = 401;
            throw new Error("Unauthorized");
        }

        jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("Unauthorized", err);
            }
            user = decoded.id;
        });

        const Part = await PartModel.findById(req.params.id);
        if (!Part) {
            res.statusCode = 404;
            throw new Error("Part not found");
        }

        if (Part.children.length > 0) {
            Part.children.forEach(async (childId) => {
                await PartModel.findByIdAndDelete(childId);
            });
        }

        if (Part.parent) {
            await PartModel.updateOne({ _id: Part.parent }, { $pull: { children: Part._id } });
        }

        await PartModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Part has been deleted" });
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}





export default {
    addPart,
    getParts,
    getPartsByParent,
    updatePart,
    deletePart,
}