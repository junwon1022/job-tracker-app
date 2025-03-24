import { Request, Response, RequestHandler} from "express";
import User from "../models/User";

// send friend request
export const sendFriendRequest = async (req: Request, res: Response): Promise<void> => {
    const { userId, friendCode } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findOne({ friendCode });

    if(!user) {
        res.status(404).json({ message: "User not found" });  
        return;
    }
    if (!friend) {
        res.status(404).json({ message: "Friend not found" });
        return;
    }

    // Cannot added oneself as a friend
    if (friend.friendCode === user.friendCode) {
        res.status(400).json({ msg: "Cannot add yourself" });
        return;
    }

    // Request already sent to user
    if (friend.friendRequests.includes(user.friendCode)) {
        res.status(400).json({ msg: "Request already sent" });
        return;
    }

    // Two users are already added as friends
    if (friend.friends.includes(user.friendCode)) {
        res.status(400).json({ msg: "Already friends" });
        return;
    }
    
    friend.friendRequests.push(user.friendCode);
    await friend.save();

    res.json({ msg: "Friend request sent" });
};

// Accept friend request
export const acceptFriendRequest = async(req: Request, res: Response): Promise<void> => {
    const {userId, requesterCode} = req.body;

    const user = await User.findById(userId);
    const friend = await User.findOne({friendCode: requesterCode});

    if(!user) {
        res.status(404).json({msg: "No user found"});
        return;
    }
    if(!friend) {
        res.status(404).json({msg: "No friend user found"});
        return;
    }
    // Check if requesting user actually requested
    if(!user.friendRequests.includes(requesterCode)) {
        res.status(400).json({msg: "No such friend request"});
        return;
    } 

    if(!user.friends.includes(requesterCode)) user.friends.push(requesterCode);
    if(!friend.friends.includes(user.friendCode)) friend.friends.push(user.friendCode);

    // Remove the incoming request from current user
    user.friendRequests = user.friendRequests.filter(code => code != requesterCode);

     // Remove the reverse pending request, if it exists
    if (friend.friendRequests.includes(user.friendCode)) {
        friend.friendRequests = friend.friendRequests.filter(code => code !== user.friendCode);
    }

    await user.save();
    await friend.save();

    res.json({msg: "Friend Request Received!"});
}

// Reject friends request
export const rejectFriendRequest = async (req: Request, res: Response): Promise<void> => {
    const { userId, requesterCode } = req.body;
  
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ msg: "User not found" });
        return;
    }
  
    user.friendRequests = user.friendRequests.filter(code => code !== requesterCode);
    await user.save();
  
    res.json({ msg: "Friend request rejected" });
};

// DELETE Friend
export const deleteFriend = async(req: Request, res: Response): Promise<void> => {
    const { userId, friendCode } = req.body;

    try {
        const user = await User.findById(userId);
        const friend = await User.findOne({ friendCode });

        if(!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!friend) {
            res.status(404).json({ msg: "Friend not found" });
            return;
        }

        if (user.friends.includes(friend.friendCode)) {
            user.friends = user.friends.filter((code) => code !== friend.friendCode);
            await user.save();
        }

        res.json({ msg: "Friend deleted successfully" });
        return;
    } catch(error) {
        console.error("Error deleting friend:", error);
        res.status(500).json({ msg: "Server error" });
        return;
    }
}
