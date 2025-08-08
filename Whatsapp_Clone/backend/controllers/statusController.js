const { uplodFileToCloudinary } = require("../config/cloudinary");
const Status = require("../models/statusModel");
const response = require("../utils/responseHandler");

const createStatus = async (req, res) => {
    try {
        const { content, contentType } = req.body;
        const userId = req.user.userId
        const file = req.file;

        let mediaUrl = null;
        let finalContentType = contentType || 'text'

        //Handle File Upload
        if (file) {
            const uploadFile = await uplodFileToCloudinary(file);
            if (!uploadFile?.secure_url) {
                return response(res, 400, "Failed to Upload Media..");
            };
            mediaUrl = uploadFile?.secure_url;

            if (file.mimtype.startwith('image')) {
                finalContentType = 'image';
            } else if (file.mimtype.startwith('video')) {
                finalContentType = 'video';
            } else {
                return response(res, 400, 'UnSupported File Formaet');
            }
        } else if (content?.trim()) {
            finalContentType = 'text';
        } else {
            return response(res, 400, "Message Content Is required..");
        }

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const status = new Status({
            user: userId,
            content: mediaUrl || content,
            contentType: finalContentType,
            expiresAt,
        });

        await status.save();

        const populatedStatus = await Status.findOne(status?._id)
            .populate("user", "username profilePicture")
            .populate("viewers", "username profilePicture")

        //Emit Socket Event
        if (req.io && req.socketUserMap) {
            //Broadcasting to All Connecting User except creator
            for (const [connectedUserId, socketId] of req.socketUserMap) {
                if (connectedUserId !== userId) {
                    req.io.to(socketId).emit("new_status", populatedStatus);
                }
            }
        }

        return response(res, 201, "Status Send Successfully", populatedStatus)
    } catch (error) {
        console.error(error);
        return response(res, 500, 'Internal server error.');
    }
};


const getStatuses = async (req, res) => {
    try {
        const statuses = await Status.find({ expiresAt: { $gt: new Date() } })
            .populate("user", "username profilePicture")
            .populate("viewers", "username profilePicture").sort({ createdAt: -1 })

        return response(res, 200, "Status Retrived Successfully..", statuses)
    } catch (error) {
        console.error(error);
        return response(res, 500, 'Internal server error.');
    }
};

const viewStatus = async (req, res) => {
    const { statusId } = req.params;
    const userId = req.user.userId;

    try {
        const status = await Status.findById(statusId);
        if (!status) {
            return response(res, 404, "Status Not Found..")
        }

        if (!status.viewers.includes(userId)) {
            status.viewers.push(userId);
            await status.save();

            const updateStatus = await Status.findById(statusId)
                .populate("user", "username profilePicture")
                .populate("viewers", "username profilePicture");


            //Emit Socket event 
            if (req.io && req.socketUserMap) {
                //Broadcasting to All Connecting User except creator
                const statusOwnerSocketId = req.socketUserMap.get(status.user._id.toString());
                if (statusOwnerSocketId) {
                    const viewData = {
                        statusId,
                        viewerId: userId,
                        totalViewers: updateStatus.viewers.length,
                        viewers: updateStatus.viewers
                    }

                    res.io.to(statusOwnerSocketId).emit("status_viewed", viewData)
                } else {
                    console.log("Status Owner Are not Connected");
                }
            }

        } else {
            console.log("User Already Status Viewed");
        }

        return response(res, 200, "Status Viewd Successfully")
    } catch (error) {
        console.error(error);
        return response(res, 500, 'Internal server error.');
    }
};

const deleteStatus = async (req, res) => {
    const { statusId } = req.params;
    const userId = req.user.userId;

    try {
        const status = await Status.findById(statusId);
        if (!status) {
            return response(res, 404, "Status Not Found..")
        }

        if (status.user.toString() !== userId) {
            return response(res, 403, "Not authorized to delete this status")
        }

        await status.deleteOne();

        //Emit Socket Event
        if (req.io && req.socketUserMap) {
            //Broadcasting to All Connecting User except creator
            for (const [connectedUserId, socketId] of req.socketUserMap) {
                if (connectedUserId !== userId) {
                    req.io.to(socketId).emit("status_deleted", statusId);
                }
            }
        }
        return response(res, 200, "Status Viewd Successfully")
    } catch (error) {
        console.error(error);
        return response(res, 500, 'Internal server error.');
    }
}

module.exports = { createStatus, getStatuses, viewStatus, deleteStatus }